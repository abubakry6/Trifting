"use client";

import React, { useState, useEffect } from "react";
import { Flame, Clock, Bell } from "lucide-react";

export default function DropCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#161719] border border-[#27272A] rounded-2xl p-6 sm:p-8 text-[#FAF9F5] shadow-xl relative overflow-hidden">
      {/* Decorative Blur Accent */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#3A4D28]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#3A4D28]/40 border border-[#3A4D28] text-xs font-bold px-3 py-1 rounded-full text-[#ECEBE4] mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>DROP WAR THRIFT RESMI</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Next Drop: Vintage Grails & Heavyweight Jackets
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-xl">
            Semua item hanya tersedia 1 pcs. Pasang alarm Anda sebelum diserobot sesama penikmat vintage!
          </p>
        </div>

        {/* Counter Blocks */}
        <div className="flex items-center gap-3 self-center sm:self-auto">
          <div className="bg-[#0F1012] border border-[#27272A] rounded-xl px-4 py-3 text-center min-w-[70px]">
            <span className="block font-black text-2xl sm:text-3xl text-white">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">Jam</span>
          </div>

          <span className="font-bold text-xl text-[#71717A]">:</span>

          <div className="bg-[#0F1012] border border-[#27272A] rounded-xl px-4 py-3 text-center min-w-[70px]">
            <span className="block font-black text-2xl sm:text-3xl text-white">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">Menit</span>
          </div>

          <span className="font-bold text-xl text-[#71717A]">:</span>

          <div className="bg-[#0F1012] border border-[#27272A] rounded-xl px-4 py-3 text-center min-w-[70px]">
            <span className="block font-black text-2xl sm:text-3xl text-[#4D6635]">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">Detik</span>
          </div>
        </div>
      </div>
    </div>
  );
}
