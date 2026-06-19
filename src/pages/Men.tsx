import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";
import { useProducts } from "@/hooks/useProducts";
import AdminAddProductFab from "@/components/AdminAddProductFab";

const Men = () => {
  const { products, loading } = useProducts(undefined, 'men');

  // Filter products by name patterns for wallets and belts
  const wallets = products.filter(p => 
    p.name.toLowerCase().includes('wallet') || 
    p.name.toLowerCase().includes('card holder')
  );
  
  const belts = products.filter(p => 
    p.name.toLowerCase().includes('belt')
  );

  const otherProducts = products.filter(p => 
    !wallets.includes(p) && !belts.includes(p)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">
              Men's Collection
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-6">
              For Him
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover our refined collection of men's leather goods, 
              crafted with precision and designed for the modern gentleman.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">Loading products...</div>
          ) : (
            <>
              <ProductCarousel 
                products={wallets} 
                title="Wallets" 
                viewAllLink="/accessories"
              />
              
              <ProductCarousel 
                products={belts} 
                title="Belts" 
                viewAllLink="/accessories"
              />
              
              <ProductCarousel 
                products={otherProducts} 
                title="More Products"
              />
            </>
          )}
        </div>
      </main>
      <Footer />
      <AdminAddProductFab />
    </div>
  );
};

export default Men;
