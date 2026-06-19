import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, Search, SlidersHorizontal, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import AdminAddProductFab from "@/components/AdminAddProductFab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { marketplaceCategories, sortPublicProducts } from "@/data/marketplace";
import { useProducts } from "@/hooks/useProducts";

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const { products, loading } = useProducts(selectedCategory === "all" ? undefined : selectedCategory);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (!normalizedQuery) return true;
      return [product.name, product.category, product.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });

    const productList = selectedCategory === "all" ? sortPublicProducts(filtered, 4) : filtered;

    return [...productList].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });
  }, [products, query, selectedCategory, sort]);

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f8]">
      <Header />
      <main className="pt-24 xl:pt-36 pb-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-10">
          <section className="mb-5 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#007185]">Marketplace catalog</p>
                <h1 className="mt-1 text-3xl font-bold text-[#172337] md:text-4xl">
                  {selectedCategory === "all"
                    ? "All products"
                    : marketplaceCategories.find((item) => item.category === selectedCategory)?.name || "Products"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Browse a complete e-commerce catalog across everyday categories with quick search, category filtering and product actions.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:w-[520px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search catalog..."
                    className="h-11 rounded border-slate-300 bg-white pl-10"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="h-11 rounded border border-slate-300 bg-white px-3 text-sm font-medium"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-[#172337]">
                <Filter className="h-5 w-5" />
                <h2 className="font-bold">Categories</h2>
              </div>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleCategoryChange("all")}
                >
                  All products
                </Button>
                {marketplaceCategories.map((category) => (
                  <Button
                    key={category.category}
                    variant={selectedCategory === category.category ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleCategoryChange(category.category)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
              <div className="mt-6 border-t pt-5">
                <div className="mb-3 flex items-center gap-2 text-[#172337]">
                  <SlidersHorizontal className="h-5 w-5" />
                  <h2 className="font-bold">Popular filters</h2>
                </div>
                {["Free delivery", "4 stars and above", "Today's deals", "In stock"].map((filter) => (
                  <div key={filter} className="mb-3 flex items-center gap-2 text-sm text-slate-600">
                    <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-slate-300" />
                    {filter}
                  </div>
                ))}
              </div>
            </aside>

            <section>
              <div className="mb-4 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-slate-600">
                  Showing <strong className="text-[#172337]">{visibleProducts.length}</strong> products
                </p>
                <Link to="/" className="text-sm font-semibold text-[#007185] hover:underline">
                  Back to home
                </Link>
              </div>

              {loading ? (
                <div className="bg-white py-16 text-center text-muted-foreground">Loading products...</div>
              ) : visibleProducts.length === 0 ? (
                <div className="bg-white py-16 text-center">
                  <Star className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                  <p className="font-semibold text-[#172337]">No matching products found</p>
                  <p className="mt-1 text-sm text-slate-500">Try a different keyword or category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <AdminAddProductFab />
    </div>
  );
};

export default Collections;
