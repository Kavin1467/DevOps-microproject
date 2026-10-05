import React, { useState, useEffect, useMemo } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { NotificationProvider, useNotification } from './context/NotificationContext.tsx';
import { WishlistProvider, useWishlist } from './context/WishlistContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderConfirmationModal } from './components/OrderConfirmationModal.tsx';
import { OrderTrackingModal } from './components/OrderTrackingModal.tsx';
import { WishlistDrawer } from './components/WishlistDrawer.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AnalyticsDashboard } from './components/AnalyticsDashboard.tsx';
import { UserOrdersModal } from './components/UserOrdersModal.tsx';
import { NotificationCenter } from './components/NotificationCenter.tsx';
import { InAppToast } from './components/InAppToast.tsx';
import { Footer } from './components/Footer.tsx';
import { SEOHead } from './components/SEOHead.tsx';
import { Product, ProductCategory, Order } from './types/ecommerce.ts';
import { api } from './services/api.ts';
import { Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Audio',
  'Wearables',
  'Electronics',
  'Home & Workspace',
  'Accessories'
];

function StoreContent() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [currentView, setCurrentView] = useState<'shop' | 'admin' | 'analytics' | 'orders'>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Load products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy
      });
      setProducts(res.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  // Featured spotlight product
  const featuredProduct = useMemo(() => {
    return products.find(p => p.isFeatured) || products[0];
  }, [products]);

  const handleOrderConfirmed = (order: Order) => {
    setConfirmedOrder(order);
  };

  const handleOpenTracker = (order?: Order) => {
    if (order) setTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleNotificationSelectOrder = (orderNum: string) => {
    api.getOrders().then(res => {
      const match = res.orders.find(o => o.orderNumber === orderNum || o.id === orderNum);
      if (match) {
        setTrackingOrder(match);
        setIsTrackingModalOpen(true);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 font-sans">
      <SEOHead product={quickViewProduct || undefined} />

      {/* Main Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTrackModal={() => handleOpenTracker()}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'shop' && (
          <>
            {/* Hero Section */}
            <Hero
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              featuredProduct={featuredProduct}
              onQuickView={setQuickViewProduct}
            />

            {/* Catalog Grid Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
              {/* Controls bar: Results Count & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Hardware Catalog</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
                      {products.length} Items Available
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedCategory === 'All' ? 'Showing all collections' : `Filtered by ${selectedCategory}`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-neutral-400">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 font-medium"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="py-20 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Loading catalog...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="py-20 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div className="text-sm font-bold text-white">No products found</div>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    No hardware items matched your current filter query.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {currentView === 'admin' && (
          <AdminDashboard onViewProduct={setQuickViewProduct} />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {currentView === 'orders' && (
          <UserOrdersModal
            onTrackOrder={(ord) => {
              setTrackingOrder(ord);
              setIsTrackingModalOpen(true);
            }}
            onViewReceipt={(ord) => {
              setConfirmedOrder(ord);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderConfirmed}
      />

      {/* Product Quick View Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onInstantCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={(ord) => {
          setConfirmedOrder(null);
          setTrackingOrder(ord);
          setIsTrackingModalOpen(true);
        }}
      />

      {/* Package Tracking Timeline Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        initialOrder={trackingOrder}
      />

      {/* Wishlist / Saved Collection Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onQuickView={setQuickViewProduct}
      />

      {/* Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectOrder={handleNotificationSelectOrder}
      />

      {/* Active In-App Push Toast Alert */}
      <InAppToast onSelectOrder={handleNotificationSelectOrder} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NotificationProvider>
        <WishlistProvider>
          <StoreContent />
        </WishlistProvider>
      </NotificationProvider>
    </CartProvider>
  );
}
