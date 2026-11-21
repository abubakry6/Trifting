-- =====================================================================
-- DATABASE SCHEMA: TRIFTING OFFICIAL (POSTGRESQL / SUPABASE)
-- Sesuai Pedoman Rekayasa ZettBOT v1.0.0
-- Standard Naming: PascalCase / CamelCase tanpa karakter underscore (_)
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Terhubung ke Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    "avatarUrl" TEXT,
    "defaultAddress" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABEL PRODUCTS (Koleksi Pakaian Thrift Eksklusif / One-of-a-Kind)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    "categoryId" UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand TEXT NOT NULL,
    size TEXT NOT NULL,
    "lengthCm" NUMERIC,
    "widthCm" NUMERIC,
    "conditionGrade" TEXT NOT NULL,
    "conditionNotes" TEXT,
    price NUMERIC NOT NULL,
    "originalPrice" NUMERIC,
    images TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABEL PROMOTIONS (Voucher Diskon)
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    "discountType" TEXT NOT NULL CHECK ("discountType" IN ('percentage', 'fixed')),
    "discountValue" NUMERIC NOT NULL,
    "minSpend" NUMERIC NOT NULL DEFAULT 0,
    "maxDiscount" NUMERIC,
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMPTZ,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABEL ORDERS (Transaksi Pesanan)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderNumber" TEXT NOT NULL UNIQUE, -- TRF-YYYYMMDD-XXX
    "userId" UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "shippingAddress" JSONB NOT NULL,
    "shippingCourier" TEXT NOT NULL,
    "shippingCost" NUMERIC NOT NULL DEFAULT 0,
    subtotal NUMERIC NOT NULL,
    "discountAmount" NUMERIC NOT NULL DEFAULT 0,
    "totalAmount" NUMERIC NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending', 'paid', 'failed', 'expired')),
    "orderStatus" TEXT NOT NULL DEFAULT 'processing' CHECK ("orderStatus" IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    "paymentMethod" TEXT NOT NULL,
    "paymentRef" TEXT,
    "trackingNumber" TEXT,
    notes TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABEL ORDERITEMS
CREATE TABLE IF NOT EXISTS public.orderitems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    "productId" UUID REFERENCES public.products(id) ON DELETE SET NULL,
    "productTitle" TEXT NOT NULL,
    "productPrice" NUMERIC NOT NULL,
    "productSize" TEXT,
    "productImage" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABEL WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    "productId" UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE("userId", "productId")
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT & ANTI-ERROR)
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orderitems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if auth user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are readable by authenticated users" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Categories Policies
DROP POLICY IF EXISTS "Categories are readable by everyone" ON public.categories;
CREATE POLICY "Categories are readable by everyone" ON public.categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categories manageable by admin" ON public.categories;
CREATE POLICY "Categories manageable by admin" ON public.categories
    FOR ALL USING (public.is_admin());

-- Products Policies
DROP POLICY IF EXISTS "Products are readable by everyone" ON public.products;
CREATE POLICY "Products are readable by everyone" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Products manageable by admin" ON public.products;
CREATE POLICY "Products manageable by admin" ON public.products
    FOR ALL USING (public.is_admin());

-- Promotions Policies
DROP POLICY IF EXISTS "Active promotions readable by public" ON public.promotions;
CREATE POLICY "Active promotions readable by public" ON public.promotions
    FOR SELECT USING ("isActive" = true OR public.is_admin());

DROP POLICY IF EXISTS "Promotions manageable by admin" ON public.promotions;
CREATE POLICY "Promotions manageable by admin" ON public.promotions
    FOR ALL USING (public.is_admin());

-- Orders Policies
DROP POLICY IF EXISTS "Orders readable by owner or admin" ON public.orders;
DROP POLICY IF EXISTS "Orders readable by all" ON public.orders;
CREATE POLICY "Orders readable by all" ON public.orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Orders updateable by admin" ON public.orders;
DROP POLICY IF EXISTS "Orders updateable by all" ON public.orders;
CREATE POLICY "Orders updateable by all" ON public.orders
    FOR UPDATE USING (true);

-- OrderItems Policies
DROP POLICY IF EXISTS "Order items readable by owner or admin" ON public.orderitems;
DROP POLICY IF EXISTS "Order items readable by all" ON public.orderitems;
CREATE POLICY "Order items readable by all" ON public.orderitems
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert order items" ON public.orderitems;
CREATE POLICY "Public can insert order items" ON public.orderitems
    FOR INSERT WITH CHECK (true);

-- Wishlists Policies
DROP POLICY IF EXISTS "Wishlist manageable by owner" ON public.wishlists;
CREATE POLICY "Wishlist manageable by owner" ON public.wishlists
    FOR ALL USING (auth.uid() = "userId");

-- =====================================================================
-- TRIGGER: AUTO-CREATE PROFILE ON AUTH SIGNUP
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, "fullName", role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- STORAGE BUCKET: product-images (Bisa diaktifkan di Supabase Dashboard)
-- =====================================================================
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;
