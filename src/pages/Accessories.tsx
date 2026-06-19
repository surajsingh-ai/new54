import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";
import { useProducts } from "@/hooks/useProducts";
import AdminAddProductFab from "@/components/AdminAddProductFab";

const Accessories = () => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const walletsRef = useRef<HTMLDivElement>(null);
  const beltsRef = useRef<HTMLDivElement>(null);
  const type = searchParams.get("type");

  useEffect(() => {
    if (!loading && type) {
      const timeout = setTimeout(() => {
        if (type === "wallet" && walletsRef.current) {
          walletsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (type === "belt" && beltsRef.current) {
          beltsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [loading, type]);
  
  const wallets = products?.filter(product => 
    product.category.toLowerCase() === 'accessories' && product.name.toLowerCase().includes('wallet')
  ) || [];

  const belts = products?.filter(product => 
    product.category.toLowerCase() === 'accessories' && product.name.toLowerCase().includes('belt')
  ) || [];

  const otherAccessories = products?.filter(product => 
    product.category.toLowerCase() === 'accessories' && 
    !product.name.toLowerCase().includes('wallet') && 
    !product.name.toLowerCase().includes('belt')
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">
              Our Collection
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-6">
              Luxury Accessories
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Complete your look with our handcrafted Italian leather accessories, 
              designed with the same attention to detail as our signature handbags.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p>Loading accessories...</p>
            </div>
          ) : (
            <>
              {wallets.length > 0 && (
                <div ref={walletsRef}>
                  <ProductCarousel products={wallets} title="Wallets" />
                </div>
              )}
              {belts.length > 0 && (
                <div ref={beltsRef}>
                  <ProductCarousel products={belts} title="Belts" />
                </div>
              )}
              {otherAccessories.length > 0 && (
                <ProductCarousel products={otherAccessories} title="More Accessories" />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <AdminAddProductFab />
    </div>
  );
};

export default Accessories;
