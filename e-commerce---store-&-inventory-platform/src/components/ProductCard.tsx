import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, AlertCircle, Heart } from 'lucide-react';
import { Product } from '../types/ecommerce.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSaved = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = addToCart(product, 1);
    if (res.success) {
      setIsAdded(true);
      setErrorMsg(null);
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col rounded-2xl bg-neutral-900/70 border border-neutral-800/90 overflow-hidden hover:border-amber-400/40 hover:shadow-xl hover:shadow-black/40 transition duration-300 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-400 text-neutral-950 shadow-md uppercase tracking-wider">
              {product.badge}
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500 text-white shadow-md">
              Save ${(product.originalPrice - product.price).toFixed(0)}
            </span>
          )}
        </div>

        {/* Top Right Actions: Stock Badge & Heart Toggle Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          {isOutOfStock ? (
            <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-neutral-900/90 text-rose-400 border border-rose-500/30 backdrop-blur-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm animate-pulse">
              Only {product.stock} left
            </span>
          ) : null}

          {/* Heart Wishlist Toggle Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`p-2 rounded-xl transition backdrop-blur-md shadow-md active:scale-90 ${
              isSaved
                ? 'bg-rose-500 text-white shadow-rose-500/30 ring-2 ring-rose-400/50'
                : 'bg-neutral-950/70 hover:bg-neutral-900 text-neutral-300 hover:text-rose-400 border border-neutral-800/80'
            }`}
            title={isSaved ? 'Remove from Saved Wishlist' : 'Save to Favorites Wishlist'}
          >
            <Heart className={`w-4 h-4 transition ${isSaved ? 'fill-white stroke-white scale-110' : 'stroke-current'}`} />
          </button>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 shadow-lg transition transform translate-y-2 group-hover:translate-y-0"
            title="Quick Specs & Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4 justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span className="uppercase tracking-wider font-mono text-[10px] text-amber-400/90 font-medium">
              {product.category}
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              {product.sku}
            </span>
          </div>

          <h3 className="font-bold text-sm text-neutral-100 group-hover:text-amber-300 transition line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Rating and Price row */}
        <div className="pt-2 border-t border-neutral-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-neutral-200">{product.rating.toFixed(1)}</span>
              <span className="text-[11px] text-neutral-500">({product.reviewCount})</span>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold text-white font-mono">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="ml-1.5 text-xs text-neutral-500 line-through font-mono">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Error notice if stock limit hit */}
          {errorMsg && (
            <div className="mb-2 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Add to Cart button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
              isOutOfStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
                : isAdded
                ? 'bg-emerald-500 text-neutral-950 font-bold'
                : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-400/10 hover:shadow-amber-400/20 active:scale-[0.98]'
            }`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
