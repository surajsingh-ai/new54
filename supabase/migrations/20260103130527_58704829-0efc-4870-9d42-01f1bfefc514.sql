-- Add gender column to products table
ALTER TABLE public.products 
ADD COLUMN gender text NOT NULL DEFAULT 'unisex' 
CHECK (gender IN ('men', 'women', 'unisex'));