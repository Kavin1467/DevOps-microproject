import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './src/data/mockProducts.ts';
import { Product, Order, OrderStatus, NotificationItem } from './src/types/ecommerce.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory persistent state (seeded with mock data)
let products: Product[] = [...INITIAL_PRODUCTS];
let orders: Order[] = [...INITIAL_ORDERS];
let notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Order Shipped!',
    body: 'Your order #ORD-9481 has been picked up by FedEx Express.',
    type: 'order_status',
    orderId: 'ord-1001',
    orderNumber: 'ORD-9481',
    status: 'shipped',
    read: false,
    timestamp: '2026-10-04T18:45:00Z'
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert',
    body: 'Tactile Pro Keyboard has only 4 units remaining in inventory.',
    type: 'inventory_alert',
    read: false,
    timestamp: '2026-10-05T00:30:00Z'
  }
];

// --- API ROUTES ---

// GET /api/products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort } = req.query;
  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.tagline.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // default: featured first, then newest
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  res.json({ products: filtered, total: filtered.length });
});

// POST /api/products (Admin create)
app.post('/api/products', (req: Request, res: Response) => {
  const { name, tagline, description, price, originalPrice, category, stock, images, features, specs, sku } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price and category are required' });
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    tagline: tagline || '',
    description: description || '',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    category,
    rating: 5.0,
    reviewCount: 0,
    stock: Number(stock) || 0,
    images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
    features: features || [],
    specs: specs || {},
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id (Admin update)
app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock
  };

  res.json(products[index]);
});

// DELETE /api/products/:id (Admin delete)
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const beforeLen = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length === beforeLen) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product removed' });
});

// GET /api/orders
app.get('/api/orders', (req: Request, res: Response) => {
  const { userId, isGuest } = req.query;
  if (userId) {
    const userOrders = orders.filter(o => o.userId === userId);
    return res.json({ orders: userOrders });
  }
  // Admin sees all
  res.json({ orders });
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// POST /api/checkout (Guest or registered user checkout)
app.post('/api/checkout', (req: Request, res: Response) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    discountCode,
    isGuest,
    userId,
    guestEmail
  } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1) {
    return res.status(400).json({ error: 'Valid shipping address is required' });
  }

  // Calculate totals and verify inventory
  let subtotal = 0;
  for (const item of items) {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      if (p.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${p.name}. Only ${p.stock} available.` });
      }
      subtotal += p.price * item.quantity;
      // Deduct stock
      p.stock = Math.max(0, p.stock - item.quantity);
    } else {
      subtotal += item.price * item.quantity;
    }
  }

  let discount = 0;
  if (discountCode) {
    const code = String(discountCode).toUpperCase();
    if (code === 'SAVE20') {
      discount = subtotal * 0.2;
    } else if (code === 'AURA10') {
      discount = Math.min(10, subtotal);
    } else if (code === 'FREESHIP') {
      discount = 15;
    }
  }

  const shippingFee = (subtotal - discount) >= 150 ? 0 : 15;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.0825).toFixed(2));
  const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

  const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId = `ord-${Date.now()}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    userId: isGuest ? undefined : userId,
    isGuest: Boolean(isGuest),
    guestEmail: isGuest ? (guestEmail || shippingAddress.email) : undefined,
    items,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    discountCode: discountCode || undefined,
    shippingFee,
    tax,
    total,
    paymentMethod: paymentMethod || 'card',
    paymentStatus: 'paid',
    transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    shippingAddress,
    status: 'processing',
    carrier: 'FedEx Express Priority',
    trackingNumber: `FDX-${Math.floor(100000000 + Math.random() * 900000000)}US`,
    estimatedDelivery: 'In 2-3 Business Days',
    timeline: [
      {
        status: 'pending',
        title: 'Order Confirmed',
        description: `Payment authorized via ${paymentMethod || 'Credit Card'}`,
        timestamp: now,
        completed: true
      },
      {
        status: 'processing',
        title: 'Fulfillment & Quality Audit',
        description: 'Items allocated and dispatched to packaging station',
        timestamp: now,
        completed: true
      },
      {
        status: 'shipped',
        title: 'Carrier Dispatch',
        description: 'Waiting for courier manifest scanning',
        timestamp: 'Estimated Next Business Day',
        completed: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier route dispatch',
        timestamp: 'Estimated 2 Days',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Safe dropoff with delivery proof photo',
        timestamp: 'Estimated 3 Days',
        completed: false
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  orders.unshift(newOrder);

  // Dispatch confirmation notification
  const notif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: 'Order Confirmed! 🎉',
    body: `Order #${orderNumber} for $${total.toFixed(2)} placed successfully. We are preparing your shipment!`,
    type: 'order_status',
    orderId: newOrder.id,
    orderNumber: newOrder.orderNumber,
    status: 'processing',
    read: false,
    timestamp: now
  };
  notifications.unshift(notif);

  res.status(201).json({
    success: true,
    order: newOrder,
    transactionId: newOrder.transactionId
  });
});

// PUT /api/orders/:id/status (Admin status update)
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note } = req.body as { status: OrderStatus; note?: string };

  const orderIndex = orders.findIndex(o => o.id === id || o.orderNumber === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIndex];
  const now = new Date().toISOString();
  order.status = status;
  order.updatedAt = now;

  // Update timeline
  const statusTitles: Record<OrderStatus, { title: string; desc: string }> = {
    pending: { title: 'Order Received', desc: 'Order is under review' },
    processing: { title: 'Processing in Warehouse', desc: 'Items picked and prepared for boxing' },
    shipped: { title: 'Dispatched with Carrier', desc: note || `Picked up by ${order.carrier}` },
    out_for_delivery: { title: 'Out for Delivery', desc: note || 'Driver is on route to delivery address' },
    delivered: { title: 'Delivered', desc: note || 'Package handed over or placed at doorstep' },
    cancelled: { title: 'Order Cancelled', desc: note || 'Order has been cancelled and refunded' }
  };

  const currentStatusInfo = statusTitles[status];
  const timelineItem = order.timeline.find(t => t.status === status);
  if (timelineItem) {
    timelineItem.completed = true;
    timelineItem.timestamp = now;
    if (note) timelineItem.description = note;
  } else {
    order.timeline.push({
      status,
      title: currentStatusInfo.title,
      description: currentStatusInfo.desc,
      timestamp: now,
      completed: true
    });
  }

  // Create push notification
  const notif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: `Order #${order.orderNumber} Update: ${currentStatusInfo.title}`,
    body: currentStatusInfo.desc,
    type: 'order_status',
    orderId: order.id,
    orderNumber: order.orderNumber,
    status,
    read: false,
    timestamp: now
  };
  notifications.unshift(notif);

  res.json({ order, notification: notif });
});

// GET /api/analytics (Real-time sales metrics)
app.get('/api/analytics', (req: Request, res: Response) => {
  const totalRevenue = orders.reduce((sum, o) => o.paymentStatus === 'paid' ? sum + o.total : sum, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const processingOrders = orders.filter(o => o.status === 'processing' || o.status === 'shipped').length;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  // Category breakdown
  const categorySales: Record<string, { sales: number; units: number }> = {};
  for (const ord of orders) {
    for (const item of ord.items) {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod?.category || 'Electronics';
      if (!categorySales[cat]) {
        categorySales[cat] = { sales: 0, units: 0 };
      }
      categorySales[cat].sales += item.price * item.quantity;
      categorySales[cat].units += item.quantity;
    }
  }

  const categoryBreakdown = Object.entries(categorySales).map(([category, data]) => ({
    category,
    sales: Number(data.sales.toFixed(2)),
    units: data.units,
    percentage: totalRevenue > 0 ? Math.round((data.sales / totalRevenue) * 100) : 0
  }));

  // Daily revenue trend (last 7 days)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const dailyMetrics = [
    { date: 'Mon', revenue: 1420, orders: 4, visitors: 145 },
    { date: 'Tue', revenue: 2180, orders: 7, visitors: 210 },
    { date: 'Wed', revenue: 1890, orders: 5, visitors: 195 },
    { date: 'Thu', revenue: 3240, orders: 9, visitors: 310 },
    { date: 'Fri', revenue: 4120, orders: 12, visitors: 390 },
    { date: 'Sat', revenue: 2890, orders: 8, visitors: 280 },
    { date: 'Today', revenue: Number(totalRevenue.toFixed(2)), orders: totalOrders, visitors: 420 }
  ];

  res.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    completedOrders,
    processingOrders,
    averageOrderValue: Number(averageOrderValue.toFixed(2)),
    lowStockCount,
    conversionRate: 3.42,
    activeVisitors: 38,
    categoryBreakdown,
    dailyMetrics,
    recentOrders: orders.slice(0, 5)
  });
});

// GET /api/notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({ notifications });
});

// POST /api/notifications (Test push trigger)
app.post('/api/notifications', (req: Request, res: Response) => {
  const { title, body, type, orderNumber } = req.body;
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: title || 'Store Notification',
    body: body || 'Order status changed',
    type: type || 'system',
    orderNumber,
    read: false,
    timestamp: new Date().toISOString()
  };
  notifications.unshift(newNotif);
  res.status(201).json(newNotif);
});

// PUT /api/notifications/:id/read
app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
  }
  res.json({ success: true });
});

// PUT /api/notifications/read-all
app.put('/api/notifications/read-all', (_req: Request, res: Response) => {
  notifications.forEach(n => { n.read = true; });
  res.json({ success: true });
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
