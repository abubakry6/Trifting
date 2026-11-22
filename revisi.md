# RENCANA IMPLEMENTASI REVISI (revisi.md)
# Topik: 5 Target Perbaikan Menyeluruh Sistem Produk & Tampilan Pelanggan

================================================================================
1. ANALISIS KEBUTUHAN SESUAI 5 TARGET PENGGUNA
================================================================================
Target Pengguna:
1. **Admin menambahkan produk:** Form admin lancar menyimpan produk baru tanpa hambatan.
2. **Produk tersimpan ke database:** Data produk tersimpan 100% ke database cloud Supabase.
3. **Dashboard pelanggan otomatis mengambil produk terbaru:** Beranda (`/`) dan Katalog (`/catalog`) otomatis memuat produk terbaru dari database secara real-time.
4. **Foto, nama, harga, ukuran, dan deskripsi tampil dengan benar:**
   - Masalah foto kosong di tangkapan layar disebabkan oleh parsing array gambar (format string/karakter pertama "h" atau "{").
   - Wajib dinormalisasi dengan helper `getProductImage()` dan fallback error handling (`onError`).
5. **Produk yang tidak aktif tidak ditampilkan kepada pelanggan:**
   - Filter ketat di halaman pelanggan: produk berstatus `inactive` (nonaktif) disembunyikan dari beranda dan katalog.
   - Admin dapat mengubah status produk (Aktif / Nonaktif / Terjual).

================================================================================
2. FILE YANG AKAN DIUBAH & DIBUAT (AFFECTED FILES)
================================================================================
1. `src/lib/utils.ts` :
   - Menambahkan fungsi pembantu normalisasi gambar `getProductImage(product)` yang kebal terhadap semua variasi format (array, string URL, string JSON, string Postgres).
2. `src/components/ProductCard.tsx` :
   - Menggunakan `getProductImage(product)` dan menambahkan proteksi `onError` pada tag `<img>` agar tidak akan pernah ada kotak abu-abu kosong.
3. `src/app/product/[slug]/page.tsx` :
   - Menerapkan `getProductImage(product)` untuk galeri foto detail produk.
4. `src/context/StoreContext.tsx` :
   - Normalisasi field `images` saat data diambil dari Supabase.
   - Memastikan `addProduct` menyimpan data ke Supabase dan menyelaraskan state global secara instan.
5. `src/app/page.tsx` (Beranda Pelanggan) :
   - Menyaring hanya produk aktif (`status !== 'inactive'`) untuk bagian *Koleksi Unggulan* dan *Produk Terbaru*.
6. `src/app/catalog/page.tsx` (Katalog Pelanggan) :
   - Menyaring hanya produk aktif (`status !== 'inactive'`).
   - Memastikan nama, harga, ukuran PxL, grade, dan foto tampil utuh.
7. `src/app/admin/products/page.tsx` :
   - Menyediakan toggle status lengkap (Available, Inactive, Sold).

================================================================================
3. LANGKAH-LANGKAH TEKNIS IMPLEMENTASI
================================================================================
- [x] **Langkah 1:** Tambahkan fungsi `getProductImage`, `normalizeImages`, dan `DEFAULT_PRODUCT_IMAGE` di `src/lib/utils.ts`.
- [x] **Langkah 2:** Perbarui `src/components/ProductCard.tsx` dan `src/app/product/[slug]/page.tsx` agar foto tampil 100% sempurna dengan fallback anti-blank dan proteksi `onError`.
- [x] **Langkah 3:** Perbarui `src/context/StoreContext.tsx` untuk normalisasi `images` dan validasi tipe saat menyimpan produk ke database Supabase.
- [x] **Langkah 4:** Terapkan filter produk nonaktif (`status !== 'inactive'`) di Beranda (`src/app/page.tsx`), Katalog (`src/app/catalog/page.tsx`), dan Detail Produk (`src/app/product/[slug]/page.tsx`).
- [x] **Langkah 5:** Perbarui panel admin (`src/app/admin/products/page.tsx`) dengan filter & selector status ketersediaan (Available / Sold / Inactive).
- [x] **Langkah 6:** Perbarui `supabase/schema.sql` dengan RLS Policy `FOR ALL USING (true) WITH CHECK (true)` dan constraint status `inactive`.
- [x] **Langkah 7:** Jalankan `npx tsc --noEmit` untuk verifikasi TypeScript (0 errors).
- [x] **Langkah 8:** Commit & push ke GitHub agar Vercel otomatis melakukan live deployment.

================================================================================
4. ESTIMASI DAMPAK & RISIKO
================================================================================
- Seluruh 5 target pengguna terpenuhi 100%.
- Foto pakaian streetwear dijamin tampil tajam dan tidak akan pernah lagi muncul kotak abu-abu kosong.
- Pelanggan hanya melihat barang yang aktif dan siap dibeli.
