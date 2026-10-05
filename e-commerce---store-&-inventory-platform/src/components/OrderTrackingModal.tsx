import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  BellRing
} from 'lucide-react';
import { Order, OrderStatus } from '../types/ecommerce.ts';
import { useNotification } from '../context/NotificationContext.tsx';
import { api } from '../services/api.ts';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrder?: Order | null;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrder
}) => {
  const { sendPush } = useNotification();
  const [searchInput, setSearchInput] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(initialOrder || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setErrorMsg(null);
    try {
      const res = await api.getOrders();
      const match = res.orders.find(
        o => o.orderNumber.toLowerCase() === searchInput.trim().toLowerCase() ||
             o.id.toLowerCase() === searchInput.trim().toLowerCase() ||
             o.shippingAddress.email.toLowerCase() === searchInput.trim().toLowerCase()
      );
      if (match) {
        setActiveOrder(match);
      } else {
        setErrorMsg(`No order found matching "${searchInput}". Try sample order ORD-9481 or ORD-9482.`);
      }
    } catch {
      setErrorMsg('Failed to locate order.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleTriggerStatusTest = (newStatus: OrderStatus) => {
    if (!activeOrder) return;
    const notes: Record<OrderStatus, string> = {
      pending: 'Order received and being reviewed',
      processing: 'Packaging in clean room workstation 4',
      shipped: 'Departed San Francisco International Sorting Center',
      out_for_delivery: 'Courier driver Alex is 4 stops away from your location',
      delivered: 'Delivered at front porch. Signature received.',
      cancelled: 'Order cancelled and refund processed'
    };

    api.updateOrderStatus(activeOrder.id, newStatus, notes[newStatus]).then(res => {
      setActiveOrder(res.order);
      sendPush(
        `Order Update: ${activeOrder.orderNumber} 🚀`,
        notes[newStatus],
        { type: 'order_status', orderNumber: activeOrder.orderNumber, status: newStatus }
      );
    });
  };

  const currentOrder = activeOrder || initialOrder;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Live Order & Package Tracking
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar for Any Order */}
        <div className="p-5 bg-neutral-950/70 border-b border-neutral-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order # (e.g. ORD-9481) or Buyer Email"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-xl transition"
            >
              {isSearching ? 'Locating...' : 'Track'}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-2 text-xs text-rose-400">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Tracking Details View */}
        {currentOrder ? (
          <div className="p-6 space-y-6 text-xs">
            {/* Top Order Summary Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-mono">Tracking Code</span>
                <div className="font-mono text-base font-bold text-amber-400">
                  {currentOrder.trackingNumber}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Carrier: <strong>{currentOrder.carrier}</strong> • Order: {currentOrder.orderNumber}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase">Estimated Arrival</span>
                <div className="font-semibold text-emerald-400 text-sm">
                  {currentOrder.estimatedDelivery}
                </div>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  currentOrder.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  currentOrder.status === 'shipped' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {currentOrder.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Visual Shipment Timeline */}
            <div>
              <h4 className="font-semibold text-neutral-300 uppercase tracking-wider text-[11px] mb-3">
                Tracking History & Milestones
              </h4>

              <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                {currentOrder.timeline.map((step, idx) => {
                  const isCurrent = step.status === currentOrder.status;
                  return (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        step.completed 
                          ? 'bg-amber-400 text-neutral-950' 
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                      }`}>
                        {step.completed ? <CheckCircle2 className="w-3.5 h-3.5 fill-neutral-950 text-amber-400" /> : <Clock className="w-3 h-3" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isCurrent ? 'text-amber-400' : 'text-neutral-200'}`}>
                            {step.title}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {step.timestamp.includes('T') ? new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : step.timestamp}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-[11px] mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination Address */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold">Delivery Address</span>
                <div className="text-neutral-200 font-medium mt-0.5">
                  {currentOrder.shippingAddress.fullName} — {currentOrder.shippingAddress.addressLine1}, {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}
                </div>
              </div>
            </div>

            {/* Test Simulation Controls: Trigger Push Notification */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-amber-400/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5 text-[11px]">
                  <BellRing className="w-3.5 h-3.5" />
                  Simulate Real-Time Status Change & Push Update:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleTriggerStatusTest('processing')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] transition"
                >
                  Set: Processing
                </button>
                <button
                  onClick={() => handleTriggerStatusTest('shipped')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[10px] transition"
                >
                  Set: Shipped (FedEx)
                </button>
                <button
                  onClick={() => handleTriggerStatusTest('out_for_delivery')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-blue-300 text-[10px] transition"
                >
                  Set: Out for Delivery
                </button>
                <button
                  onClick={() => handleTriggerStatusTest('delivered')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-300 text-[10px] transition"
                >
                  Set: Delivered 🎉
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-400 text-xs">
            <Package className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p>Enter an order number above or checkout to track real-time delivery progress.</p>
          </div>
        )}
      </div>
    </div>
  );
};
