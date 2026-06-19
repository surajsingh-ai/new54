import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus, ArrowLeft, Check, X, Truck, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BuyNowButton from '@/components/BuyNowButton';
import ProductReviews from '@/components/ProductReviews';
import ProductCard from '@/components/ProductCard';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

import productToteBlack from '@/assets/product-tote-black.jpg';
import productCrossbodyTan from '@/assets/product-crossbody-tan.jpg';
import productSatchelTan from '@/assets/product-satchel-tan.jpg';
import productBackpackBlack from '@/assets/product-backpack-black.jpg';
import walletBlack from '@/assets/wallet-black.jpg';
import walletBrown1 from '@/assets/wallet-brown-1.jpg';
import walletBrown2 from '@/assets/wallet-brown-2.jpg';
import walletMonogram1 from '@/assets/wallet-monogram-1.jpg';
import walletMonogram2 from '@/assets/wallet-monogram-2.jpg';
import walletMonogram3 from '@/assets/wallet-monogram-3.jpg';
import beltBrown1 from '@/assets/belt-brown-1.jpg';
import beltMonogram1 from '@/assets/belt-monogram-1.jpg';
import beltMonogram2 from '@/assets/belt-monogram-2.jpg';

const imageMap: Record<string, string> = {
  '/product-tote-black.jpg': productToteBlack,
  '/product-crossbody-tan.jpg': productCrossbodyTan,
  '/product-satchel-tan.jpg': productSatchelTan,
  '/product-backpack-black.jpg': productBackpackBlack,
  '/wallet-black.jpg': walletBlack,
  '/wallet-brown-1.jpg': walletBrown1,
  '/wallet-brown-2.jpg': walletBrown2,
  '/wallet-monogram-1.jpg': walletMonogram1,
  '/wallet-monogram-2.jpg': walletMonogram2,
  '/wallet-monogram-3.jpg': walletMonogram3,
  '/belt-brown-1.jpg': beltBrown1,
  '/belt-monogram-1.jpg': beltMonogram1,
  '/belt-monogram-2.jpg': beltMonogram2,
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const product = products?.find(p => p.id === id);

  // Get related products from same category
  const relatedProducts = products?.filter(
    p => p.id !== id && p.category === product?.category
  ).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/collections')}>Browse Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = imageMap[product.image_url || ''] || product.image_url;
  const liked = isInWishlist(product.id);
  
  // Mock stock status (in real app would come from database)
  const inStock = true;
  const stockQuantity = 15;
  
  const sizes = ['Small', 'Medium', 'Large'];
  const hasSizeOptions = ['fashion', 'sports'].includes(product.category);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success('Added to cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to={`/collections?category=${product.category}`} className="hover:text-primary capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2 capitalize">{product.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8) 124 reviews</span>
              </div>
              <p className="text-3xl font-bold text-primary mb-4">{formatCurrency(product.price)}</p>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                {inStock ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    <span className="text-sm text-muted-foreground">({stockQuantity} available)</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Size Selector */}
            {hasSizeOptions && (
              <div className="space-y-3">
                <span className="font-medium">Size:</span>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 gap-2"
                  variant="outline"
                  disabled={!inStock}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
                <BuyNowButton product={product} className="flex-1" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-xs">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="w-6 h-6 text-primary" />
                <span className="text-xs">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-xs">1 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Quality checked marketplace product</li>
                  <li>- Reliable performance for daily use</li>
                  <li>- Packed securely for doorstep delivery</li>
                  <li>- Eligible for standard returns as per policy</li>
                  <li>- Support available for order and product questions</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize">{product.category}</span>
                    <span className="text-muted-foreground">Availability:</span>
                    <span>In stock</span>
                    <span className="text-muted-foreground">Delivery:</span>
                    <span>2-5 business days</span>
                    <span className="text-muted-foreground">Return Window:</span>
                    <span>7 days</span>
                    <span className="text-muted-foreground">Warranty:</span>
                    <span>Seller warranty where applicable</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Follow the care label or product manual where provided</li>
                  <li>- Keep electronics away from water and extreme heat</li>
                  <li>- Store grocery and beauty products as directed on packaging</li>
                  <li>- Retain original packaging until the return window closes</li>
                  <li>- Contact support if an item arrives damaged or incomplete</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={product.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
