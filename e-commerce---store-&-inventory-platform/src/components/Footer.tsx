import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Heart, Sparkles, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-neutral-950 font-black text-base shadow-md">
                E
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                E-<span className="text-amber-400">COMMERCE</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Industrial design and high-fidelity acoustics for creators, developers, and discerning audiophiles.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit SSL Secure Merchant</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Hardware Collections
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li><span className="hover:text-amber-400 transition cursor-pointer">Studio ANC Headphones</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Titanium Ultra Smartwatches</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Mechanical Workstations</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Panoramic Ultrawide Displays</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">GaN Fast Charging Stations</span></li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Customer Care & Policy
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Free Express on $150+</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>2-Year Global Warranty</span>
              </li>
              <li className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>30-Day Risk-Free Trial</span>
              </li>
              <li><span>Guest Checkout Protected</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Exclusive Releases
            </h4>
            <p className="text-xs text-neutral-400">
              Join 40,000+ engineers receiving early drops and firmware updates.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to VIP drops!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="your.email@example.com"
                required
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 w-full"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-bold hover:bg-amber-300 transition shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">Privacy Policy</span>
            <span className="font-mono">Terms of Service</span>
            <span className="font-mono">Shipping & Taxes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
