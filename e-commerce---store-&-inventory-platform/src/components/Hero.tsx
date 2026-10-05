import React from 'react';
import { Sparkles, Shield, Truck, RefreshCw, ArrowRight, Star } from 'lucide-react';
import { ProductCategory, Product } from '../types/ecommerce.ts';
import { useCart } from '../context/CartContext.tsx';

interface HeroProps {
  categories: ProductCategory[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  featuredProduct?: Product;
  onQuickView: (product: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  featuredProduct,
  onQuickView
}) => {
  const { addToCart } = useCart();

  return (
    <section className="relative overflow-hidden pt-6 pb-10 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/60 to-neutral-950">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-neutral-700/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Generation Hardware Store</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Acoustic Precision. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Workstation Mastery.
              </span>
            </h1>

            <p className="text-neutral-400 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Curated gear engineered for audiophiles, creators, and developers. Built with aerospace materials, ultra-low latency wireless architecture, and guest checkout with real-time push tracking.
            </p>

            {/* Value Proposition Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-neutral-200">Free Express</div>
                  <div className="text-[10px] text-neutral-400">Orders over $150</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-neutral-200">2-Yr Warranty</div>
                  <div className="text-[10px] text-neutral-400">Zero hassles</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-neutral-200">30-Day Returns</div>
                  <div className="text-[10px] text-neutral-400">100% Guaranteed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Featured Spotlight Card */}
          {featuredProduct && (
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-2xl transition hover:border-amber-400/40">
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-neutral-950 shadow-md">
                    {featuredProduct.badge || 'Featured Spotlight'}
                  </span>
                </div>

                <div 
                  className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer relative"
                  onClick={() => onQuickView(featuredProduct)}
                >
                  <img 
                    src={featuredProduct.images[0]} 
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition" />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono tracking-wider text-amber-400">
                      {featuredProduct.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold">{featuredProduct.rating}</span>
                      <span className="text-neutral-500">({featuredProduct.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition">
                    {featuredProduct.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {featuredProduct.tagline}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
                    <div>
                      <span className="text-2xl font-extrabold text-white font-mono">
                        ${featuredProduct.price}
                      </span>
                      {featuredProduct.originalPrice && (
                        <span className="ml-2 text-xs line-through text-neutral-500 font-mono">
                          ${featuredProduct.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQuickView(featuredProduct)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition"
                      >
                        Specs
                      </button>
                      <button
                        onClick={() => addToCart(featuredProduct, 1)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition shadow-lg shadow-amber-400/20"
                      >
                        <span>Add to Cart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Pills Navigation */}
        <div className="mt-10 pt-6 border-t border-neutral-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Browse by Category
            </span>
            <span className="text-xs text-neutral-500">
              Showing active inventory
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-neutral-950 font-bold border-amber-400 shadow-md shadow-amber-400/20'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
