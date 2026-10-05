import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Product } from '../types/ecommerce.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantCheckout?: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onInstantCheckout
}) => {
  if (!product) return null;

  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    if (res.success) {
      setAdded(true);
      setErrorMsg(null);
      setTimeout(() => setAdded(false), 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    if (onInstantCheckout) {
      onInstantCheckout(product, quantity);
    } else {
      setIsCartOpen(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Action Buttons: Wishlist & Close */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`p-2.5 rounded-full transition backdrop-blur-md shadow-md active:scale-95 ${
              isSaved
                ? 'bg-rose-500 text-white shadow-rose-500/30'
                : 'bg-neutral-800/80 text-neutral-300 hover:text-rose-400 hover:bg-neutral-700'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Favorites Wishlist'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-white stroke-white' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-amber-400 scale-95' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-950/60">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Express Courier</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-950/60">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-950/60">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>30-Day Trial</span>
              </div>
            </div>
          </div>

          {/* Right: Info, Specs, & Purchasing */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="font-mono text-neutral-500">
                  SKU: {product.sku}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {product.name}
              </h2>

              <p className="mt-1 text-sm text-neutral-400 font-medium">
                {product.tagline}
              </p>

              {/* Price & Rating */}
              <div className="mt-4 flex items-center justify-between py-3 border-y border-neutral-800">
                <div>
                  <span className="text-3xl font-black text-white font-mono">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-neutral-500 line-through font-mono">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-sm text-white">{product.rating}</span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    ({product.reviewCount} verified reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Overview
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features list */}
              {product.features && product.features.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Key Innovations
                  </h4>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Specs Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k} className="space-y-0.5">
                        <div className="text-[10px] text-neutral-500 uppercase">{k}</div>
                        <div className="font-mono text-neutral-200">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Inventory Status & Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Inventory Status:</span>
                {isOutOfStock ? (
                  <span className="font-bold text-rose-400">Sold Out Online</span>
                ) : (
                  <span className="font-semibold text-emerald-400">
                    In Stock ({product.stock} units ready to dispatch)
                  </span>
                )}
              </div>

              {errorMsg && (
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-300 font-medium">Quantity:</span>
                  <div className="flex items-center rounded-xl bg-neutral-950 border border-neutral-800 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-sm text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 ${
                    isOutOfStock
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
                  }`}
                >
                  <span>Instant Checkout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
