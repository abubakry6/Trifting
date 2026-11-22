"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types/database";
import { formatRupiah, getProductImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, items } = useCart();
  const inWishlist = isInWishlist(product.id);
  const isSold = product.status === "sold";
  const inCart = items.some((item) => item.product.id === product.id);

  // Bulletproof image parsing and fallback
  const mainImage = getProductImage(product);

  return (
    <div className="group relative bg-white border border-[#E5E4DE] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F4F3EE]">
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition ${
            inWishlist
              ? "bg-[#3A4D28] text-white shadow-md"
              : "bg-white/80 hover:bg-white text-[#111111] shadow-sm"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
        </button>

        {/* Condition Grade Badge */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start">
          <span className="bg-[#0F1012]/85 text-[#FAF9F5] text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10 uppercase">
            {product.conditionGrade.split(" ")[0]} {product.conditionGrade.split(" ")[1] || ""}
          </span>
          <span className="bg-[#3A4D28]/90 text-white text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded backdrop-blur-sm">
            ONE PIECE ONLY
          </span>
        </div>

        {/* Sold Out Overlay */}
        {isSold && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-black text-sm tracking-widest px-4 py-1.5 rounded-md uppercase transform -rotate-6 shadow-xl border border-white/20">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Product Image */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
        </Link>
      </div>

      {/* Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Size */}
          <div className="flex items-center justify-between text-xs text-[#71717A] font-semibold mb-1">
            <span className="uppercase tracking-wider">{product.brand}</span>
            <span className="bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E5E4DE] text-[#0F1012] font-mono text-[11px]">
              {product.size.split("(")[0].trim()}
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h4 className="font-bold text-sm text-[#0F1012] line-clamp-2 hover:text-[#3A4D28] transition leading-snug">
              {product.title}
            </h4>
          </Link>
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-[#F1F0EB] flex items-center justify-between">
          <div>
            <span className="block font-black text-base text-[#0F1012]">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && (
              <span className="block text-[11px] text-[#A1A1AA] line-through font-medium">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart / Sold Button */}
          {!isSold ? (
            <button
              onClick={() => addToCart(product)}
              disabled={inCart}
              className={`p-2.5 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ${
                inCart
                  ? "bg-[#3A4D28] text-white cursor-default"
                  : "bg-[#0F1012] hover:bg-[#27272A] text-white"
              }`}
              title={inCart ? "Sudah di keranjang" : "Tambah ke Keranjang"}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Ada di Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Beli</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-xs font-bold text-[#A1A1AA] px-2 py-1 bg-[#F4F3EE] rounded">
              Terjual
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
