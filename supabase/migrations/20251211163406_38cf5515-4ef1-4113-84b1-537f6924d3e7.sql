
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'handbags',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create liked_items (wishlist) table
CREATE TABLE public.liked_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

-- Only admins can manage products
CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Cart items policies
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Liked items policies
CREATE POLICY "Users can view their own liked items" 
ON public.liked_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own liked items" 
ON public.liked_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liked items" 
ON public.liked_items FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Order items policies
CREATE POLICY "Users can view their own order items" 
ON public.order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Admins can view all order items" 
ON public.order_items FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category) VALUES
('Classic Leather Tote', 'Elegant black leather tote bag perfect for everyday use', 299.00, '/product-tote-black.jpg', 'handbags'),
('Crossbody Messenger', 'Tan leather crossbody bag with adjustable strap', 189.00, '/product-crossbody-tan.jpg', 'handbags'),
('Executive Satchel', 'Premium tan leather satchel for professionals', 349.00, '/product-satchel-tan.jpg', 'handbags'),
('Urban Backpack', 'Sleek black leather backpack for modern lifestyle', 259.00, '/product-backpack-black.jpg', 'handbags');
