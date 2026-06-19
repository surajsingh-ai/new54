import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

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

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

interface CartReviewProps {
  cartItems: CartItem[];
  cartTotal: number;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: { coupon: any; discountAmount: number } | null;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  couponLoading: boolean;
  onNext: () => void;
}

const CartReview = ({
  cartItems,
  cartTotal,
  updateQuantity,
  removeFromCart,
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  couponLoading,
  onNext
}: CartReviewProps) => {
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalTotal = cartTotal - discountAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 bg-card p-4 rounded-lg border">
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
            <div className="text-right">
              <p className="font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-lg border h-fit space-y-4">
        <h2 className="text-xl font-bold">Order Summary</h2>
        
        {/* Coupon Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Discount Code</label>
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">
                  {appliedCoupon.coupon.code}
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  -{formatCurrency(appliedCoupon.discountAmount)} off
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={onRemoveCoupon}>
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <Button 
                onClick={onApplyCoupon} 
                disabled={!couponCode || couponLoading}
                variant="outline"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </div>

        <Button onClick={onNext} className="w-full" variant="gold">
          Continue to Shipping
        </Button>
      </div>
    </div>
  );
};

export default CartReview;
