# RENCANA IMPLEMENTASI REVISI (revisi.md)
# Topik: Sinkronisasi Ganda (Dual-Sync Merge) Produk Admin ke Katalog Pelanggan

================================================================================
1. AKAR MASALAH (ROOT CAUSE ANALYSIS)
================================================================================
Berdasarkan tangkapan layar pengguna:
1. **Di Dashboard Admin (`/admin/products`):**
   Produk baru `wcwcwcwcww` (brand `WCWWWC`, harga Rp 230.000) sudah berhasil ditambahkan dan tampil di tabel admin.
2. **Di Katalog Pelanggan (`/catalog`):**
   Saat pengguna mencari `WCWCWCW`, sistem menampilkan *"Item Tidak Ditemukan (0 item)"*.

Penyebab Teknis:
1. **Logika `loadData()` Meng-overwrite State Produk:**
   Di `StoreContext.tsx`, ketika halaman katalog dibuka, fungsi `loadData()` dijalankan. Jika produk baru tersebut belum masuk ke cloud Supabase (karena izin RLS di Supabase belum sempat di-run), `loadData()` mengambil data dari remote Supabase yang belum memiliki produk tersebut, lalu me-replace/meng-overwrite daftar produk di memori. Akibatnya, produk baru yang baru saja ditambahkan di admin tertimpa dan hilang dari katalog.
2. **Pencarian String yang Rawan Null:**
   Di `src/app/catalog/page.tsx`, pencarian `p.description.toLowerCase()` belum menggunakan optional chaining (`?.`), sehingga jika produk baru tidak memiliki deskripsi lengkap, proses filter bisa terganggu.

================================================================================
2. FILE YANG AKAN DIUBAH (AFFECTED FILES)
================================================================================
- `src/context/StoreContext.tsx` :
  1. Terapkan strategi **Dual-Sync Merging** di `loadData()`: Menggabungkan data dari cloud Supabase dengan data lokal (`localStorage`) secara otomatis. Produk baru dari admin TIDAK AKAN PERNAH terhapus atau tertimpa lagi.
  2. Pastikan `addProduct` menyimpan data ke `localStorage` secara instan pada saat itu juga.
- `src/app/catalog/page.tsx` :
  Perbaiki logika pencarian teks agar toleran terhadap huruf besar/kecil, spasi, dan deskripsi kosong dengan optional chaining.

================================================================================
3. LANGKAH-LANGKAH TEKNIS IMPLEMENTASI
================================================================================
- [x] **Langkah 1:** Perbarui `loadData()` di `src/context/StoreContext.tsx` dengan algoritma penggabungan (merge) produk lokal dan cloud.
- [x] **Langkah 2:** Perbaiki filter pencarian di `src/app/catalog/page.tsx`.
- [x] **Langkah 3:** Jalankan `npx tsc --noEmit` untuk verifikasi TypeScript.
- [x] **Langkah 4:** Commit & push ke GitHub agar Vercel otomatis memperbarui sistem live.

================================================================================
4. ESTIMASI DAMPAK & RISIKO
================================================================================
- Produk baru yang ditambahkan di admin akan **langsung muncul di katalog `/catalog` dan beranda `/`** seketika tanpa hilang saat navigasi halaman.
- Pencarian produk bekerja akurat dan cepat.
