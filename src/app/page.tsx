"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame, ShieldCheck, Tag } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import DropCountdown from "@/components/DropCountdown";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function HomePage() {
  const { products, categories, isLoading } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const latestProducts = products.slice(0, 8);

  return (
    <div className="space-y-12">
      {/* 1. Hero Section ala SOLEX */}
      <HeroSection />

      {/* 2. Drop Countdown Notice */}
      <div id="drop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DropCountdown />
      </div>

      {/* 3. Shop by Category */}
      <CategoryGrid categories={categories} />

      {/* 4. Best Sellers / Curated Grails (Featured) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#3A4D28] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CURATED HIGHLIGHTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1012] tracking-tight">
              Koleksi Unggulan (Grails)
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-bold text-[#0F1012] hover:text-[#3A4D28] transition flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Promotional Streetwear Banner (Inspired by SOLEX Summer Sale) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#0F1012] border border-[#27272A] p-8 sm:p-12 text-[#FAF9F5] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left z-10">
            <span className="text-xs uppercase font-black tracking-widest text-[#A1A1AA] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              LIMITED TIME PROMO
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              VINTAGE DROP SALE
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md leading-relaxed">
              Gunakan kode voucher <span className="font-mono text-white font-bold bg-[#3A4D28] px-2 py-0.5 rounded">TRIFTWAR10</span> saat checkout untuk potongan langsung belanja pakaian vintage impian Anda.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end z-10">
            <span className="font-black text-6xl sm:text-7xl text-white tracking-tighter">
              40<span className="text-[#3A4D28]">%</span> <span className="text-2xl text-[#A1A1AA]">OFF</span>
            </span>
            <Link
              href="/catalog"
              className="mt-4 px-6 py-3 bg-[#FAF9F5] hover:bg-white text-[#0F1012] font-black text-xs tracking-wider uppercase rounded-xl transition shadow-lg"
            >
              Klaim & Belanja Sekarang
            </Link>
          </div>

          {/* Background glowing circle */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#3A4D28]/25 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 6. Latest Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#3A4D28] mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>FRESH FROM STEAM & WASH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1012] tracking-tight">
              Produk Terbaru Minggu Ini
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-bold text-[#0F1012] hover:text-[#3A4D28] transition flex items-center gap-1 group"
          >
            <span>Katalog Lengkap</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Why Trifting Official (Value Proposition) */}
      <section className="bg-white border-y border-[#E5E4DE] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-2">
              WHY SHOP WITH US
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0F1012] tracking-tight">
              Standar Kualitas Trifting Official
            </h3>
            <p className="text-xs sm:text-sm text-[#71717A] mt-2">
              Kami menghapus keraguan berbelanja baju bekas dengan standardisasi kurasi dan pelayanan layaknya butik fashion baru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-[#0F1012] text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                01
              </div>
              <h4 className="font-bold text-base text-[#0F1012]">Hygienic Washing & Steaming</h4>
              <p className="text-xs text-[#71717A] mt-2 leading-relaxed">
                Semua pakaian telah dicuci bersih dengan deterjen antibacterial dan disetrika uap temperatur tinggi sehingga wangi dan siap langsung dipakai.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-[#3A4D28] text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                02
              </div>
              <h4 className="font-bold text-base text-[#0F1012]">Honest Grading System</h4>
              <p className="text-xs text-[#71717A] mt-2 leading-relaxed">
                Pengukuran akurat dalam centimeter (Panjang x Lebar) dan pencatatan kondisi fisik secara jujur tanpa manipulasi foto atau filter kamera.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-[#0F1012] text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                03
              </div>
              <h4 className="font-bold text-base text-[#0F1012]">Fast Shipping & Secure Checkout</h4>
              <p className="text-xs text-[#71717A] mt-2 leading-relaxed">
                Integrasi pembayaran otomatis, pilihan kurir ekspedisi resmi terpercaya, dan nomor resi otomatis terupdate langsung ke akun Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
