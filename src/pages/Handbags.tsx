import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import AdminAddProductFab from "@/components/AdminAddProductFab";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCTS_PER_PAGE = 8;

const Handbags = () => {
  const { products, loading } = useProducts('handbags');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">
              Our Collection
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-6">
              Luxury Handbags
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover our exquisite collection of handcrafted Italian leather handbags, 
              designed to accompany you through life's every moment.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
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

export default Handbags;
