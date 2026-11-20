"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const { products } = useStore();

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-[#E5E4DE]">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-1">
          PERSONAL VAULT
        </span>
        <h1 className="text-3xl font-black text-[#0F1012] tracking-tight">
          Wishlist Produk Incaran
        </h1>
        <p className="text-xs text-[#71717A] mt-1">
          Menampilkan {wishlistProducts.length} item pakaian thrift yang Anda simpan.
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5E4DE] p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#E5E4DE] flex items-center justify-center mx-auto text-[#A1A1AA]">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#0F1012]">Wishlist Anda Masih Kosong</h3>
          <p className="text-xs text-[#71717A] max-w-sm mx-auto">
            Simpan item favorit Anda dengan menekan ikon hati pada kartu produk di katalog kami.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F1012] text-white text-xs font-bold rounded-xl shadow-lg"
          >
            <span>Eksplor Katalog Thrift</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
