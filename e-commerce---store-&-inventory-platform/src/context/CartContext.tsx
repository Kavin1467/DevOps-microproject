import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types/ecommerce.ts';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  shippingFee: number;
  tax: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => { success: boolean; message: string };
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_STANDARD = 15;
const TAX_RATE = 0.0825;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('auracommerce_cart');
      return saved ? JSON.parse(saved) : [
        // initial starter item
        {
          product: {
            id: 'prod-1',
            sku: 'AURA-NC700',
            name: 'Aura Studio ANC Headphones',
            tagline: 'Spatial audio with custom 45mm neodymium acoustic drivers',
            description: 'Concert-grade sound with dynamic active noise cancellation.',
            price: 349,
            category: 'Audio',
            rating: 4.9,
            reviewCount: 328,
            stock: 24,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
            features: [],
            specs: {},
            createdAt: '2026-08-15T10:00:00Z'
          },
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  const [discountCode, setDiscountCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem('auracommerce_coupon') || null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('auracommerce_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (discountCode) {
      localStorage.setItem('auracommerce_coupon', discountCode);
    } else {
      localStorage.removeItem('auracommerce_coupon');
    }
  }, [discountCode]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string): { success: boolean; message: string } => {
    const existingIndex = items.findIndex(item => item.product.id === product.id);
    const currentQtyInCart = existingIndex > -1 ? items[existingIndex].quantity : 0;
    const requestedQty = currentQtyInCart + quantity;

    if (requestedQty > product.stock) {
      return {
        success: false,
        message: `Only ${product.stock} units available in stock.`
      };
    }

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity = requestedQty;
      if (selectedColor) updated[existingIndex].selectedColor = selectedColor;
      setItems(updated);
    } else {
      setItems([...items, { product, quantity, selectedColor }]);
    }

    setIsCartOpen(true);
    return {
      success: true,
      message: `Added ${product.name} to cart.`
    };
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = items.find(it => it.product.id === productId);
    if (item && quantity > item.product.stock) {
      return; // exceed stock
    }

    setItems(items.map(it => it.product.id === productId ? { ...it, quantity } : it));
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter(it => it.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAVE20') {
      setDiscountCode('SAVE20');
      return { success: true, message: 'Coupon applied! 20% discount granted.' };
    }
    if (clean === 'AURA10') {
      setDiscountCode('AURA10');
      return { success: true, message: 'Coupon applied! $10 discount granted.' };
    }
    if (clean === 'FREESHIP') {
      setDiscountCode('FREESHIP');
      return { success: true, message: 'Coupon applied! Free shipping unlocked.' };
    }
    return { success: false, message: 'Invalid coupon code. Try SAVE20 or AURA10' };
  };

  const removeCoupon = () => {
    setDiscountCode(null);
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  let discount = 0;
  if (discountCode === 'SAVE20') {
    discount = subtotal * 0.2;
  } else if (discountCode === 'AURA10') {
    discount = Math.min(10, subtotal);
  }

  const eligibleForFreeShipping = (subtotal - discount) >= FREE_SHIPPING_THRESHOLD || discountCode === 'FREESHIP';
  const shippingFee = items.length === 0 ? 0 : (eligibleForFreeShipping ? 0 : SHIPPING_STANDARD);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = items.length === 0 ? 0 : Number((taxableAmount * TAX_RATE).toFixed(2));
  const total = items.length === 0 ? 0 : Number((taxableAmount + shippingFee + tax).toFixed(2));

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount));

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      discount,
      discountCode,
      shippingFee,
      tax,
      total,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShippingRemaining,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
