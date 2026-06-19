import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
import { formatCurrency } from '@/lib/utils';

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

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Start shopping to add items to your cart</p>
            <Link to="/collections">
              <Button variant="gold">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-card p-4 rounded-lg shadow-sm">
                  <img
                    src={imageMap[item.product.image_url] || item.product.image_url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-primary font-bold">{formatCurrency(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </div>
              <Button
                variant="gold"
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
