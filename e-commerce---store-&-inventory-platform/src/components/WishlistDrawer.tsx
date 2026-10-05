import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { Product } from '../types/ecommerce.ts';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  onQuickView
}) => {
  const { wishlist, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  if (!isOpen) return null;

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach(p => {
      if (p.stock > 0) {
        addToCart(p, 1);
      }
    });
    clearWishlist();
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="font-bold text-white text-base">
                Saved Collection ({wishlistCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Sub-header */}
          {wishlistCount > 0 && (
            <div className="px-5 py-2.5 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Stored in browser localStorage</span>
              <button
                onClick={clearWishlist}
                className="text-neutral-400 hover:text-rose-400 transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-800/60">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <Heart className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="font-bold text-white text-base">Your saved collection is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Tap the heart icon on any product card to bookmark your favorite gear for later.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 transition"
                >
                  Explore Hardware
                </button>
              </div>
            ) : (
              wishlist.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <div key={product.id} className="pt-4 first:pt-0 flex gap-3.5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="w-20 h-20 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0 cursor-pointer hover:opacity-90"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 
                            onClick={() => {
                              onQuickView(product);
                              onClose();
                            }}
                            className="font-semibold text-xs text-white line-clamp-1 cursor-pointer hover:text-amber-400"
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="text-neutral-500 hover:text-rose-400 transition p-0.5"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[10px] font-mono text-amber-400/90 mt-0.5">
                          {product.category}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-white font-mono">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-neutral-500 line-through font-mono">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Move to Cart button */}
                      <div className="mt-2 pt-2 border-t border-neutral-800/40 flex items-center justify-between">
                        <span className={`text-[10px] font-semibold ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                        </span>

                        <button
                          disabled={isOutOfStock}
                          onClick={() => handleMoveToCart(product)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            isOutOfStock
                              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                              : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-sm'
                          }`}
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer actions */}
          {wishlist.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/80 space-y-2">
              <button
                onClick={handleMoveAllToCart}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-[0.99]"
              >
                <span>Move All In-Stock to Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
