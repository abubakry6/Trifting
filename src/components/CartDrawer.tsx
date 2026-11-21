"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Trash2, ArrowRight, Tag, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { formatRupiah } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    subtotal,
    appliedPromo,
    discountAmount,
    applyPromoCode,
    removePromo,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { promotions } = useStore();
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput, promotions);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-[420px] bg-white border-l border-[#E5E4DE] shadow-2xl flex flex-col justify-between animate-fade-in">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E5E4DE] flex items-center justify-between bg-[#FAF9F5]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#3A4D28]" />
              <h3 className="font-black text-base sm:text-lg text-[#0F1012]">Bag Belanja Anda</h3>
              <span className="text-xs bg-[#0F1012] text-white px-2 py-0.5 rounded-full font-bold">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#71717A] hover:text-[#0F1012] hover:bg-[#EAE9E3] rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#E5E4DE] flex items-center justify-center text-[#A1A1AA] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-[#0F1012]">Bag Anda Masih Kosong</h4>
                <p className="text-xs text-[#71717A] mt-1 max-w-xs">
                  Temukan koleksi pakaian vintage dan grails favorit Anda sebelum keduluan orang lain!
                </p>
                <Link
                  href="/catalog"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F1012] hover:bg-[#27272A] text-white text-xs font-bold rounded-lg transition"
                >
                  Jelajahi Katalog
                </Link>
              </div>
            ) : (
              items.map(({ product }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl relative"
                >
                  <img
                    src={product.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300"}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-lg bg-white border border-[#E5E4DE] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A4D28]">
                      {product.brand} • 1 OF 1 ITEM
                    </span>
                    <h5 className="font-bold text-xs text-[#0F1012] truncate mt-0.5">
                      {product.title}
                    </h5>
                    <p className="text-[11px] text-[#71717A] mt-0.5">
                      Ukuran: <span className="font-semibold text-[#0F1012]">{product.size}</span>
                    </p>
                    <p className="font-black text-sm text-[#0F1012] mt-2">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="absolute top-3 right-3 text-[#A1A1AA] hover:text-red-600 transition p-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#E5E4DE] bg-[#FAF9F5] space-y-4">
              
              {/* Promo Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-3 text-[#71717A]" />
                    <input
                      type="text"
                      placeholder="Kode Kupon (contoh: TRIFTWAR10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full bg-white border border-[#E5E4DE] rounded-lg pl-9 pr-3 py-2 text-xs uppercase font-semibold text-[#0F1012] placeholder:normal-case placeholder:font-normal focus:border-[#3A4D28]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0F1012] hover:bg-[#27272A] text-white text-xs font-bold rounded-lg transition shrink-0"
                  >
                    Pakai
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] font-medium ${promoMessage.isError ? "text-red-600" : "text-emerald-700"}`}>
                    {promoMessage.text}
                  </p>
                )}
                {appliedPromo && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs text-emerald-800">
                    <span>Kupon Aktif: <strong>{appliedPromo.code}</strong></span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-emerald-900 underline text-[11px] font-bold hover:text-red-600"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </form>

              {/* Subtotal Calculation */}
              <div className="space-y-1.5 text-xs text-[#71717A] pt-2 border-t border-[#E5E4DE]">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-[#0F1012]">{formatRupiah(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Diskon Kupon</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-[#0F1012] pt-2 border-t border-[#E5E4DE]">
                  <span>Total Sementara</span>
                  <span>{formatRupiah(total)}</span>
                </div>
                <p className="text-[10px] text-[#A1A1AA] italic">
                  *Ongkir dihitung saat memilih kurir ekspedisi di checkout.
                </p>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 bg-[#0F1012] hover:bg-[#27272A] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition group"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
