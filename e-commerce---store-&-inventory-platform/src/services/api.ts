import { Product, Order, OrderStatus, NotificationItem, ProductCategory } from '../types/ecommerce.ts';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/mockProducts.ts';

const PRODUCTS_LOCAL_KEY = 'auracommerce_products_cache';
const ORDERS_LOCAL_KEY = 'auracommerce_orders_cache';
const NOTIFICATIONS_LOCAL_KEY = 'auracommerce_notifs_cache';

// Helper to get from local storage
function getCached<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Storage read error', e);
  }
  return fallback;
}

function setCached<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export const api = {
  async getProducts(params?: { category?: ProductCategory; search?: string; sort?: string }): Promise<{ products: Product[]; total: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'All') searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sort) searchParams.set('sort', params.sort);

      const res = await fetch(`/api/products?${searchParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCached(PRODUCTS_LOCAL_KEY, data.products);
        return data;
      }
    } catch {
      // fallback to cached or initial
    }

    let products = getCached<Product[]>(PRODUCTS_LOCAL_KEY, INITIAL_PRODUCTS);
    if (params?.category && params.category !== 'All') {
      products = products.filter(p => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return { products, total: products.length };
  },

  async addProduct(product: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const created: Product = {
      id: `prod-${Date.now()}`,
      sku: product.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: product.name || 'New Product',
      tagline: product.tagline || '',
      description: product.description || '',
      price: product.price || 99,
      originalPrice: product.originalPrice,
      category: product.category || 'Electronics',
      rating: 5.0,
      reviewCount: 0,
      stock: product.stock ?? 10,
      images: product.images?.length ? product.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      features: product.features || [],
      specs: product.specs || {},
      createdAt: new Date().toISOString()
    };
    const cached = getCached<Product[]>(PRODUCTS_LOCAL_KEY, INITIAL_PRODUCTS);
    setCached(PRODUCTS_LOCAL_KEY, [created, ...cached]);
    return created;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const cached = getCached<Product[]>(PRODUCTS_LOCAL_KEY, INITIAL_PRODUCTS);
    const index = cached.findIndex(p => p.id === id);
    if (index !== -1) {
      cached[index] = { ...cached[index], ...updates };
      setCached(PRODUCTS_LOCAL_KEY, cached);
      return cached[index];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
    const cached = getCached<Product[]>(PRODUCTS_LOCAL_KEY, INITIAL_PRODUCTS);
    setCached(PRODUCTS_LOCAL_KEY, cached.filter(p => p.id !== id));
  },

  async getOrders(userId?: string): Promise<{ orders: Order[] }> {
    try {
      const url = userId ? `/api/orders?userId=${encodeURIComponent(userId)}` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCached(ORDERS_LOCAL_KEY, data.orders);
        return data;
      }
    } catch {
      // fallback
    }

    let orders = getCached<Order[]>(ORDERS_LOCAL_KEY, INITIAL_ORDERS);
    if (userId) {
      orders = orders.filter(o => o.userId === userId);
    }
    return { orders };
  },

  async checkout(payload: any): Promise<{ order: Order; transactionId: string }> {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed');
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') {
        throw e;
      }
    }

    // Local checkout calculation fallback
    const now = new Date().toISOString();
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = payload.items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
    const discount = payload.discountCode === 'SAVE20' ? subtotal * 0.2 : (payload.discountCode === 'AURA10' ? 10 : 0);
    const shippingFee = (subtotal - discount) >= 150 ? 0 : 15;
    const tax = Number(((subtotal - discount) * 0.0825).toFixed(2));
    const total = Number((subtotal - discount + shippingFee + tax).toFixed(2));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: payload.isGuest ? undefined : payload.userId,
      isGuest: Boolean(payload.isGuest),
      guestEmail: payload.guestEmail || payload.shippingAddress.email,
      items: payload.items,
      subtotal,
      discount,
      discountCode: payload.discountCode,
      shippingFee,
      tax,
      total,
      paymentMethod: payload.paymentMethod || 'card',
      paymentStatus: 'paid',
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      shippingAddress: payload.shippingAddress,
      status: 'processing',
      carrier: 'FedEx Express Priority',
      trackingNumber: `FDX-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      estimatedDelivery: 'In 2-3 Business Days',
      timeline: [
        {
          status: 'pending',
          title: 'Order Confirmed',
          description: 'Payment authorized',
          timestamp: now,
          completed: true
        },
        {
          status: 'processing',
          title: 'Fulfillment & Quality Audit',
          description: 'Items allocated and dispatched',
          timestamp: now,
          completed: true
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    const currentOrders = getCached<Order[]>(ORDERS_LOCAL_KEY, INITIAL_ORDERS);
    setCached(ORDERS_LOCAL_KEY, [newOrder, ...currentOrders]);

    return { order: newOrder, transactionId: newOrder.transactionId };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<{ order: Order; notification: NotificationItem }> {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const cachedOrders = getCached<Order[]>(ORDERS_LOCAL_KEY, INITIAL_ORDERS);
    const ordIndex = cachedOrders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (ordIndex === -1) throw new Error('Order not found');

    const ord = cachedOrders[ordIndex];
    ord.status = status;
    ord.updatedAt = new Date().toISOString();
    setCached(ORDERS_LOCAL_KEY, cachedOrders);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order #${ord.orderNumber} Status: ${status.toUpperCase()}`,
      body: note || `Order updated to ${status}`,
      type: 'order_status',
      orderId: ord.id,
      orderNumber: ord.orderNumber,
      status,
      read: false,
      timestamp: new Date().toISOString()
    };
    return { order: ord, notification: notif };
  },

  async getAnalytics(): Promise<any> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const orders = getCached<Order[]>(ORDERS_LOCAL_KEY, INITIAL_ORDERS);
    const products = getCached<Product[]>(PRODUCTS_LOCAL_KEY, INITIAL_PRODUCTS);
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      processingOrders: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length,
      averageOrderValue: orders.length ? Number((totalRevenue / orders.length).toFixed(2)) : 0,
      lowStockCount: products.filter(p => p.stock <= 5).length,
      conversionRate: 3.42,
      activeVisitors: 42,
      categoryBreakdown: [
        { category: 'Audio', sales: 1250, units: 6, percentage: 38 },
        { category: 'Wearables', sales: 998, units: 2, percentage: 30 },
        { category: 'Home & Workspace', sales: 640, units: 4, percentage: 20 },
        { category: 'Accessories', sales: 380, units: 5, percentage: 12 }
      ],
      dailyMetrics: [
        { date: 'Mon', revenue: 1420, orders: 4, visitors: 145 },
        { date: 'Tue', revenue: 2180, orders: 7, visitors: 210 },
        { date: 'Wed', revenue: 1890, orders: 5, visitors: 195 },
        { date: 'Thu', revenue: 3240, orders: 9, visitors: 310 },
        { date: 'Fri', revenue: 4120, orders: 12, visitors: 390 },
        { date: 'Sat', revenue: 2890, orders: 8, visitors: 280 },
        { date: 'Today', revenue: Number(totalRevenue.toFixed(2)), orders: orders.length, visitors: 420 }
      ],
      recentOrders: orders.slice(0, 5)
    };
  },

  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const notifs = getCached<NotificationItem[]>(NOTIFICATIONS_LOCAL_KEY, [
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
      }
    ]);
    return { notifications: notifs };
  },

  async sendNotification(notif: Partial<NotificationItem>): Promise<NotificationItem> {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const created: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: notif.title || 'Store Notification',
      body: notif.body || 'Alert',
      type: notif.type || 'system',
      read: false,
      timestamp: new Date().toISOString()
    };
    const cached = getCached<NotificationItem[]>(NOTIFICATIONS_LOCAL_KEY, []);
    setCached(NOTIFICATIONS_LOCAL_KEY, [created, ...cached]);
    return created;
  }
};
