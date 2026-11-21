-- =====================================================================
-- SEED DATA AWAL: TRIFTING OFFICIAL (KATEGORI & PRODUK STREETWEAR)
-- Jalankan skrip ini di Supabase Dashboard > SQL Editor > Run
-- =====================================================================

-- 1. SEED KATEGORI
INSERT INTO public.categories (id, name, slug, description, "imageUrl")
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Jackets & Outerwear', 'jackets-outerwear', 'Workwear vintage, bomber, racing jacket, and iconic Harrington pieces.', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'),
  ('22222222-2222-4222-8222-222222222222', 'Vintage T-Shirts', 'vintage-t-shirts', 'Single stitch 90s, band tee, Harley Davidson 3D emblem, and faded grails.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'),
  ('33333333-3333-4333-8333-333333333333', 'Hoodies & Sweaters', 'hoodies-sweaters', 'Boxy fit, heavyweight vintage Nike center swoosh, and collegiate crewnecks.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'),
  ('44444444-4444-4444-8444-444444444444', 'Denim & Pants', 'denim-pants', 'Levi''s 501 selvedge, Carhartt double-knee workpants, and retro trackpants.', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80'),
  ('55555555-5555-4555-8555-555555555555', 'Caps & Accessories', 'caps-accessories', 'Corduroy dad caps, vintage snapbacks, tote bags, and curated belt grails.', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    "imageUrl" = EXCLUDED."imageUrl";

-- 2. SEED PRODUK VINTAGE STREETWEAR
INSERT INTO public.products (
  id, title, slug, "categoryId", brand, size, "lengthCm", "widthCm", 
  "conditionGrade", "conditionNotes", price, "originalPrice", images, description, status, "isFeatured"
)
VALUES
(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Carhartt Detroit Jacket J97 Vintage Fade',
  'carhartt-detroit-jacket-j97-vintage-fade',
  '11111111-1111-4111-8111-111111111111',
  'Carhartt',
  'L (P 68cm x L 62cm)',
  68,
  62,
  'Grade A (9.5/10)',
  'Natural workwear sunfade yang sangat estetis, zipper tembaga lancar, blanket lining utuh tanpa sobek.',
  1450000,
  2200000,
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900&auto=format&fit=crop&q=80'],
  'Piece holy grail streetwear! Carhartt Detroit Jacket J97 original vintage era akhir 90-an dengan pudar alami (natural patina) yang dicari kolektor. Fitting boxy khas workwear Amerika.',
  'available',
  true
),
(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'Nike Center Swoosh Embroidered Vintage Hoodie',
  'nike-center-swoosh-embroidered-vintage-hoodie',
  '33333333-3333-4333-8333-333333333333',
  'Nike',
  'XL fit L (P 71cm x L 60cm)',
  71,
  60,
  'Grade A+ (Like New)',
  'Karet rib lengan dan pinggang kencang maksimal, bordir swoosh tengah tajam, warna abu heather pekat.',
  680000,
  950000,
  ARRAY['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=80'],
  'Hoodie Nike Center Swoosh vintage era Y2K. Bahan katun fleece tebal dan lembut, fitting drop-shoulder yang sangat nyaman dipakai harian.',
  'available',
  true
),
(
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'Harley Davidson 3D Emblem Eagle Vintage 1992 Tee',
  'harley-davidson-3d-emblem-eagle-vintage-1992-tee',
  '22222222-2222-4222-8222-222222222222',
  'Harley Davidson',
  'L (P 73cm x L 55cm)',
  73,
  55,
  'Vintage Distressed',
  'Single stitch atas-bawah era 1992 asli tag 3D Emblem Fort Worth, fading hitam kecoklatan vintage natural, ada pinhole mikro khas kain 30+ tahun.',
  890000,
  1400000,
  ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80'],
  'Kaos vintage grail paling dicari di dunia! Artwork elang 3D Emblem tahun 1992 legendaris. Jahitan single stitch dengan efek vintage wash autentik.',
  'available',
  true
),
(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'Levi''s 501 Selvedge Big E Raw Indigo 90s',
  'levis-501-selvedge-big-e-raw-indigo-90s',
  '44444444-4444-4444-8444-444444444444',
  'Levi''s',
  '32 (LP 84cm x P 104cm)',
  104,
  42,
  'Grade A+ (Like New)',
  'Kain denim kaku (crispy), redline selvedge utuh, button fly karat estetis, belum pernah dipotong.',
  980000,
  1650000,
  ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&auto=format&fit=crop&q=80'],
  'Celana jeans Levi''s 501 Redline Selvedge era 90-an dengan potongan lurus timeless. Warna raw indigo pekat siap untuk proses fading pemakaian pribadi.',
  'available',
  true
),
(
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  'Stussy 8-Ball Mohair Blend Knit Sweater',
  'stussy-8-ball-mohair-blend-knit-sweater',
  '33333333-3333-4333-8333-333333333333',
  'Stussy',
  'M fit L (P 69cm x L 58cm)',
  69,
  58,
  'Grade A (9.5/10)',
  'Bulu rajut mohair lembut tidak rontok, logo bola 8 di punggung tegas, tag leher hitam utuh.',
  820000,
  1350000,
  ARRAY['https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=900&auto=format&fit=crop&q=80'],
  'Knit sweater ikonik Stussy dengan motif bola 8 di bagian punggung. Bahan campuran mohair hangat dengan nuansa streetwear Jepang yang kental.',
  'available',
  false
),
(
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
  'Polo Ralph Lauren Vintage Corduroy Harrington Jacket',
  'polo-ralph-lauren-vintage-corduroy-harrington-jacket',
  '11111111-1111-4111-8111-111111111111',
  'Polo Ralph Lauren',
  'L (P 70cm x L 61cm)',
  70,
  61,
  'Grade B+ (Good Condition)',
  'Bahan korduroi tebal warna cokelat karamel, zipper kuningan lancar, bordir kuda pony rapi.',
  590000,
  890000,
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=80'],
  'Jaket korduroi model Harrington klasik dari Polo Ralph Lauren era 90-an. Sangat cocok untuk gaya kasual streetwear maupun semi-formal preppy vintage.',
  'available',
  false
)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    "categoryId" = EXCLUDED."categoryId",
    brand = EXCLUDED.brand,
    size = EXCLUDED.size,
    price = EXCLUDED.price,
    "originalPrice" = EXCLUDED."originalPrice",
    images = EXCLUDED.images,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    "isFeatured" = EXCLUDED."isFeatured";
