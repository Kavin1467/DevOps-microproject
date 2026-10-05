import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  RotateCw, 
  Send,
  Boxes,
  Truck,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductCategory } from '../types/ecommerce.ts';
import { api } from '../services/api.ts';
import { useNotification } from '../context/NotificationContext.tsx';

interface AdminDashboardProps {
  onViewProduct?: (p: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewProduct }) => {
  const { sendPush } = useNotification();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [statusUpdateOrder, setStatusUpdateOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('shipped');
  const [statusNote, setStatusNote] = useState('');

  // Form for New/Edit Product
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    tagline: '',
    description: '',
    price: 99,
    originalPrice: 119,
    category: 'Electronics' as ProductCategory,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    badge: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.getProducts(),
        api.getOrders()
      ]);
      setProducts(prodRes.products);
      setOrders(ordRes.orders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestock = async (productId: string, amount: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = prod.stock + amount;
    await api.updateProduct(productId, { stock: newStock });
    setProducts(products.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updated = await api.updateProduct(editingProduct.id, {
        sku: formData.sku,
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category,
        stock: Number(formData.stock),
        images: [formData.imageUrl],
        badge: formData.badge || undefined
      });
      setProducts(products.map(p => p.id === updated.id ? updated : p));
      setEditingProduct(null);
    } else {
      const created = await api.addProduct({
        sku: formData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category,
        stock: Number(formData.stock),
        images: [formData.imageUrl],
        badge: formData.badge || undefined
      });
      setProducts([created, ...products]);
      setIsAddModalOpen(false);
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      sku: p.sku,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      category: p.category,
      stock: p.stock,
      imageUrl: p.images[0] || '',
      badge: p.badge || ''
    });
  };

  const handleOrderStatusUpdate = async () => {
    if (!statusUpdateOrder) return;
    const res = await api.updateOrderStatus(statusUpdateOrder.id, newStatus, statusNote);
    setOrders(orders.map(o => o.id === statusUpdateOrder.id ? res.order : o));

    sendPush(
      `Order #${statusUpdateOrder.orderNumber} Status: ${newStatus.toUpperCase()} 🚚`,
      statusNote || `Updated status to ${newStatus.replace('_', ' ')}`,
      { type: 'order_status', orderNumber: statusUpdateOrder.orderNumber, status: newStatus }
    );

    setStatusUpdateOrder(null);
    setStatusNote('');
  };

  // Filtered inventories
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) || 
      o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress.email.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Inventory stats
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const inventoryValuation = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Metric Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4" />
            <span>Store Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Inventory & Order Fulfillment Center
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage catalog stock, replenish inventories, dispatch orders, and emit live push notifications.
          </p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'inventory' 
                ? 'bg-amber-400 text-neutral-950 shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Inventory ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-amber-400 text-neutral-950 shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase font-mono">Catalog Items</span>
          <div className="text-2xl font-black text-white font-mono mt-1">{products.length} SKUs</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">{totalStockUnits} total units in warehouse</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase font-mono">Low Stock Alerts</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1 flex items-center gap-1.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>{lowStockCount}</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-0.5">Needs reorder (&le; 5 units)</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase font-mono">Out of Stock</span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">{outOfStockCount}</div>
          <div className="text-[11px] text-rose-400/80 mt-0.5">Currently unavailable</div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase font-mono">Inventory Valuation</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ${inventoryValuation.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Retail market value</div>
        </div>
      </div>

      {/* INVENTORY TAB CONTENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search SKU or product title..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Categories</option>
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Workspace">Home & Workspace</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                title="Refresh Inventory"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
                    name: '',
                    tagline: '',
                    description: '',
                    price: 129,
                    originalPrice: 159,
                    category: 'Audio',
                    stock: 20,
                    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                    badge: 'New Item'
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase font-mono text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4">Quick Restock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 5;
                  const isOut = p.stock === 0;
                  return (
                    <tr key={p.id} className="hover:bg-neutral-900/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0" />
                          <div>
                            <div className="font-bold text-white line-clamp-1">{p.name}</div>
                            <div className="text-[10px] font-mono text-neutral-500">SKU: {p.sku}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-300 font-mono text-[11px]">
                        {p.category}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${p.price}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOut ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          isLow ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 animate-pulse' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {p.stock} units {isOut ? '(Out of Stock)' : isLow ? '(Low Stock)' : ''}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleRestock(p.id, 10)}
                            className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-mono transition"
                            title="Add 10 units"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleRestock(p.id, 50)}
                            className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-mono transition"
                            title="Add 50 units"
                          >
                            +50
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS TAB CONTENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Orders Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search Order #, customer name, email..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition self-end sm:self-auto"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 uppercase font-mono text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Buyer & Shipping</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Courier & Status</th>
                  <th className="py-3 px-4 text-right">Update Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-900/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-amber-400 text-sm">{ord.orderNumber}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                      {ord.isGuest && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-semibold">
                          GUEST
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{ord.shippingAddress.fullName}</div>
                      <div className="text-[11px] text-neutral-400">{ord.shippingAddress.email}</div>
                      <div className="text-[10px] text-neutral-500 truncate max-w-xs">
                        {ord.shippingAddress.city}, {ord.shippingAddress.country}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-neutral-300">
                        {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono truncate max-w-[140px]">
                        {ord.items.map(it => `${it.quantity}x ${it.productName}`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white">${ord.total.toFixed(2)}</div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        ord.status === 'shipped' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                        ord.status === 'out_for_delivery' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-neutral-800 text-neutral-300 border border-neutral-700'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        {ord.trackingNumber}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setStatusUpdateOrder(ord);
                          setNewStatus(ord.status);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-semibold text-xs transition"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-base text-white">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Brief 1-sentence highlight"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Workspace">Home & Workspace</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Bestseller, Staff Pick..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">High-Res Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE ORDER STATUS & DISPATCH PUSH MODAL */}
      {statusUpdateOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-base text-white">
                Update Order #{statusUpdateOrder.orderNumber}
              </h3>
              <button onClick={() => setStatusUpdateOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Transition Status To:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 uppercase font-mono font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing (In Warehouse)</option>
                  <option value="shipped">Shipped (Carrier Picked Up)</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Carrier Note / Status Update Details:</label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Scanned at regional distribution facility. Delivery truck departed."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] flex items-center gap-2">
                <Send className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  This update will trigger an instantaneous web push notification to <strong>{statusUpdateOrder.shippingAddress.email}</strong>.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setStatusUpdateOrder(null)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleOrderStatusUpdate}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Update & Dispatch Push</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
