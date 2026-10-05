import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Package, 
  Printer, 
  Share2, 
  ArrowRight, 
  Truck, 
  Copy, 
  ExternalLink 
} from 'lucide-react';
import { Order } from '../types/ecommerce.ts';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder
}) => {
  if (!order) return null;

  const [copied, setCopied] = React.useState(false);

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden my-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-transparent p-6 border-b border-neutral-800 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Payment Authorized & Confirmed
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Thank You for Your Order!
              </h2>
              <p className="text-xs text-neutral-400">
                A confirmation receipt has been dispatched to <strong>{order.shippingAddress.email}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-6 text-xs print:p-0">
          {/* Key Reference Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase">Order ID</span>
              <div className="font-mono font-bold text-amber-400 text-sm">{order.orderNumber}</div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase">Total Paid</span>
              <div className="font-mono font-bold text-white text-sm">${order.total.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase">Courier Carrier</span>
              <div className="font-medium text-white truncate">{order.carrier}</div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase">Est. Delivery</span>
              <div className="font-medium text-emerald-400 truncate">{order.estimatedDelivery}</div>
            </div>
          </div>

          {/* Courier Tracking Box */}
          <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-neutral-200">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Tracking Number: <code className="font-mono text-amber-300 font-bold">{order.trackingNumber}</code></span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Real-time push status updates are enabled for this shipment.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyTracking}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onTrackOrder(order);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold transition flex items-center gap-1"
              >
                <span>Live Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h4 className="font-semibold text-neutral-300 uppercase tracking-wider text-[11px] mb-2">
              Purchased Items
            </h4>
            <div className="space-y-2 border border-neutral-800 rounded-2xl p-3 bg-neutral-950/60 max-h-40 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-neutral-300">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-neutral-800" />
                    <div>
                      <div className="font-semibold text-white">{item.productName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">Qty: {item.quantity} × ${item.price}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800 text-neutral-400">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-300">Ship To:</span>
              <div className="mt-1 text-neutral-200">
                <div>{order.shippingAddress.fullName}</div>
                <div>{order.shippingAddress.addressLine1}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-300">Payment Breakdown:</span>
              <div className="mt-1 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-neutral-800">
                  <span>Grand Total:</span>
                  <span className="text-amber-400">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Tax Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
