import { ShoppingBag, Heart, ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { formatCurrency } from '@/lib/utils';
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  // Prioritize handbags and shoulder-bags for the featured section
  const featuredProducts = (products
    ?.filter(p => p.category === 'handbags' || p.category === 'shoulder-bags')
    ?.slice(0, 4)) || products?.slice(0, 4) || [];

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
  };

  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-xl mb-4" />
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-6 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
                New Arrivals
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
              Latest <span className="italic text-primary">Designs</span>
            </h2>
          </div>
          <Link to="/handbags">
            <Button variant="luxury-outline" className="group">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => {
            const inWishlist = isInWishlist(product.id);
            
            return (
              <div
                key={product.id}
                className="group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square overflow-hidden bg-card rounded-xl mb-4">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  </Link>
                  
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
                        inWishlist 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background/80 text-foreground opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
                      }`}
                      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  
                  {/* Add to Cart */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button 
                      variant="luxury" 
                      className="w-full backdrop-blur-sm"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                
                <Link to={`/product/${product.id}`} className="block text-center group/text">
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-display text-lg mb-2 group-hover/text:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-primary font-semibold text-lg">{formatCurrency(product.price)}</p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
