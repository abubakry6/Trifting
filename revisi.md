# RENCANA IMPLEMENTASI REVISI (revisi.md)
# Topik: Pembuatan Bucket Storage Supabase & Fitur Upload Foto Langsung di Modal Admin

================================================================================
1. AKAR MASALAH (ROOT CAUSE ANALYSIS DARI DUA TANGKAPAN LAYAR)
================================================================================
Berdasarkan 2 foto terbaru yang Anda kirim:
1. **Foto 1 (Halaman Storage Supabase):**
   Anda membuka halaman *Storage > Files*, tetapi di sana tertulis *"Create a file bucket"* dengan tombol hijau `+ New bucket`. Artinya **belum ada folder wadah (bucket) penyimpanan foto yang dibuat di Supabase Anda**. Tanpa bucket, file foto belum memiliki tempat tersimpan di cloud Supabase.
2. **Foto 2 (Halaman Table Editor Products):**
   Tabel `products` masih kosong (0 records) karena script SQL Seed pengisi katalog pakaian belum dieksekusi di menu SQL Editor.
3. **Kendala Pengalaman Pengguna (User Experience):**
   Saat ini admin harus menyalin URL teks secara manual. Hal ini menyulitkan pemilik toko yang ingin langsung memilih foto dari galeri HP atau folder laptop saat menambah produk.

================================================================================
2. PANDUAN LANGKAH DI SUPABASE (HANYA 10 DETIK)
================================================================================
Di tab browser Supabase yang sedang Anda buka (Foto 1):
1. Klik tombol hijau **`+ New bucket`**.
2. Masukkan nama bucket: **`product-images`**
3. **PENTING:** Aktifkan sakelar **`Public bucket`** (geser hingga berwarna hijau/ON agar foto bisa dilihat oleh pembeli).
4. Klik **Save**.

================================================================================
3. RENCANA PENYEMPURNAAN KODE ADMIN TOKO
================================================================================
- `src/app/admin/products/page.tsx` :
  1. Tambahkan area **Upload Foto Langsung** (bisa klik pilih file foto JPG/PNG dari HP/Laptop atau seret foto).
  2. Sistem otomatis mengunggah file yang dipilih ke Supabase Storage bucket `product-images` dan memunculkan pratinjau (*preview*) foto langsung di modal.
  3. Ubah input URL manual menjadi fleksibel (`type="text"`) dengan Auto-Resolver jika pengguna ingin menempel link luar/nama file.
- `src/context/StoreContext.tsx` :
  Pastikan `categoryId` aman dari error foreign key (fallback null jika bukan UUID).

================================================================================
4. LANGKAH-LANGKAH TEKNIS IMPLEMENTASI
================================================================================
- [x] **Langkah 1:** Tambahkan input file upload langsung & preview thumbnail di modal `src/app/admin/products/page.tsx`.
- [x] **Langkah 2:** Integrasikan fungsi upload langsung ke Supabase Storage API (`supabase.storage.from("product-images").upload(...)`).
- [x] **Langkah 3:** Jalankan `npx tsc --noEmit` untuk verifikasi TypeScript.
- [x] **Langkah 4:** Commit & push ke GitHub agar Vercel otomatis mengupdate produksi.

================================================================================
5. ESTIMASI DAMPAK & RISIKO
================================================================================
- Pemilik toko bisa menambah produk baru dengan **langsung memilih foto dari galeri HP/laptop** semudah di Instagram atau Tokopedia tanpa perlu repot copy-paste link manual lagi.
- Nol risiko terhadap transaksi checkout atau tampilan beranda.
