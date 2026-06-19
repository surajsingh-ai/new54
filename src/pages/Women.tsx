import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";
import { useProducts } from "@/hooks/useProducts";
import AdminAddProductFab from "@/components/AdminAddProductFab";

const Women = () => {
  const { products, loading } = useProducts(undefined, 'women');

  // Filter products by category
  const handbags = products.filter(p => p.category === 'handbags');
  const shoulderBags = products.filter(p => p.category === 'shoulder-bags');
  const otherProducts = products.filter(p => 
    p.category !== 'handbags' && p.category !== 'shoulder-bags'
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">
              Women's Collection
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-6">
              For Her
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore our exquisite collection of women's luxury handbags and accessories, 
              designed to accompany you through life's every moment.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">Loading products...</div>
          ) : (
            <>
              <ProductCarousel 
                products={handbags} 
                title="Handbags" 
                viewAllLink="/handbags"
              />
              
              <ProductCarousel 
                products={shoulderBags} 
                title="Shoulder Bags" 
                viewAllLink="/handbags"
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

export default Women;
