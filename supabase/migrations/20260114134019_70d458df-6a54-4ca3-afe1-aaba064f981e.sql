-- Create product_reviews table for storing product reviews and ratings
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Enable RLS on product_reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews
CREATE POLICY "Anyone can view reviews" ON public.product_reviews
FOR SELECT USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create their own reviews" ON public.product_reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON public.product_reviews
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON public.product_reviews
FOR DELETE USING (auth.uid() = user_id);

-- Create user_addresses table for storing multiple addresses
CREATE TABLE public.user_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_addresses
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Users can view their own addresses
CREATE POLICY "Users can view their own addresses" ON public.user_addresses
FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own addresses
CREATE POLICY "Users can create their own addresses" ON public.user_addresses
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update their own addresses" ON public.user_addresses
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own addresses
CREATE POLICY "Users can delete their own addresses" ON public.user_addresses
FOR DELETE USING (auth.uid() = user_id);

-- Create coupons table for discount codes
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC DEFAULT 0,
  max_discount NUMERIC,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Everyone can view active coupons (for validation)
CREATE POLICY "Anyone can view active coupons" ON public.coupons
FOR SELECT USING (is_active = true);

-- Only admins can manage coupons
CREATE POLICY "Admins can manage coupons" ON public.coupons
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add stock_quantity and specifications to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS materials TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT;

-- Add payment_id and payment_status to orders for Razorpay
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- Create trigger for updated_at on new tables
CREATE TRIGGER update_product_reviews_updated_at
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at
BEFORE UPDATE ON public.user_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();