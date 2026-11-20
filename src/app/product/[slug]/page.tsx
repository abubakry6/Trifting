"use client";

import React, { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Ruler, 
  MessageCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft 
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatRupiah } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { products } = useStore();
  const { addToCart, items } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = products.find((p) => p.slug === slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-[#0F1012]">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-[#71717A] mt-2">Item mungkin telah dihapus atau URL tidak valid.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0F1012] text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isSold = product.status === "sold";
  const inWishlist = isInWishlist(product.id);
  const inCart = items.some((item) => item.product.id === product.id);

  const images = product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"
  ];

  const currentImage = images[selectedImageIndex] || images[0];

  // WhatsApp Pre-filled link
  const waText = encodeURIComponent(
    `Halo Trifting Official, saya tertarik dengan item:\n*${product.title}*\nBrand: ${product.brand}\nUkuran: ${product.size}\nHarga: ${formatRupiah(product.price)}\nLink: ${typeof window !== "undefined" ? window.location.href : ""}\nApakah masih available?`
  );

  // Related products
  const related = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#71717A] font-semibold">
        <Link href="/" className="hover:text-[#0F1012]">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-[#0F1012]">Katalog</Link>
        <span>/</span>
        <span className="text-[#0F1012] truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F4F3EE] border border-[#E5E4DE] shadow-sm">
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
              <span className="bg-[#0F1012]/85 text-[#FAF9F5] text-xs font-black tracking-wider px-3 py-1 rounded-md backdrop-blur-sm border border-white/10 uppercase">
                {product.conditionGrade}
              </span>
              <span className="bg-[#3A4D28] text-white text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded backdrop-blur-sm">
                1 OF 1 ITEM
              </span>
            </div>

            {/* Sold Out Overlay */}
            {isSold && (
              <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-lg tracking-widest px-6 py-2 rounded-lg uppercase shadow-2xl">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition ${
                    selectedImageIndex === idx ? "border-[#0F1012] shadow-md scale-95" : "border-[#E5E4DE] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & Purchasing Controls */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#71717A] mb-2 uppercase tracking-widest">
              <span>{product.brand}</span>
              <span className="text-[#3A4D28]">VINTAGE CURATION</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0F1012] tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Price Block */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-black text-[#0F1012]">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#A1A1AA] line-through font-semibold">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Measurements & Dimensions (Khas Pakaian Thrift) */}
            <div className="mt-6 p-4 rounded-xl bg-white border border-[#E5E4DE] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F1012] uppercase tracking-wider">
                <Ruler className="w-4 h-4 text-[#3A4D28]" />
                <span>Pengukuran Dimensi Riil (Centimeter)</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
                  <span className="text-[#71717A] block text-[11px]">Ukuran Tag:</span>
                  <span className="font-bold text-[#0F1012] text-sm">{product.size}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E4DE]">
                  <span className="text-[#71717A] block text-[11px]">Dimensi Riil (P x L):</span>
                  <span className="font-bold text-[#0F1012] text-sm">
                    {product.lengthCm && product.widthCm ? `${product.lengthCm} cm x ${product.widthCm} cm` : "Sesuai Tag"}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#71717A] italic">
                *Toleransi pengukuran 1-2 cm. Pastikan mengukur pakaian yang biasa Anda pakai di rumah.
              </p>
            </div>

            {/* Condition Notes (Honest Thrift Grading) */}
            <div className="mt-4 p-4 rounded-xl bg-white border border-[#E5E4DE] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F1012] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#3A4D28]" />
                <span>Catatan Fisik & Grading ({product.conditionGrade})</span>
              </div>
              <p className="text-xs text-[#3F3F46] leading-relaxed">
                {product.conditionNotes || "Kondisi sangat prima, kain terawat, tanpa noda atau robek signifikan."}
              </p>
            </div>

            {/* Full Description */}
            <div className="mt-4 text-xs text-[#52525B] leading-relaxed space-y-2">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-[#E5E4DE] space-y-3">
            {!isSold ? (
              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(product)}
                  disabled={inCart}
                  className={`flex-1 py-4 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition ${
                    inCart
                      ? "bg-[#3A4D28] text-white"
                      : "bg-[#0F1012] hover:bg-[#27272A] text-white"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Sudah di Keranjang</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Beli / Tambah ke Keranjang</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-xl border transition ${
                    inWishlist
                      ? "bg-[#3A4D28] text-white border-[#3A4D28]"
                      : "bg-white text-[#0F1012] border-[#E5E4DE] hover:border-[#0F1012]"
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-white" : ""}`} />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-xs font-black text-red-700 uppercase tracking-wider">
                  Item Ini Sudah Terjual (Sold Out)
                </p>
                <p className="text-[11px] text-red-600 mt-1">
                  Karena sifat thrift satu produk hanya satu pcs, silakan cari varian serupa di katalog kami.
                </p>
              </div>
            )}

            {/* WhatsApp CS Direct Button */}
            <a
              href={`https://wa.me/6281234567890?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#FAF9F5] hover:bg-[#EAE9E3] border border-[#E5E4DE] text-[#0F1012] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 text-[#3A4D28]" />
              <span>Tanya Kondisi / Nego via WhatsApp CS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-[#E5E4DE]">
          <h3 className="text-xl font-black text-[#0F1012] tracking-tight mb-6">
            Koleksi Sejenis Lainnya
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
