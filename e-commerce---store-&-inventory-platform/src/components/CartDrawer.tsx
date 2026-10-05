import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    discountCode,
    shippingFee,
    tax,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    setPromoMsg({ text: res.message, error: !res.success });
    if (res.success) setPromoInput('');
  };

  const freeShippingProgress = Math.min(100, Math.round(((subtotal - discount) / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-white text-base">
                Your Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3.5 bg-neutral-950/70 border-b border-neutral-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                <Truck className="w-4 h-4 text-amber-400" />
                {freeShippingRemaining === 0 || discountCode === 'FREESHIP' ? (
                  <span className="text-emerald-400 font-bold">Free Express Shipping Unlocked!</span>
                ) : (
                  <span>Add <strong className="text-amber-400 font-mono">${freeShippingRemaining.toFixed(2)}</strong> for Free Express Shipping</span>
                )}
              </span>
              <span className="font-mono text-neutral-400 text-[11px]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${discountCode === 'FREESHIP' ? 100 : freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-800/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-white text-base">Your bag is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Discover our curated selection of high-fidelity acoustic gear, titanium smartwatches, and minimalist workstation accessories.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 transition"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-3.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-xs text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-500 hover:text-rose-400 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        {item.product.sku}
                      </div>

                      <div className="text-xs font-bold text-amber-400 font-mono mt-1">
                        ${item.product.price}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-800/40">
                      <div className="flex items-center rounded-lg bg-neutral-950 border border-neutral-800 px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/80 space-y-3.5">
              {/* Promo Code Input */}
              <div>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Coupon code (SAVE20, AURA10)"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white uppercase placeholder:normal-case placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>

                {discountCode && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Coupon <strong>{discountCode}</strong> applied</span>
                    </span>
                    <button onClick={removeCoupon} className="text-neutral-400 hover:text-white underline">
                      Remove
                    </button>
                  </div>
                )}

                {promoMsg && !discountCode && (
                  <div className={`mt-1.5 text-[11px] flex items-center gap-1 ${promoMsg.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                    <AlertCircle className="w-3 h-3" />
                    <span>{promoMsg.text}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400 border-t border-neutral-800 pt-2">
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
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 uppercase text-[10px] font-bold">Free</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Sales Tax (8.25%)</span>
                  <span className="font-mono text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Order Total</span>
                  <span className="font-mono text-base text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-center text-neutral-500">
                🔒 256-Bit Encrypted Secure Checkout • Guest Checkout Supported
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
