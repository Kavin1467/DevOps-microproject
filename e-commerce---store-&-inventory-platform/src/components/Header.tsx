import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Bell, 
  LayoutDashboard, 
  LineChart, 
  Package, 
  UserCheck, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles,
  Volume2,
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface HeaderProps {
  currentView: 'shop' | 'admin' | 'analytics' | 'orders';
  onNavigate: (view: 'shop' | 'admin' | 'analytics' | 'orders') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNotifications: () => void;
  onOpenTrackModal: () => void;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  onOpenTrackModal,
  onOpenWishlist
}) => {
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { unreadCount, permission, requestPermission, sendPush } = useNotification();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-400 text-neutral-950">
              LIMITED OFFER
            </span>
            <span className="hidden sm:inline">Use code <strong className="text-white font-mono">SAVE20</strong> for 20% off • Free worldwide express shipping on orders over $150</span>
            <span className="sm:hidden">Code <strong className="text-white font-mono">SAVE20</strong> for 20% off</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {permission !== 'granted' && (
              <button 
                onClick={requestPermission}
                className="hover:text-white transition flex items-center gap-1 text-amber-300 font-medium underline underline-offset-2"
              >
                <Bell className="w-3 h-3" /> Enable Push Alerts
              </button>
            )}
            <button 
              onClick={() => sendPush('Store Flash Alert 🔥', 'Flash sale: ANC Headphones now 15% off for next 2 hours!')}
              className="hidden md:flex items-center gap-1 hover:text-white transition opacity-80"
              title="Test Web Push Notification"
            >
              <Sparkles className="w-3 h-3 text-amber-400" /> Test Push
            </button>
            <button
              onClick={onOpenTrackModal}
              className="hover:text-white transition flex items-center gap-1 text-neutral-300"
            >
              <Package className="w-3 h-3 text-amber-400" /> Track Order
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('shop')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-black text-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
                E
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                  E-<span className="text-amber-400">COMMERCE</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 -mt-1 font-mono">
                  Fullstack Engine
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-neutral-800">
              <button
                onClick={() => onNavigate('shop')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentView === 'shop' 
                    ? 'bg-neutral-800 text-white shadow-inner' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                Storefront
              </button>
              <button
                onClick={onOpenWishlist}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Collection</span>
                {wishlistCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onNavigate('orders')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'orders' 
                    ? 'bg-neutral-800 text-white shadow-inner' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Package className="w-4 h-4 text-amber-400" />
                <span>My Orders</span>
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'admin' 
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Inventory & Orders</span>
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'analytics' 
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <LineChart className="w-4 h-4" />
                <span>Real-Time Analytics</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search studio headphones, titanium watches, keyboards..."
                className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist / Saved Collection Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800/80 transition flex items-center gap-1.5"
              title="Saved Items / Wishlist"
            >
              <Heart className={`w-5 h-5 transition ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-neutral-300'}`} />
              <span className="hidden sm:inline text-xs font-semibold text-neutral-300">Saved</span>
              {wishlistCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800/80 transition"
              title="Push Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-extrabold text-[10px] flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-sm transition shadow-lg shadow-amber-400/20 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline font-mono">${subtotal.toFixed(2)}</span>
              {itemCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-neutral-950 text-amber-400 text-xs font-extrabold font-mono">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search gear..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 py-3 space-y-1">
            <button
              onClick={() => { onNavigate('shop'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === 'shop' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
              }`}
            >
              Storefront
            </button>
            <button
              onClick={() => { onOpenWishlist(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between text-neutral-400 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Collection / Wishlist</span>
              </span>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                currentView === 'orders' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
              }`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>My Orders & Tracking</span>
            </button>
            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                currentView === 'admin' ? 'bg-amber-400/10 text-amber-400' : 'text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Inventory & Orders</span>
              </span>
              <span className="px-1.5 py-0.5 bg-amber-400 text-neutral-950 text-[10px] font-bold rounded">
                DASHBOARD
              </span>
            </button>
            <button
              onClick={() => { onNavigate('analytics'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                currentView === 'analytics' ? 'bg-amber-400/10 text-amber-400' : 'text-neutral-400'
              }`}
            >
              <LineChart className="w-4 h-4" />
              <span>Real-Time Sales Metrics</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
