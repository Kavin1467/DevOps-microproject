import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Check, 
  Loader2, 
  ArrowLeft, 
  Sparkles,
  Smartphone,
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { ShippingAddress, Order } from '../types/ecommerce.ts';
import { api } from '../services/api.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { items, subtotal, discount, discountCode, shippingFee, tax, total, clearCart } = useCart();
  const { sendPush } = useNotification();

  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment' | 'processing'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'cod'>('card');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Address Form State (Direct checkout without login)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Jordan Sterling',
    email: 'jordan.sterling@example.com',
    phone: '+1 (555) 789-0123',
    addressLine1: '450 Mission Street, Suite 1200',
    addressLine2: 'Tech District',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States'
  });

  // Card Payment State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Jordan Sterling');

  if (!isOpen) return null;

  const handleFillDemoAddress = () => {
    setShippingAddress({
      fullName: 'Jordan Sterling',
      email: 'jordan.sterling@example.com',
      phone: '+1 (555) 789-0123',
      addressLine1: '450 Mission Street, Suite 1200',
      addressLine2: 'Tech District',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States'
    });
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('08/29');
    setCardCvc('382');
    setCardHolder(shippingAddress.fullName || 'Jordan Sterling');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode) {
      setErrorMsg('Please complete all required shipping fields');
      return;
    }
    setErrorMsg(null);
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = async () => {
    setErrorMsg(null);
    setCheckoutStep('processing');

    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
        sku: item.product.sku
      }));

      const payload = {
        items: orderItems,
        shippingAddress,
        paymentMethod,
        discountCode: discountCode || undefined,
        isGuest: true,
        guestEmail: shippingAddress.email
      };

      // Call API /checkout
      const response = await api.checkout(payload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Send Instant Push Notification
      sendPush(
        'Order Confirmed! 📦',
        `Order #${response.order.orderNumber} for $${response.order.total} placed successfully. We are preparing your shipment!`,
        { type: 'order_status', orderNumber: response.order.orderNumber, status: 'processing' }
      );

      clearCart();
      onClose();
      onOrderSuccess(response.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed. Please check your credentials.');
      setCheckoutStep('payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              {checkoutStep === 'shipping' ? 'Shipping & Delivery' : 'Secure Payment Checkout'}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300">
              Direct Checkout
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Progress Stepper */}
        <div className="px-6 py-2.5 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              checkoutStep === 'shipping' ? 'bg-amber-400 text-neutral-950' : 'bg-emerald-500 text-neutral-950'
            }`}>
              {checkoutStep === 'shipping' ? '1' : <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className={checkoutStep === 'shipping' ? 'text-white font-bold' : 'text-neutral-400'}>
              Shipping Address
            </span>
          </div>

          <div className="w-8 h-px bg-neutral-800" />

          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              checkoutStep === 'payment' ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
            }`}>
              2
            </div>
            <span className={checkoutStep === 'payment' ? 'text-white font-bold' : 'text-neutral-400'}>
              Payment & Review
            </span>
          </div>

          <div className="w-8 h-px bg-neutral-800" />

          <div className="flex items-center gap-2 text-neutral-500">
            <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px]">
              3
            </div>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="m-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Shipping Address Form */}
        {checkoutStep === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Where should we dispatch your items?
              </span>
              <button
                type="button"
                onClick={handleFillDemoAddress}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto-fill Sample Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Email Address (for order tracking) *</label>
                <input
                  type="email"
                  required
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-300 font-medium mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.addressLine1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                  placeholder="123 Innovation Blvd, Apt 4B"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  placeholder="San Francisco"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">State / Prov *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="CA"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    placeholder="94107"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Country</label>
                <select
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                All packages include signature tracking & eco packaging
              </span>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 transition shadow-lg shadow-amber-400/20"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Method & Review */}
        {checkoutStep === 'payment' && (
          <div className="p-6 space-y-5">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Choose Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === 'card'
                      ? 'bg-amber-400/10 border-amber-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-400 mb-1" />
                  <div>
                    <div className="text-xs font-bold text-white">Credit Card</div>
                    <div className="text-[10px] text-neutral-500">Visa, MC, Amex</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-amber-400/10 border-amber-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-amber-400 mb-1" />
                  <div>
                    <div className="text-xs font-bold text-white">Apple Pay</div>
                    <div className="text-[10px] text-neutral-500">Instant Touch ID</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-400/10 border-amber-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-400 mb-1" />
                  <div>
                    <div className="text-xs font-bold text-white">Cash / Delivery</div>
                    <div className="text-[10px] text-neutral-500">Pay upon receipt</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Credit Card Details (if selected) */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-200">Cardholder Credentials</span>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-fill Test Card
                  </button>
                </div>

                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[10px] font-bold">
                      VISA
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">CVC / Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Apple Pay Preview */}
            {paymentMethod === 'apple_pay' && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-2">
                <div className="text-xs text-neutral-300 font-medium">
                  Apple Pay biometric authentication ready
                </div>
                <div className="text-[11px] text-neutral-500">
                  Click below to authorize ${total.toFixed(2)} with Face ID / Touch ID simulation.
                </div>
              </div>
            )}

            {/* Cash on Delivery Preview */}
            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-1">
                <div className="text-white font-semibold">Pay upon Courier Delivery</div>
                <p>Have exact cash of ${total.toFixed(2)} or local card terminal ready at delivery time.</p>
              </div>
            )}

            {/* Order Items & Total Summary */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <div className="font-semibold text-neutral-300 pb-1 border-b border-neutral-800">
                Order Summary ({items.length} unique items)
              </div>

              <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                {items.map(it => (
                  <div key={it.product.id} className="flex justify-between text-neutral-400">
                    <span className="line-clamp-1">{it.quantity}x {it.product.name}</span>
                    <span className="font-mono text-white">${(it.product.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-800 space-y-1 text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discountCode})</span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-white">{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.25%)</span>
                  <span className="font-mono text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total Due</span>
                  <span className="font-mono text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCheckoutStep('shipping')}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
              </button>

              <button
                type="button"
                onClick={handlePaymentSubmit}
                className="py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 transition shadow-lg shadow-amber-400/20 flex items-center gap-2 active:scale-[0.99]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Pay ${total.toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Processing 3D Secure / Authorization State */}
        {checkoutStep === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-white">
              Authorizing Secure Transaction...
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Performing 256-bit encrypted card verification, tokenizing payment gateway credentials, and generating courier manifest...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
