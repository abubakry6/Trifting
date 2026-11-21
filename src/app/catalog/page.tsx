"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import { formatRupiah } from "@/lib/utils";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || "all";

  const { products, categories } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedSort, setSelectedSort] = useState("latest");
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Real-time synchronization with URL parameters (e.g. from Navbar or CategoryGrid)
  React.useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  // Sizes available
  const sizes = ["S", "M", "L", "XL", "XXL", "W32", "One Size"];

  // Conditions available
  const conditions = [
    "Grade A+ (Like New)",
    "Grade A (9.5/10)",
    "Grade B+ (Good Condition)",
    "Grade B (Minus Noda Samar)",
    "Vintage Distressed",
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(query);
          const matchesBrand = p.brand.toLowerCase().includes(query);
          const matchesDesc = p.description.toLowerCase().includes(query);
          if (!matchesTitle && !matchesBrand && !matchesDesc) return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
          const category = categories.find((c) => c.slug === selectedCategory);
          if (category && p.categoryId !== category.id && p.categoryName !== category.name) {
            return false;
          }
        }

        // Size filter
        if (selectedSize !== "all") {
          if (!p.size.toUpperCase().includes(selectedSize.toUpperCase())) {
            return false;
          }
        }

        // Condition filter
        if (selectedCondition !== "all") {
          if (p.conditionGrade !== selectedCondition) return false;
        }

        // Price filter
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-low") return a.price - b.price;
        if (selectedSort === "price-high") return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    products,
    categories,
    searchQuery,
    selectedCategory,
    selectedSize,
    selectedCondition,
    selectedSort,
    maxPrice,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedCondition("all");
    setMaxPrice(2000000);
    setSelectedSort("latest");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedSize !== "all" ||
    selectedCondition !== "all" ||
    maxPrice < 2000000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E4DE]">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-1">
            CURATED GRAILS ARCHIVE
          </span>
          <h1 className="text-3xl font-black text-[#0F1012] tracking-tight">
            Katalog Pakaian Thrift
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Menampilkan {filteredProducts.length} item pakaian streetwear pilihan.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#71717A]" />
          <input
            type="text"
            placeholder="Cari Carhartt, Nike, Tee, Denim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E5E4DE] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F1012] focus:border-[#3A4D28] shadow-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-[#A1A1AA] hover:text-[#0F1012]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Filter Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-[#E5E4DE] h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F0EB]">
            <h3 className="font-black text-sm text-[#0F1012] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#3A4D28]" />
              Filter Produk
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-red-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Kategori */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#71717A] mb-3">
              Kategori
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition ${
                  selectedCategory === "all"
                    ? "bg-[#0F1012] text-white font-bold"
                    : "text-[#3F3F46] hover:bg-[#FAF9F5]"
                }`}
              >
                Semua Kategori
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition ${
                    selectedCategory === c.slug
                      ? "bg-[#0F1012] text-white font-bold"
                      : "text-[#3F3F46] hover:bg-[#FAF9F5]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ukuran (Size) */}
          <div className="pt-4 border-t border-[#F1F0EB]">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#71717A] mb-3">
              Ukuran
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSize("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  selectedSize === "all"
                    ? "bg-[#3A4D28] text-white border-[#3A4D28]"
                    : "bg-[#FAF9F5] text-[#3F3F46] border-[#E5E4DE] hover:border-[#0F1012]"
                }`}
              >
                Semua
              </button>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    selectedSize === s
                      ? "bg-[#3A4D28] text-white border-[#3A4D28]"
                      : "bg-[#FAF9F5] text-[#3F3F46] border-[#E5E4DE] hover:border-[#0F1012]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Grading Kondisi */}
          <div className="pt-4 border-t border-[#F1F0EB]">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#71717A] mb-3">
              Grade Kondisi
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCondition("all")}
                className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedCondition === "all"
                    ? "bg-[#0F1012] text-white font-bold"
                    : "text-[#3F3F46] hover:bg-[#FAF9F5]"
                }`}
              >
                Semua Grade
              </button>
              {conditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition truncate ${
                    selectedCondition === cond
                      ? "bg-[#0F1012] text-white font-bold"
                      : "text-[#3F3F46] hover:bg-[#FAF9F5]"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Batas Harga Maksimal */}
          <div className="pt-4 border-t border-[#F1F0EB]">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-[#71717A] uppercase tracking-wider">Harga Maks</span>
              <span className="text-[#0F1012]">{formatRupiah(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="200000"
              max="2500000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#3A4D28] cursor-pointer"
            />
          </div>
        </aside>

        {/* Products Grid & Sorting Header */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting & Mobile Filter Trigger */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E5E4DE]">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg text-xs font-bold text-[#0F1012]"
            >
              <Filter className="w-4 h-4 text-[#3A4D28]" />
              Filter ({filteredProducts.length})
            </button>

            <span className="hidden sm:inline text-xs font-semibold text-[#71717A]">
              Urutkan Berdasarkan:
            </span>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0F1012] focus:border-[#3A4D28]"
            >
              <option value="latest">Rilis Terbaru</option>
              <option value="price-low">Harga: Rendah ke Tinggi</option>
              <option value="price-high">Harga: Tinggi ke Rendah</option>
            </select>
          </div>

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E4DE] p-12 text-center">
              <h3 className="font-bold text-lg text-[#0F1012]">Item Tidak Ditemukan</h3>
              <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
                Tidak ada pakaian thrift yang cocok dengan kriteria pencarian Anda. Coba reset filter atau ganti kata kunci.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-[#0F1012] text-white text-xs font-bold rounded-lg"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E4DE]">
              <h3 className="font-black text-sm text-[#0F1012]">Filter Produk</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-[#71717A] hover:text-[#0F1012]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kategori Mobile */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#71717A] mb-2">
                Kategori
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    selectedCategory === "all" ? "bg-[#0F1012] text-white font-bold" : "text-[#3F3F46]"
                  }`}
                >
                  Semua
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      selectedCategory === c.slug ? "bg-[#0F1012] text-white font-bold" : "text-[#3F3F46]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol Terapkan */}
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-[#0F1012] text-white font-bold text-xs rounded-xl shadow-lg"
            >
              Terapkan Filter ({filteredProducts.length} Produk)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold">Memuat Katalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
