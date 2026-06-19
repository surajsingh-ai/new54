import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  Clock3,
  Headphones,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { marketplaceCategories, sortPublicProducts } from "@/data/marketplace";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";

const hiddenHomeProductIds = new Set(["mk-phone-1"]);

const heroDeals = [
  { label: "Mobiles from Rs. 6,999", href: "/collections?category=mobiles" },
  { label: "Laptop deals up to 35% off", href: "/collections?category=electronics" },
  { label: "Home essentials under Rs. 999", href: "/collections?category=home" },
  { label: "Beauty picks buy 2 save more", href: "/collections?category=beauty" },
];

const serviceHighlights = [
  { icon: Truck, label: "Fast delivery" },
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: BadgePercent, label: "Daily deals" },
  { icon: Headphones, label: "24/7 support" },
];

const heroDepartments = [
  {
    title: "Electronics",
    subtitle: "Headphones, laptops, gadgets",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=500&q=80",
    href: "/collections?category=electronics",
  },
  {
    title: "Fashion",
    subtitle: "Everyday style picks",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80",
    href: "/collections?category=fashion",
  },
  {
    title: "Home",
    subtitle: "Decor, bedding, furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80",
    href: "/collections?category=home",
  },
  {
    title: "Grocery",
    subtitle: "Fresh essentials",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    href: "/collections?category=grocery",
  },
];

const promoTiles = [
  { label: "New launches", value: "30+" },
  { label: "Categories", value: "14" },
  { label: "Weekend offers", value: "Up to 45%" },
];

const MarketplaceHome = () => {
  const { products, loading } = useProducts();
  const publicProducts = sortPublicProducts(products, 2).filter((product) => !hiddenHomeProductIds.has(product.id));
  const topDeals = publicProducts.slice(0, 8);
  const electronics = publicProducts.filter((product) => ["mobiles", "electronics", "appliances"].includes(product.category)).slice(0, 4);
  const essentials = publicProducts.filter((product) => ["home", "grocery", "beauty", "kitchen", "health"].includes(product.category)).slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-100 pt-20 xl:pt-[120px]">
      <section className="border-b bg-white">
        <div className="container mx-auto grid gap-5 px-4 py-6 md:px-6 lg:grid-cols-12 lg:px-10">
          <div className="flex min-h-[420px] flex-col justify-center bg-[#172337] p-6 text-white shadow-sm md:p-8 lg:col-span-5">
            <div className="mb-5 inline-flex w-fit items-center gap-2 bg-[#ffd814] px-3 py-1.5 text-sm font-semibold text-[#172337]">
              <Zap className="h-4 w-4" />
              Mega shopping festival
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
              Shop more categories with better daily deals
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/82">
              Browse electronics, fashion, home, grocery, beauty, sports, books and daily essentials from one clean marketplace.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/collections">
                <Button className="h-11 bg-[#ffd814] px-6 font-semibold text-[#172337] hover:bg-[#f7ca00]">
                  Shop now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/collections?category=home">
                <Button variant="outline" className="h-11 border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                  Explore essentials
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {heroDeals.map((deal) => (
                <Link
                  key={deal.label}
                  to={deal.href}
                  className="flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90 transition hover:bg-white/15"
                >
                  <Clock3 className="h-4 w-4 text-[#ffd814]" />
                  {deal.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {promoTiles.map((tile) => (
                <div key={tile.label} className="border border-white/15 bg-white/10 p-3">
                  <p className="text-lg font-bold text-[#ffd814]">{tile.value}</p>
                  <p className="mt-1 text-xs font-medium text-white/70">{tile.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:col-span-7">
            <Link to="/collections" className="group relative min-h-[240px] overflow-hidden bg-slate-200 shadow-sm md:min-h-[280px]">
              <img
                src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&q=80"
                alt="Assorted online shopping products"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/88 via-[#111827]/48 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-6 text-white md:p-8">
                <div className="mb-3 inline-flex w-fit items-center gap-2 bg-[#ffd814] px-2.5 py-1 text-xs font-bold text-[#172337]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Curated marketplace
                </div>
                <h2 className="text-3xl font-bold leading-tight">Fresh offers across the store</h2>
                <p className="mt-2 text-sm leading-6 text-white/82">
                  Pick from gadgets, home upgrades, fashion, beauty, grocery and more.
                </p>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {heroDepartments.map((department) => (
                <Link key={department.title} to={department.href} className="group bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={department.image} alt={department.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-[#172337]">{department.title}</p>
                  <p className="line-clamp-1 text-xs text-slate-500">{department.subtitle}</p>
                </Link>
              ))}
            </div>

            <div className="grid gap-3 bg-white p-4 shadow-sm sm:grid-cols-3">
                <div className="flex items-center gap-3 text-[#172337]">
                  <PackageCheck className="h-5 w-5 text-[#007185]" />
                  <span className="text-sm font-semibold">Verified catalog</span>
                </div>
                <div className="flex items-center gap-3 text-[#172337]">
                  <ShoppingBag className="h-5 w-5 text-[#007185]" />
                  <span className="text-sm font-semibold">Easy checkout</span>
                </div>
                <div className="flex items-center gap-3 text-[#172337]">
                  <BadgePercent className="h-5 w-5 text-[#007185]" />
                  <span className="text-sm font-semibold">Daily offers</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="container mx-auto grid grid-cols-2 gap-3 px-4 py-4 md:grid-cols-4 md:px-6 lg:px-10">
          {serviceHighlights.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#e6f4f1] text-[#007185]">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-[#172337]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-6 md:px-6 lg:px-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#007185]">Shop by department</p>
            <h2 className="text-2xl font-bold text-[#172337]">Explore popular categories</h2>
          </div>
          <Link to="/collections" className="hidden text-sm font-semibold text-[#007185] hover:underline sm:inline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
          {marketplaceCategories.map((category) => (
            <Link
              key={category.category}
              to={`/collections?category=${category.category}`}
              className="group bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mx-auto aspect-square w-full overflow-hidden rounded bg-[#eef2f5]">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <p className="mt-2 text-sm font-semibold text-[#172337]">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto grid gap-6 px-4 pb-8 md:px-6 lg:grid-cols-2 lg:px-10">
        <div className="bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#172337]">Top deals on electronics</h2>
            <Link to="/collections?category=electronics" className="text-sm font-semibold text-[#007185] hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {electronics.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="aspect-square overflow-hidden bg-[#f4f7f9]">
                  <img src={product.image_url || ""} alt={product.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-semibold">{product.name}</p>
                <p className="text-sm text-[#cc0c39]">{formatCurrency(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#172337]">Daily essentials</h2>
            <Link to="/collections?category=grocery" className="text-sm font-semibold text-[#007185] hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {essentials.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="aspect-square overflow-hidden bg-[#f4f7f9]">
                  <img src={product.image_url || ""} alt={product.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-semibold">{product.name}</p>
                <p className="text-sm text-[#cc0c39]">{formatCurrency(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12 md:px-6 lg:px-10">
        <div className="mb-4 flex flex-col gap-2 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#007185]">Recommended for you</p>
            <h2 className="text-2xl font-bold text-[#172337]">Popular products across categories</h2>
          </div>
          <Link to="/collections">
            <Button variant="outline" className="border-[#007185] text-[#007185] hover:bg-[#e6f4f1]">
              View full catalog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white py-16 text-center text-muted-foreground">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MarketplaceHome;
