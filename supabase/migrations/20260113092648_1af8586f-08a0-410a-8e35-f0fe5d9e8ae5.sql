-- Insert Men's Wallets with proper UUIDs
INSERT INTO products (id, name, description, price, image_url, category, gender, created_at, updated_at) VALUES
(gen_random_uuid(), 'Classic Black Wallet', 'Premium leather wallet in classic black', 2999, '/wallet-black.jpg', 'accessories', 'men', NOW(), NOW()),
(gen_random_uuid(), 'Brown Leather Wallet', 'Rich brown leather bifold wallet', 2799, '/wallet-brown-1.jpg', 'accessories', 'men', NOW(), NOW()),
(gen_random_uuid(), 'Vintage Brown Wallet', 'Vintage style brown wallet', 3299, '/wallet-brown-2.jpg', 'accessories', 'men', NOW(), NOW()),
(gen_random_uuid(), 'Monogram Wallet', 'Signature monogram design wallet', 3499, '/wallet-monogram-1.jpg', 'accessories', 'men', NOW(), NOW()),
(gen_random_uuid(), 'Monogram Card Holder', 'Compact monogram card holder', 2499, '/wallet-monogram-2.jpg', 'accessories', 'men', NOW(), NOW()),
(gen_random_uuid(), 'Premium Monogram Wallet', 'Luxury monogram wallet with multiple compartments', 3999, '/wallet-monogram-3.jpg', 'accessories', 'men', NOW(), NOW());

-- Insert Men's Belts with proper UUIDs
INSERT INTO products (id, name, description, price, image_url, category, gender, created_at, updated_at) VALUES
(gen_random_uuid(), 'Classic Brown Belt', 'Premium leather belt in rich brown', 2499, '/belt-brown-1.jpg', 'accessories', 'men', NOW(), NOW()),
(gen_random_uuid(), 'Monogram Belt', 'Signature monogram buckle belt', 3299, '/belt-monogram-1.jpg', 'accessories', 'men', NOW(), NOW()),
(gen_random_uuid(), 'Designer Monogram Belt', 'Luxury designer belt with monogram pattern', 3799, '/belt-monogram-2.jpg', 'accessories', 'men', NOW(), NOW());

-- Insert Women's Handbags with proper UUIDs
INSERT INTO products (id, name, description, price, image_url, category, gender, created_at, updated_at) VALUES
(gen_random_uuid(), 'Elegant Tote Bag', 'Spacious tote with premium leather finish', 34900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/handbags/WhatsApp%20Image%202025-12-10%20at%201.35.00%20PM%20(2).jpeg', 'handbags', 'women', NOW(), NOW()),
(gen_random_uuid(), 'Classic Handle Bag', 'Timeless design with sturdy handles', 38900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/handbags/WhatsApp%20Image%202025-12-10%20at%201.35.00%20PM%20(3)%20(1).jpeg', 'handbags', 'women', NOW(), NOW()),
(gen_random_uuid(), 'Signature Handbag', 'Iconic signature pattern design', 42900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/handbags/WhatsApp%20Image%202025-12-10%20at%201.35.00%20PM%20(3).jpeg', 'handbags', 'women', NOW(), NOW()),
(gen_random_uuid(), 'Premium Leather Bag', 'Handcrafted premium leather handbag', 37900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/handbags/WhatsApp%20Image%202025-12-10%20at%201.35.00%20PM.jpeg', 'handbags', 'women', NOW(), NOW());

-- Insert Women's Shoulder Bags with proper UUIDs
INSERT INTO products (id, name, description, price, image_url, category, gender, created_at, updated_at) VALUES
(gen_random_uuid(), 'Crossbody Shoulder Bag', 'Versatile crossbody with adjustable strap', 27900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.54.46%20PM.jpeg', 'shoulder-bags', 'women', NOW(), NOW()),
(gen_random_uuid(), 'Monogram Shoulder Bag', 'Elegant monogram design', 31900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.06%20PM.jpeg', 'shoulder-bags', 'women', NOW(), NOW()),
(gen_random_uuid(), 'Chain Strap Bag', 'Stylish chain strap detail', 29900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.12%20PM.jpeg', 'shoulder-bags', 'women', NOW(), NOW()),
(gen_random_uuid(), 'Classic Shoulder Bag', 'Classic design for everyday use', 28900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.13%20PM.jpeg', 'shoulder-bags', 'women', NOW(), NOW()),
(gen_random_uuid(), 'Compact Shoulder Bag', 'Compact and lightweight design', 25900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.14%20PM.jpeg', 'shoulder-bags', 'women', NOW(), NOW()),
(gen_random_uuid(), 'Leather Shoulder Bag', 'Premium leather with gold hardware', 32900, 'https://vqxbwmbihppuqvtprqjl.supabase.co/storage/v1/object/public/images/sholder%20bags/WhatsApp%20Image%202026-01-06%20at%2010.57.16%20PM.jpeg', 'shoulder-bags', 'women', NOW(), NOW());