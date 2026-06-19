-- Add is_active column to products table for status management
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Update existing products to be active
UPDATE public.products SET is_active = true WHERE is_active IS NULL;