import React from "react";
import Link from "next/link";
import { Category } from "@/types/database";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3A4D28] block mb-1">
            SHOP BY CATEGORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F1012] tracking-tight">
            Pilih Berdasarkan Kategori
          </h2>
        </div>
        <Link
          href="/catalog"
          className="text-xs font-bold text-[#0F1012] hover:text-[#3A4D28] transition underline decoration-2 underline-offset-4"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Grid Cards - Inspired by SOLEX category row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog?cat=${cat.slug}`}
            className="group bg-white border border-[#E5E4DE] rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#0F1012] hover:shadow-lg transition-all duration-300"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FAF9F5] mb-3 flex items-center justify-center">
              <img
                src={cat.imageUrl || "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300"}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0F1012] group-hover:text-[#3A4D28] transition">
              {cat.name}
            </h3>
            <span className="text-[11px] text-[#71717A] mt-0.5">
              {cat.itemCount || 8} Items
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
