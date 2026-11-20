import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Compass } from "lucide-react";

export default function HeroSection() {
  const brands = [
    "CARHARTT",
    "NIKE VINTAGE",
    "STUSSY",
    "LEVI'S 501",
    "HARLEY DAVIDSON",
    "PATAGONIA",
    "ADIDAS RETRO",
    "RALPH LAUREN",
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] pt-6 pb-16 border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Hero - Inspired by SOLEX Reference */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F1012] via-[#161719] to-[#27272A] text-white shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[460px]">
          
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3A4D28]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Top Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#ECEBE4]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>THE CURATED STREETWEAR THRIFT VAULT</span>
            </div>
          </div>

          {/* Center Headline */}
          <div className="relative z-10 max-w-2xl my-8">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase">
              Step Into Authentic <br />
              <span className="text-[#ECEBE4] underline decoration-[#3A4D28] decoration-4 underline-offset-8">
                Vintage Grails.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] mt-4 max-w-lg leading-relaxed">
              Koleksi pilihan baju vintage, workwear jackets, dan streetwear langka 1-of-1. Setiap item telah dicuci bersih, disetrika uap, dan siap Anda kenakan.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                href="/catalog"
                className="px-6 py-3.5 bg-[#FAF9F5] hover:bg-white text-[#0F1012] font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
              >
                <span>Belanja Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog?view=categories"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl border border-white/20 backdrop-blur-sm transition"
              >
                Eksplor Kategori
              </Link>
            </div>
          </div>

          {/* Bottom Small Feature Ticker */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FAF9F5]" />
              <span>Garansi 100% Produk Thrift Autentik</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#FAF9F5]" />
              <span>Pengiriman Seluruh Indonesia via JNE, SiCepat, J&T</span>
            </div>
          </div>
        </div>

        {/* Brand Logos Row - Inspired by SOLEX Reference Top Brands */}
        <div className="mt-10 pt-6">
          <p className="text-center text-[11px] font-black uppercase tracking-[0.25em] text-[#71717A] mb-6">
            TOP CURATED BRANDS AVAILABLE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14 opacity-75">
            {brands.map((brand) => (
              <span
                key={brand}
                className="font-black text-sm sm:text-base tracking-widest text-[#0F1012] hover:text-[#3A4D28] transition cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
