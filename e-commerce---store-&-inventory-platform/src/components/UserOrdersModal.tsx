import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Receipt, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { Order } from '../types/ecommerce.ts';
import { useCart } from '../context/CartContext.tsx';
import { api } from '../services/api.ts';

interface UserOrdersModalProps {
  onTrackOrder: (order: Order) => void;
  onViewReceipt: (order: Order) => void;
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  onTrackOrder,
  onViewReceipt
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.getOrders();
        setOrders(res.orders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReorder = (order: Order) => {
    // Add items to cart
    for (const item of order.items) {
      // Create minimal product for cart
      addToCart({
        id: item.productId,
        sku: item.sku,
        name: item.productName,
        tagline: '',
        description: '',
        price: item.price,
        category: 'Electronics',
        rating: 5,
        reviewCount: 1,
        stock: 50,
        images: [item.image],
        features: [],
        specs: {},
        createdAt: ''
      }, item.quantity);
    }
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Order History & Shipments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Orders & Shipments
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            View order receipts, live courier tracking timelines, and one-click reordering.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-500">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
          <Package className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="font-bold text-white text-base">No orders found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You haven't placed any orders yet. Explore our curated store to purchase flagship acoustic & workstation gear.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div 
              key={ord.id}
              className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 hover:border-neutral-700 transition"
            >
              {/* Order Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {ord.orderNumber}
                  </span>
                  <span className="text-neutral-500">
                    Placed on {new Date(ord.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    ord.status === 'shipped' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {ord.status.replace('_', ' ')}
                  </span>
                  <span className="font-mono font-bold text-white text-sm">
                    ${ord.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items List Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt="" 
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0" 
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-white line-clamp-1">{item.productName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          Qty: {item.quantity} • ${item.price} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery and Courier Details */}
                <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-xs flex flex-col justify-between space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase font-mono">Courier Tracking</div>
                      <div className="font-mono text-amber-300 font-bold mt-0.5">{ord.trackingNumber}</div>
                      <div className="text-[11px] text-neutral-400">{ord.carrier}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-neutral-500 uppercase">Estimated Delivery</div>
                      <div className="text-emerald-400 font-semibold">{ord.estimatedDelivery}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/80">
                    <button
                      onClick={() => onViewReceipt(ord)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5 text-amber-400" />
                      <span>Receipt</span>
                    </button>
                    <button
                      onClick={() => onTrackOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-400/10"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Live Tracker</span>
                    </button>
                    <button
                      onClick={() => handleReorder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition flex items-center gap-1"
                      title="Buy again"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
