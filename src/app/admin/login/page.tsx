"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Akses ditolak: Email atau kata sandi tidak valid.");
        setIsSubmitting(false);
        return;
      }

      await login(data.user.email, "admin");
      setIsSubmitting(false);
      router.push("/admin");
    } catch {
      setErrorMsg("Terjadi gangguan koneksi ke server saat memverifikasi kredensial.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1012] text-[#FAF9F5] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#161719] border border-[#27272A] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0F1012] border border-[#3A4D28] text-white flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6 text-[#4D6635]" />
          </div>
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#3A4D28] bg-[#0F1012] px-3 py-1 rounded-full border border-[#27272A]">
            RESTRICTED ACCESS
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Portal Khusus Admin
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Silakan otentikasi akun Super Admin resmi Trifting Official.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#A1A1AA] mb-1.5 uppercase tracking-wider text-[10px]">
              Email Admin *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#71717A]" />
              <input
                type="email"
                required
                placeholder="admin@trifting.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F1012] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-[#52525B] focus:border-[#3A4D28]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#A1A1AA] mb-1.5 uppercase tracking-wider text-[10px]">
              Kata Sandi Master *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#71717A]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F1012] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-[#52525B] focus:border-[#3A4D28]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#3A4D28] hover:bg-[#4D6635] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#27272A] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#71717A] hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website Toko</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
