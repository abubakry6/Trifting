"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Promotion } from "@/types/database";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  appliedPromo: Promotion | null;
  discountAmount: number;
  applyPromoCode: (code: string, promos: Promotion[]) => { success: boolean; message: string };
  removePromo: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("trifting_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("trifting_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (product: Product) => {
    if (product.status === "sold") {
      return { success: false, message: "Item ini sudah terjual (Sold Out)!" };
    }

    const exists = items.some((item) => item.product.id === product.id);
    if (exists) {
      return { success: false, message: "Item thrift eksklusif ini sudah ada di keranjang Anda!" };
    }

    setItems((prev) => [...prev, { product, addedAt: new Date().toISOString() }]);
    setIsCartOpen(true);
    return { success: true, message: "Berhasil ditambahkan ke keranjang belanja." };
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price, 0);

  const discountAmount = appliedPromo
    ? appliedPromo.discountType === "percentage"
      ? Math.min((subtotal * appliedPromo.discountValue) / 100, appliedPromo.maxDiscount || Infinity)
      : appliedPromo.discountValue
    : 0;

  const applyPromoCode = (code: string, availablePromos: Promotion[]) => {
    const trimmed = code.trim().toUpperCase();
    const promo = availablePromos.find((p) => p.code.toUpperCase() === trimmed && p.isActive);

    if (!promo) {
      return { success: false, message: "Kode kupon tidak valid atau sudah kadaluarsa." };
    }

    if (subtotal < promo.minSpend) {
      return {
        success: false,
        message: `Minimal belanja untuk kupon ini adalah Rp ${promo.minSpend.toLocaleString("id-ID")}`,
      };
    }

    setAppliedPromo(promo);
    return { success: true, message: `Kupon ${promo.code} berhasil dipasang!` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems: items.length,
        appliedPromo,
        discountAmount,
        applyPromoCode,
        removePromo,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
