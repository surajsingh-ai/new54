import type { Product } from "@/hooks/useProducts";

const now = new Date().toISOString();

export const marketplaceCategories = [
  { name: "Mobiles", category: "mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80" },
  { name: "Electronics", category: "electronics", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80" },
  { name: "Fashion", category: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80" },
  { name: "Home", category: "home", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" },
  { name: "Appliances", category: "appliances", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80" },
  { name: "Beauty", category: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" },
  { name: "Grocery", category: "grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" },
  { name: "Sports", category: "sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80" },
  { name: "Toys", category: "toys", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80" },
  { name: "Books", category: "books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80" },
  { name: "Kitchen", category: "kitchen", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80" },
  { name: "Health", category: "health", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80" },
  { name: "Baby Care", category: "baby", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80" },
  { name: "Automotive", category: "automotive", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80" },
];

const leatherCategoryNames = new Set(["handbags", "shoulder-bags", "accessories", "leather"]);

export const isLeatherProduct = (item: Product) => {
  const searchableText = `${item.name} ${item.category} ${item.description || ""}`.toLowerCase();
  return leatherCategoryNames.has(item.category.toLowerCase()) || /\b(leather|handbag|wallet|belt|satchel|tote|crossbody)\b/.test(searchableText);
};

const product = (
  id: string,
  name: string,
  category: string,
  price: number,
  image_url: string,
  description: string,
  stock_quantity = 50
): Product => ({
  id,
  name,
  category,
  price,
  image_url,
  description,
  gender: "unisex",
  stock_quantity,
  is_active: true,
  materials: null,
  care_instructions: null,
  specifications: null,
  created_at: now,
  updated_at: now,
});

export const marketplaceProducts: Product[] = [
  product("mk-phone-1", "Galaxy Max 5G Smartphone", "mobiles", 24999, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80", "128 GB storage, AMOLED display, 50 MP camera and all-day battery."),
  product("mk-phone-2", "iNova Pro Smartphone", "mobiles", 58999, "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=700&q=80", "Premium performance phone with pro camera system and fast charging."),
  product("mk-laptop-1", "UltraBook Air 14 Laptop", "electronics", 72999, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80", "Lightweight productivity laptop with 16 GB RAM and 512 GB SSD."),
  product("mk-headphones-1", "Noise Cancel Wireless Headphones", "electronics", 4999, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80", "Over-ear Bluetooth headphones with deep bass and 40-hour battery."),
  product("mk-watch-1", "FitPulse Smart Watch", "electronics", 3499, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80", "Fitness tracking, calls, notifications, heart-rate monitor and water resistance."),
  product("mk-camera-1", "Creator Mirrorless Camera", "electronics", 48990, "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80", "Compact mirrorless camera for creators with 4K video and fast autofocus."),
  product("mk-shirt-1", "Men's Cotton Casual Shirt", "fashion", 999, "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80", "Soft breathable cotton shirt for office and weekend wear."),
  product("mk-dress-1", "Women's Floral Summer Dress", "fashion", 1499, "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80", "Lightweight everyday dress with a relaxed fit and premium finish."),
  product("mk-shoes-1", "Running Shoes Pro", "fashion", 2799, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80", "Cushioned running shoes with breathable upper and durable grip."),
  product("mk-bag-1", "Everyday Travel Backpack", "fashion", 1899, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80", "Laptop-safe backpack with multiple compartments and water-resistant fabric."),
  product("mk-sofa-1", "Modern 3-Seater Sofa", "home", 21999, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80", "Comfortable fabric sofa for living rooms with sturdy wooden frame."),
  product("mk-lamp-1", "Minimal Desk Lamp", "home", 1299, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80", "Adjustable LED desk lamp for study, work and bedside use."),
  product("mk-bedding-1", "Premium Cotton Bedsheet Set", "home", 1799, "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80", "King-size cotton bedsheet set with two pillow covers."),
  product("mk-fridge-1", "Double Door Refrigerator", "appliances", 32990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=700&q=80", "Energy-efficient refrigerator with large capacity and quick cooling."),
  product("mk-washer-1", "Front Load Washing Machine", "appliances", 28990, "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=700&q=80", "Fully automatic washer with multiple wash programs and inverter motor."),
  product("mk-skincare-1", "Hydrating Skin Care Kit", "beauty", 1199, "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80", "Cleanser, toner and moisturizer kit for daily care."),
  product("mk-perfume-1", "Signature Eau De Parfum", "beauty", 2499, "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80", "Long-lasting fragrance with fresh citrus and warm amber notes."),
  product("mk-grocery-1", "Organic Grocery Basket", "grocery", 899, "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80", "Fresh vegetables, fruits and pantry basics for the week."),
  product("mk-coffee-1", "Premium Arabica Coffee Beans", "grocery", 649, "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=700&q=80", "Medium roast whole coffee beans with chocolate and nutty notes."),
  product("mk-cycle-1", "Hybrid City Bicycle", "sports", 14999, "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=700&q=80", "Lightweight hybrid bicycle for city rides and fitness."),
  product("mk-yoga-1", "Anti-Skid Yoga Mat", "sports", 799, "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=700&q=80", "Comfortable yoga mat with high-grip surface and carry strap."),
  product("mk-toy-1", "STEM Building Blocks Set", "toys", 1299, "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=700&q=80", "Creative construction set for kids with colorful durable pieces."),
  product("mk-book-1", "Business and Productivity Books Bundle", "books", 999, "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80", "Curated set of bestselling books for learning and growth."),
  product("mk-cooker-1", "Stainless Steel Pressure Cooker", "kitchen", 1999, "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=700&q=80", "Durable kitchen cooker for everyday meals with safety valve and induction base."),
  product("mk-cookware-1", "Non-Stick Cookware Set", "kitchen", 3499, "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80", "Multi-piece cookware set with easy-clean non-stick coating."),
  product("mk-health-1", "Digital Blood Pressure Monitor", "health", 1799, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80", "Accurate home health monitor with memory storage and large display."),
  product("mk-health-2", "Daily Wellness Supplements Pack", "health", 899, "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=700&q=80", "Essential vitamin and wellness pack for daily nutrition support."),
  product("mk-baby-1", "Baby Care Essentials Kit", "baby", 1299, "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80", "Gentle baby care set with bath, skin and hygiene essentials."),
  product("mk-baby-2", "Soft Cotton Baby Blanket", "baby", 799, "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=700&q=80", "Breathable cotton blanket for newborns and toddlers."),
  product("mk-auto-1", "Car Care Essentials Kit", "automotive", 1599, "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80", "Wash, polish, microfiber cloths and dashboard cleaner in one kit."),
  product("mk-auto-2", "Portable Car Vacuum Cleaner", "automotive", 2199, "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=700&q=80", "Compact car vacuum with strong suction, washable filter and multiple nozzles."),
  product("mk-leather-1", "Classic Leather Wallet", "fashion", 1199, "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80", "A small premium leather accessory kept as part of the fashion range."),
];

const curatedProductIds = new Set(marketplaceProducts.map((item) => item.id));

export const sortPublicProducts = (items: Product[], leatherLimit = 4) => {
  const curated: Product[] = [];
  const extraGeneral: Product[] = [];
  const extraLeather: Product[] = [];

  items.forEach((item) => {
    if (curatedProductIds.has(item.id)) {
      curated.push(item);
      return;
    }

    if (isLeatherProduct(item)) {
      extraLeather.push(item);
      return;
    }

    extraGeneral.push(item);
  });

  return [
    ...curated,
    ...extraGeneral,
    ...extraLeather.slice(0, leatherLimit),
  ];
};

export const findMarketplaceProduct = (productId: string) => {
  return marketplaceProducts.find((item) => item.id === productId);
};
