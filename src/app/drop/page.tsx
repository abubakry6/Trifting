"use client";

import React from "react";
import Link from "next/link";
import { 
  Flame, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  Zap 
} from "lucide-react";
import DropCountdown from "@/components/DropCountdown";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function DropPage() {
  const { products } = useStore();

  const dropGrails = products.filter((p) => p.isFeatured || p.price > 500000);

  const handleNotifyMe = () => {
    const text = encodeURIComponent("Halo Admin Trifting Official, tolong ingatkan saya 15 menit sebelum Drop War Sabtu jam 19:00 WIB dimulai ya!");
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Top Banner Notice */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A4D28]/20 border border-[#3A4D28] text-xs font-bold text-[#3A4D28]">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>OFFICIAL THRIFT DROP VAULT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0F1012] tracking-tight uppercase">
          Drop War Release Schedule
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
          Semua pakaian vintage & streetwear grails kami dirilis berkala setiap minggunya. Setiap item eksklusif <strong>1 PCS ONLY</strong>. Siapa cepat, dia dapat!
        </p>
      </div>

      {/* Main Countdown Component */}
      <DropCountdown />

      {/* Drop Schedule & Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Schedule Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F1012] text-white flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#4D6635]" />
          </div>
          <h3 className="font-black text-base text-[#0F1012]">Jadwal Rilis Mingguan</h3>
          <p className="text-xs text-[#71717A] leading-relaxed">
            Drop utama berlangsung <strong>Setiap Hari Sabtu, Pukul 19:00 WIB</strong> tepat. Katalog baru akan otomatis terbuka di website ini.
          </p>
        </div>

        {/* Lock Rule Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#3A4D28] text-white flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <h3 className="font-black text-base text-[#0F1012]">Kunci Rebutan 15 Menit</h3>
          <p className="text-xs text-[#71717A] leading-relaxed">
            Saat Anda menekan checkout, item otomatis terkunci selama 15 menit agar tidak diserobot pengguna lain saat Anda menyelesaikan pembayaran.
          </p>
        </div>

        {/* Notification Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#0F1012] text-white flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-black text-base text-[#0F1012]">Pasang Pengingat WhatsApp</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Dapatkan notifikasi alarm via WhatsApp 15 menit sebelum drop rilis dimulai.
            </p>
          </div>
          <button
            onClick={handleNotifyMe}
            className="w-full py-2.5 bg-[#3A4D28] hover:bg-[#2D3B22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Kirim Notifikasi ke WA Saya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Drop Highlights: Upcoming & Fresh Grails */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-[#E5E4DE]">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#3A4D28] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GRAILS ARCHIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1012] tracking-tight">
              Koleksi Drop War Minggu Ini
            </h2>
          </div>

          <Link
            href="/catalog"
            className="text-xs font-bold text-[#0F1012] hover:text-[#3A4D28] flex items-center gap-1"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dropGrails.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
