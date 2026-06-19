-- Migration: Create all e-commerce tables
-- This migration creates all tables shown in the Supabase dashboard

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- PRODUCT VARIANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  attributes JSONB, -- For size, color, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- ============================================
-- COUPONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_purchase DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  payment_provider TEXT,
  payment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- SHIPMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  tracking_number TEXT UNIQUE,
  carrier TEXT,
  shipping_method TEXT,
  shipping_status TEXT NOT NULL DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled')),
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- USERS TABLE (Extended user information)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- CARTS TABLE (Alternative cart structure)
-- ============================================
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================
-- WISHLISTS TABLE (Alternative wishlist structure)
-- ============================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Wishlist',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wishlist_id, product_id)
);

-- ============================================
-- UPDATE PRODUCTS TABLE
-- ============================================
-- Add category_id to products if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - CATEGORIES
-- ============================================
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - PRODUCT VARIANTS
-- ============================================
CREATE POLICY "Product variants are viewable by everyone" 
ON public.product_variants FOR SELECT USING (true);

CREATE POLICY "Admins can manage product variants" 
ON public.product_variants FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - PRODUCT IMAGES
-- ============================================
CREATE POLICY "Product images are viewable by everyone" 
ON public.product_images FOR SELECT USING (true);

CREATE POLICY "Admins can manage product images" 
ON public.product_images FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - REVIEWS
-- ============================================
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" 
ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" 
ON public.reviews FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - COUPONS
-- ============================================
CREATE POLICY "Active coupons are viewable by everyone" 
ON public.coupons FOR SELECT USING (is_active = true AND valid_from <= now() AND valid_until >= now());

CREATE POLICY "Admins can view all coupons" 
ON public.coupons FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage coupons" 
ON public.coupons FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - PAYMENTS
-- ============================================
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" 
ON public.payments FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payments" 
ON public.payments FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - SHIPMENTS
-- ============================================
CREATE POLICY "Users can view shipments for their orders" 
ON public.shipments FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = shipments.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Admins can view all shipments" 
ON public.shipments FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage shipments" 
ON public.shipments FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - ADMINS
-- ============================================
CREATE POLICY "Admins can view admin records" 
ON public.admins FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage admin records" 
ON public.admins FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - USERS
-- ============================================
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all user profiles" 
ON public.users FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - CARTS
-- ============================================
CREATE POLICY "Users can view their own cart" 
ON public.carts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart" 
ON public.carts FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - WISHLISTS
-- ============================================
CREATE POLICY "Users can view their own wishlists" 
ON public.wishlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public wishlists are viewable by everyone" 
ON public.wishlists FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own wishlists" 
ON public.wishlists FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view items in their wishlists" 
ON public.wishlist_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid()));

CREATE POLICY "Users can manage items in their wishlists" 
ON public.wishlist_items FOR ALL 
USING (EXISTS (SELECT 1 FROM public.wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid()));

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_carts_updated_at
BEFORE UPDATE ON public.carts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wishlists_updated_at
BEFORE UPDATE ON public.wishlists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON public.wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON public.wishlist_items(product_id);

