"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut,
  Flame,
  LayoutDashboard
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Katalog", href: "/catalog" },
    { label: "Kategori", href: "/catalog?view=categories" },
    { label: "Drop Day 🔥", href: "/#drop-section" },
  ];

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-[#0F1012] text-[#FAF9F5] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#4D6635] animate-ping" />
        <span>DROP KOLEKSI VINTAGE STREETWEAR TERBARU SETIAP SABTU 19:00 WIB • ONE PIECE ONLY!</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E5E4DE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: Mobile Menu Button & Desktop Nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#111111] hover:bg-[#EAE9E3] rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#0F1012] text-[#FAF9F5] flex items-center justify-center font-black text-xl tracking-tighter border border-[#3A4D28] group-hover:scale-105 transition-transform">
                TF
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl sm:text-2xl tracking-tighter text-[#0F1012] leading-none">
                  TRIFTING
                </span>
                <span className="text-[10px] tracking-[0.25em] font-bold text-[#3A4D28] leading-tight">
                  OFFICIAL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#3F3F46]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`hover:text-[#0F1012] transition-colors py-1 relative ${
                      isActive ? "text-[#0F1012] font-bold" : ""
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3A4D28] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <Link
              href="/catalog"
              className="p-2.5 text-[#111111] hover:bg-[#EAE9E3] rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
              title="Cari Produk"
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline text-xs text-[#71717A]">Cari Grails...</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-[#111111] hover:bg-[#EAE9E3] rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlist > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#3A4D28] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#111111] hover:bg-[#EAE9E3] rounded-full transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#0F1012] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Admin Link */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2.5 text-[#111111] hover:bg-[#EAE9E3] rounded-full transition-colors flex items-center gap-1.5"
                title="Akun Saya"
              >
                <User className="w-5 h-5" />
                {isAdmin && (
                  <span className="hidden sm:inline-block text-[10px] bg-[#3A4D28] text-white font-bold px-1.5 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E4DE] rounded-xl shadow-xl py-2 z-50 text-sm animate-fade-in"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#F1F0EB]">
                        <p className="font-bold text-[#0F1012] truncate">{user.fullName}</p>
                        <p className="text-xs text-[#71717A] truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-[#FAF9F5] text-[#3A4D28] border border-[#3A4D28]/30 rounded">
                          {user.role}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[#3A4D28] font-bold hover:bg-[#FAF9F5] transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard Admin
                        </Link>
                      )}

                      <Link
                        href="/orders/my-orders"
                        className="flex items-center gap-2.5 px-4 py-2 text-[#27272A] hover:bg-[#FAF9F5] transition"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Riwayat Pesanan
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition border-t border-[#F1F0EB] mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar (Logout)
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-[#F1F0EB]">
                        <p className="font-bold text-[#0F1012]">Selamat Datang</p>
                        <p className="text-xs text-[#71717A]">Masuk untuk pengalaman belanja penuh</p>
                      </div>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2.5 text-[#0F1012] font-bold hover:bg-[#FAF9F5] transition"
                      >
                        Masuk (Login)
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center gap-2 px-4 py-2 text-[#71717A] hover:bg-[#FAF9F5] transition"
                      >
                        Daftar Akun Baru
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5E4DE] bg-[#FAF9F5] px-6 py-5 space-y-4 animate-fade-in">
            <div className="flex flex-col space-y-3 font-semibold text-base text-[#111111]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[#3A4D28] transition"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[#E5E4DE] flex flex-col gap-2">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <span>Wishlist Favorit</span>
                  <span className="bg-[#3A4D28] text-white text-xs px-2 py-0.5 rounded-full">
                    {totalWishlist}
                  </span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-[#3A4D28] font-bold py-1"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Thumb Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E4DE] py-2 px-6 flex items-center justify-between text-xs font-semibold text-[#71717A]">
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === "/" ? "text-[#0F1012] font-bold" : ""}`}>
          <Flame className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link href="/catalog" className={`flex flex-col items-center gap-1 ${pathname.startsWith("/catalog") ? "text-[#0F1012] font-bold" : ""}`}>
          <Search className="w-5 h-5" />
          <span>Katalog</span>
        </Link>
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="relative flex flex-col items-center gap-1 text-[#0F1012]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#3A4D28] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span>Keranjang</span>
        </button>
        <Link href="/wishlist" className={`relative flex flex-col items-center gap-1 ${pathname === "/wishlist" ? "text-[#0F1012] font-bold" : ""}`}>
          <div className="relative">
            <Heart className="w-5 h-5" />
            {totalWishlist > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#3A4D28] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalWishlist}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </Link>
        <Link href={user ? "/orders/my-orders" : "/login"} className={`flex flex-col items-center gap-1 ${pathname.startsWith("/login") ? "text-[#0F1012] font-bold" : ""}`}>
          <User className="w-5 h-5" />
          <span>{user ? "Akun" : "Masuk"}</span>
        </Link>
      </div>
    </>
  );
}
