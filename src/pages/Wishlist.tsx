import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import productToteBlack from '@/assets/product-tote-black.jpg';
import productCrossbodyTan from '@/assets/product-crossbody-tan.jpg';
import productSatchelTan from '@/assets/product-satchel-tan.jpg';
import productBackpackBlack from '@/assets/product-backpack-black.jpg';
import { formatCurrency } from '@/lib/utils';

const imageMap: Record<string, string> = {
  '/product-tote-black.jpg': productToteBlack,
  '/product-crossbody-tan.jpg': productCrossbodyTan,
  '/product-satchel-tan.jpg': productSatchelTan,
  '/product-backpack-black.jpg': productBackpackBlack,
};

const Wishlist = () => {
  const { wishlistItems, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please login to view your wishlist</h1>
          <Link to="/auth">
            <Button variant="gold">Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-4">Save items you love for later</p>
            <Link to="/collections">
              <Button variant="gold">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={imageMap[item.product.image_url] || item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <button
                  onClick={() => toggleWishlist(item.product_id)}
                  className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>

                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{item.product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{formatCurrency(item.product.price)}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item.product_id)}
                      className="gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
