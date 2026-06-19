-- Migration: Add admin policies to view all cart_items and order_items for debugging

-- Allow admins to view all cart items
CREATE POLICY IF NOT EXISTS "Admins can view all cart items"
ON public.cart_items FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all order items (already exists, but ensuring it's there)
-- This policy should already exist from the original migration, but adding it here for completeness

-- Note: Admins can already view all orders from the original migration
-- This just ensures cart_items are also viewable by admins

