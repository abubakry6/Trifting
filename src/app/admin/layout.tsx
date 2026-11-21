"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Shirt, 
  ShoppingBag, 
  Tag, 
  BarChart3, 
  ArrowLeft, 
  Menu, 
  X,
  ExternalLink,
  ShieldAlert,
  Lock,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Exclude /admin/login from the guard so admins can actually access the login page
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1012] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#3A4D28] border-t-transparent animate-spin mb-4" />
        <p className="text-xs uppercase font-bold tracking-widest text-[#A1A1AA]">
          Memverifikasi Hak Akses Keamanan Admin...
        </p>
      </div>
    );
  }

  // 2. Route Guard: Access Denied if not logged in or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0F1012] text-[#FAF9F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#161719] border border-[#27272A] rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400 bg-red-950/50 px-3 py-1 rounded-full border border-red-900/50">
              403 • ACCESS RESTRICTED
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Akses Khusus Pemilik Toko
            </h2>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Halaman ini dilindungi protokol keamanan. Anda harus masuk menggunakan akun Super Admin resmi Trifting Official untuk mengakses portal ini.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/admin/login"
              className="w-full py-3.5 bg-[#3A4D28] hover:bg-[#4D6635] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Login ke Portal Admin</span>
            </Link>

            <Link
              href="/"
              className="w-full py-3 bg-[#0F1012] hover:bg-[#27272A] border border-[#27272A] text-[#A1A1AA] hover:text-white font-semibold text-xs rounded-xl transition block"
            >
              Kembali ke Beranda Toko
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin View
  const adminNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Kelola Produk", href: "/admin/products", icon: Shirt },
    { label: "Kelola Pesanan & Resi", href: "/admin/orders", icon: ShoppingBag },
    { label: "Promo & Diskon", href: "/admin/promos", icon: Tag },
    { label: "Laporan Penjualan", href: "/admin/reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F4F3EE] text-[#0F1012] flex flex-col lg:flex-row">
      
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-[#0F1012] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-white hover:bg-white/10 rounded-lg"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-black text-sm tracking-tight">TRIFTING ADMIN</span>
        </div>
        <Link href="/" className="text-xs text-[#ECEBE4] flex items-center gap-1 font-semibold">
          <span>Ke Toko</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-[#0F1012] text-white p-6 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          {/* Brand Logo in Admin */}
          <div className="flex items-center gap-3 pb-6 border-b border-[#27272A]">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F5] text-[#0F1012] flex items-center justify-center font-black text-xl">
              TF
            </div>
            <div>
              <span className="font-black text-lg tracking-tight block leading-tight text-white">
                TRIFTING
              </span>
              <span className="text-[10px] tracking-[0.2em] font-bold text-[#4D6635] block">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-[#3A4D28] text-white shadow-md"
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#27272A] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center font-bold text-white flex-shrink-0">
                A
              </div>
              <div className="truncate">
                <span className="font-bold text-white block truncate">{user.fullName}</span>
                <span className="text-[10px] text-[#4D6635] font-bold block uppercase tracking-wider">Super Admin</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="p-1.5 text-[#71717A] hover:text-red-400 transition"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website Toko</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
