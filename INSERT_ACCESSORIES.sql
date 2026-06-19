-- Insert Men's Wallets
INSERT INTO products (id, name, description, price, image_url, category, created_at, updated_at) VALUES
('w1', 'Classic Black Wallet', 'Premium leather wallet with multiple card slots', 1499, '/wallet-black.jpg', 'accessories', NOW(), NOW()),
('w2', 'Brown Leather Wallet', 'Elegant brown wallet with coin pocket', 1299, '/wallet-brown-1.jpg', 'accessories', NOW(), NOW()),
('w3', 'Cognac Leather Wallet', 'Stylish tan wallet with ID window', 1399, '/wallet-brown-2.jpg', 'accessories', NOW(), NOW()),
('w4', 'Signature Monogram Wallet', 'Signature monogram design wallet', 1799, '/wallet-monogram-1.jpg', 'accessories', NOW(), NOW()),
('w5', 'KI Monogram Wallet', 'Luxury designer wallet with pattern', 1899, '/wallet-monogram-2.jpg', 'accessories', NOW(), NOW()),
('w6', 'Compact Monogram Wallet', 'Top-tier monogram leather wallet', 1599, '/wallet-monogram-3.jpg', 'accessories', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Insert Men's Belts
INSERT INTO products (id, name, description, price, image_url, category, created_at, updated_at) VALUES
('b1', 'Classic Brown Belt', 'Premium leather belt with brass buckle', 1199, '/belt-brown-1.jpg', 'accessories', NOW(), NOW()),
('b2', 'Signature Monogram Belt', 'Signature monogram pattern belt', 1599, '/belt-monogram-1.jpg', 'accessories', NOW(), NOW()),
('b3', 'Premium Monogram Belt', 'Luxury designer belt with unique pattern', 1799, '/belt-monogram-2.jpg', 'accessories', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Insert Women's Handbags
INSERT INTO products (id, name, description, price, image_url, category, created_at, updated_at) VALUES
('h1', 'Elegant Tote Bag', 'Spacious tote with premium leather finish', 3490, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/handbags/WhatsApp%20Image%202025-12-10%20at%201.35.00%20PM%20(2).jpeg', 'handbags', NOW(), NOW()),
('h2', 'Classic Handle Bag', 'Timeless design with sturdy handles', 3890, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/handbags/WhatsApp%20Image%202025-12-10%20at%201.35.00%20PM%20(3)%20(1).jpeg', 'handbags', NOW(), NOW()),
('h3', 'Signature Handbag', 'Iconic signature pattern design', 4290, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/handbags/WhatsApp%20Image%202025-12-10%20at%201.35.00%20PM%20(3).jpeg', 'handbags', NOW(), NOW()),
('h4', 'Premium Leather Bag', 'Handcrafted premium leather handbag', 3790, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/handbags/WhatsApp%20Image%202025-12-10%20at%201.35.00%20PM.jpeg', 'handbags', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Insert Women's Shoulder Bags
INSERT INTO products (id, name, description, price, image_url, category, created_at, updated_at) VALUES
('s1', 'Crossbody Shoulder Bag', 'Versatile crossbody with adjustable strap', 2790, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.54.46%20PM.jpeg', 'handbags', NOW(), NOW()),
('s2', 'Monogram Shoulder Bag', 'Elegant monogram design', 3190, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.06%20PM.jpeg', 'handbags', NOW(), NOW()),
('s3', 'Chain Strap Bag', 'Stylish chain strap detail', 2990, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.12%20PM.jpeg', 'handbags', NOW(), NOW()),
('s4', 'Classic Shoulder Bag', 'Classic design for everyday use', 2890, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.13%20PM.jpeg', 'handbags', NOW(), NOW()),
('s5', 'Compact Shoulder Bag', 'Compact and lightweight design', 2590, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.14%20PM.jpeg', 'handbags', NOW(), NOW()),
('s6', 'Leather Shoulder Bag', 'Premium leather with gold hardware', 3290, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.16%20PM.jpeg', 'handbags', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();
