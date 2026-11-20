"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Halo CS Trifting Official, saya ingin tanya mengenai koleksi pakaian thrift...");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6281234567890?text=${encoded}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-6 z-40">
      {/* WhatsApp Modal Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white border border-[#E5E4DE] rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#3A4D28] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#3A4D28] flex items-center justify-center font-bold">
                TF
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Customer Service</h4>
                <p className="text-[11px] text-white/80">Trifting Official • Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Bubble Simulation */}
          <div className="p-4 bg-[#FAF9F5] space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none border border-[#E5E4DE] shadow-sm text-xs text-[#0F1012] leading-relaxed">
              Halo! Ada grails atau ukuran baju yang ingin Anda tanyakan? Tim kami siap membantu cek detail kondisi & pengiriman.
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="space-y-2 pt-2">
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#E5E4DE] rounded-lg focus:border-[#3A4D28] text-[#0F1012] resize-none"
                placeholder="Tulis pesan Anda..."
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#3A4D28] hover:bg-[#2D3B22] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition"
              >
                <span>Buka WhatsApp</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#3A4D28] hover:bg-[#2D3B22] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300 relative group"
        title="Chat Customer Service via WhatsApp"
        aria-label="WhatsApp CS"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
