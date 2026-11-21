# RENCANA IMPLEMENTASI REVISI (revisi.md)
# Topik: Perbaikan Tampilan Keranjang Belanja (Cart Drawer) di Layar Ponsel (HP)

================================================================================
1. AKAR MASALAH (ROOT CAUSE ANALYSIS DARI TANGKAPAN LAYAR HP)
================================================================================
Pada tangkapan layar ponsel pengguna:
1. **Ada Celah Hitam 40px di Sebelah Kiri:**
   Kontainer laci keranjang (`CartDrawer.tsx`) memiliki kelas CSS bawaan `pl-10` (padding-left 40px) tanpa batas breakpoint layar, sehingga di layar HP yang sempit, laci terdorong 40px ke kanan dan menyisakan celah hitam backdrop di sebelah kiri.
2. **Sisi Kanan Terpotong (Overflowing):**
   Laci keranjang menggunakan kelas `w-screen` (100% lebar layar). Karena ditambah dorongan `pl-10`, total lebar menjadi `100vw + 40px`, yang menyebabkan sisi kanan (tombol silang X penutup, tombol "Pakai" kupon, dan angka total harga) terpotong keluar dari layar HP.

================================================================================
2. FILE YANG AKAN DIUBAH (AFFECTED FILES)
================================================================================
- `src/components/CartDrawer.tsx` :
  1. Ubah kontainer dari `pl-10` menjadi responsif `pl-0 sm:pl-10`.
  2. Ubah lebar laci dari `w-screen max-w-md` menjadi `w-full sm:max-w-md`.
  3. Sesuaikan padding internal dari `p-6` menjadi responsif `p-4 sm:p-6` agar tombol dan teks tidak mepet di layar HP kecil.
  4. Tambahkan kelas `shrink-0` pada tombol "Pakai" kupon agar tidak terhimpit.

================================================================================
3. LANGKAH-LANGKAH TEKNIS IMPLEMENTASI
================================================================================
- [x] **Langkah 1:** Modifikasi kontainer luar di `src/components/CartDrawer.tsx` agar di HP lebarnya penuh 100% (`w-full`) tanpa celah kiri (`pl-0`).
- [x] **Langkah 2:** Sesuaikan padding header, list produk, dan footer ringkasan pembayaran agar proporsional dan nyaman dijangkau jari.
- [x] **Langkah 3:** Jalankan `npx tsc --noEmit` untuk verifikasi tipe.
- [x] **Langkah 4:** Commit & push ke GitHub agar Vercel otomatis mengupdate tampilan live di HP.

================================================================================
4. ESTIMASI DAMPAK & RISIKO
================================================================================
- Hasil tampilan di HP menjadi rapi, pas di layar, tombol "X" penutup terlihat jelas, dan total harga tidak terpotong.
- Nol risiko terhadap fungsi hitung diskon atau data produk.
