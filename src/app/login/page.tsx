"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, "customer");
    setIsSubmitting(false);
    router.push("/catalog");
  };

  const handleQuickDemoCustomer = () => {
    login("dimas.customer@gmail.com", "customer");
    router.push("/catalog");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-[#E5E4DE] rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#0F1012] text-white flex items-center justify-center font-black text-xl mx-auto">
            TF
          </div>
          <h2 className="text-2xl font-black text-[#0F1012] tracking-tight">
            Masuk ke Trifting Official
          </h2>
          <p className="text-xs text-[#71717A]">
            Akses riwayat pesanan, kelola wishlist, dan checkout lebih cepat.
          </p>
        </div>

        {/* Quick Demo Customer Button */}
        <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-[#E5E4DE] text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#3A4D28] block mb-1.5">
            PILIHAN LOGIN CEPAT (CUSTOMER)
          </span>
          <button
            onClick={handleQuickDemoCustomer}
            className="w-full py-2 bg-white border border-[#E5E4DE] hover:border-[#0F1012] font-bold text-xs text-[#0F1012] rounded-xl transition shadow-sm"
          >
            Masuk sebagai Customer Demo
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#3F3F46] mb-1">Email</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#71717A]" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl pl-10 pr-4 py-2.5 text-[#0F1012] focus:border-[#3A4D28]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#3F3F46] mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#71717A]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl pl-10 pr-4 py-2.5 text-[#0F1012] focus:border-[#3A4D28]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#0F1012] hover:bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#71717A]">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-[#0F1012] underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
