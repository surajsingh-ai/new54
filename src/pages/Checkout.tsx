import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useCoupons } from '@/hooks/useCoupons';
import { useAddresses, Address } from '@/hooks/useAddresses';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CartReview from '@/components/checkout/CartReview';
import ShippingStep from '@/components/checkout/ShippingStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';
import { Link } from 'react-router-dom';

const CHECKOUT_STEPS = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

const Checkout = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { defaultAddress } = useAddresses();
  const { appliedCoupon, loading: couponLoading, validateCoupon, removeCoupon, calculateDiscount } = useCoupons();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ id: string; total: number } | null>(null);

  // Set default address when loaded
  useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [defaultAddress, selectedAddress]);

  const discountAmount = calculateDiscount(cartTotal);
  const finalTotal = cartTotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    await validateCoupon(couponCode, cartTotal);
  };

  // When guest tries to proceed past cart, prompt login
  const handleProceedFromCart = () => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }
    setCurrentStep(1);
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!selectedAddress) return;

    setIsProcessing(true);

    try {
      const shippingAddress = `${selectedAddress.full_name}, ${selectedAddress.phone}, ${selectedAddress.address_line1}${selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}, ${selectedAddress.country}`;

      const order = await createOrder(shippingAddress);
      
      if (order) {
        setCompletedOrder({ id: order.id, total: finalTotal });
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0 && currentStep < 3) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Start shopping to add items to your cart</p>
          <Link to="/collections">
            <Button variant="gold">Browse Products</Button>
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
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        <CheckoutSteps currentStep={currentStep} steps={CHECKOUT_STEPS} />

        <div className="mt-8">
          {currentStep === 0 && (
            <CartReview
              cartItems={cartItems}
              cartTotal={cartTotal}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={removeCoupon}
              couponLoading={couponLoading}
              onNext={handleProceedFromCart}
            />
          )}

          {currentStep === 1 && (
            <ShippingStep
              selectedAddress={selectedAddress}
              onSelectAddress={setSelectedAddress}
              onBack={() => setCurrentStep(0)}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && selectedAddress && (
            <PaymentStep
              cartItems={cartItems}
              cartTotal={cartTotal}
              discountAmount={discountAmount}
              selectedAddress={selectedAddress}
              onBack={() => setCurrentStep(1)}
              onPayment={handlePayment}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 3 && completedOrder && (
            <OrderConfirmation
              orderId={completedOrder.id}
              orderTotal={completedOrder.total}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
