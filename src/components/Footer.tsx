import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  CreditCard, 
  Instagram, 
  MessageCircle,
  ArrowUpRight 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F1012] text-[#FAF9F5] border-t border-[#27272A] mt-20 pb-20 lg:pb-0">
      
      {/* Trust Badges - Sesuai referensi visual SOLEX */}
      <div className="border-b border-[#27272A] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1A1C1E] border border-[#27272A] text-[#FAF9F5]">
              <Sparkles className="w-5 h-5 text-[#FAF9F5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-white">100% Curated Thrift</h4>
              <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                Setiap item dikurasi manual, autentik, dan telah disterilisasi siap pakai.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1A1C1E] border border-[#27272A] text-[#FAF9F5]">
              <ShieldCheck className="w-5 h-5 text-[#FAF9F5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-white">Transparan Kondisi</h4>
              <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                Detail minus, noda, dan ukuran P x L riil dipaparkan jelas tanpa ditutupi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1A1C1E] border border-[#27272A] text-[#FAF9F5]">
              <RotateCcw className="w-5 h-5 text-[#FAF9F5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-white">Garansi Sampai</h4>
              <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                Pesanan dikemas aman dengan resi pengiriman resmi JNE, SiCepat, & J&T.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1A1C1E] border border-[#27272A] text-[#FAF9F5]">
              <CreditCard className="w-5 h-5 text-[#FAF9F5]" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-white">Pembayaran Mudah</h4>
              <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                Dukungan QRIS instan, Transfer Bank Otomatis, dan CS WhatsApp ready.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F5] text-[#0F1012] flex items-center justify-center font-black text-xl tracking-tighter">
                TF
              </div>
              <div>
                <span className="font-black text-2xl tracking-tighter text-[#FAF9F5] block leading-none">
                  TRIFTING
                </span>
                <span className="text-[10px] tracking-[0.25em] font-bold text-[#A1A1AA] block leading-tight">
                  OFFICIAL
                </span>
              </div>
            </div>
            
            <p className="text-sm text-[#A1A1AA] max-w-sm leading-relaxed">
              Toko online kurasi pakaian streetwear vintage, workwear grail, retro sportswear, dan item langka 1-of-1. Tampil stylish dan ramah lingkungan bersama fashion preloved berkelas.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-[#1A1C1E] hover:bg-[#27272A] flex items-center justify-center text-[#FAF9F5] transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-[#1A1C1E] hover:bg-[#27272A] flex items-center justify-center text-[#FAF9F5] transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigasi Belanja */}
          <div>
            <h5 className="font-bold text-sm tracking-wider uppercase text-white mb-4">Katalog</h5>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li><Link href="/catalog" className="hover:text-white transition">Semua Produk</Link></li>
              <li><Link href="/catalog?cat=jackets-outerwear" className="hover:text-white transition">Vintage Jackets</Link></li>
              <li><Link href="/catalog?cat=vintage-t-shirts" className="hover:text-white transition">Single Stitch Tees</Link></li>
              <li><Link href="/catalog?cat=hoodies-sweaters" className="hover:text-white transition">Boxy Hoodies</Link></li>
              <li><Link href="/catalog?cat=denim-pants" className="hover:text-white transition">Selvedge Denim</Link></li>
            </ul>
          </div>

          {/* Bantuan & CS */}
          <div>
            <h5 className="font-bold text-sm tracking-wider uppercase text-white mb-4">Bantuan & Layanan</h5>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li><Link href="/orders/my-orders" className="hover:text-white transition">Lacak Pesanan Saya</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition">Panduan Ukuran (Size Guide)</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition">Standar Grading Kondisi</Link></li>
              <li>
                <a 
                  href="https://wa.me/6281234567890?text=Halo%20Trifting%20Official,%20saya%20butuh%20bantuan%20pesanan"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition flex items-center gap-1 text-[#4D6635] font-semibold"
                >
                  WhatsApp CS <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-[#27272A] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] gap-4">
          <p>© {new Date().getFullYear()} Trifting Official. All rights reserved.</p>
          <p className="text-[#A1A1AA]">
            Curated Streetwear & Vintage Grails
          </p>
        </div>
      </div>
    </footer>
  );
}
