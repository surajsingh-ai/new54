import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, Smartphone, Wallet, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, Amex, RuPay',
    icon: CreditCard
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: Smartphone
  },
  {
    id: 'wallet',
    name: 'Wallets',
    description: 'Paytm, Mobikwik, Amazon Pay',
    icon: Wallet
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: Banknote
  }
];

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createDirectOrder } = useOrders();
  const { toast } = useToast();
  
  const { product } = location.state || {};
  
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    shippingAddress: '',
    city: '',
    zipCode: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">No product selected</h1>
          <Button onClick={() => navigate('/collections')}>Browse Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const order = await createDirectOrder(product.id, 1, formData.shippingAddress);
      if (order) {
        toast({
          title: "Payment Successful!",
          description: `Order placed for ${product.name} via ${paymentMethods.find(m => m.id === selectedMethod)?.name}`,
        });
        navigate('/orders');
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                required
              />
            </div>
          </div>
        );
      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@upi"
                value={formData.upiId}
                onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your UPI ID linked with Google Pay, PhonePe, Paytm, or any UPI app
            </p>
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {['Paytm', 'Mobikwik', 'Amazon Pay'].map((wallet) => (
                <Button
                  key={wallet}
                  type="button"
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5"
                >
                  <Wallet className="w-5 h-5 mb-1" />
                  <span className="text-xs">{wallet}</span>
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              You will be redirected to your wallet to complete the payment
            </p>
          </div>
        );
      case 'netbanking':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Other'].map((bank) => (
                <Button
                  key={bank}
                  type="button"
                  variant="outline"
                  className="h-12 hover:border-primary hover:bg-primary/5"
                >
                  {bank}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              You will be redirected to your bank's website to complete the payment
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Product Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img src={imageMap[product.image_url] || product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                  <p className="text-lg font-bold text-primary mt-2">{formatCurrency(product.price)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(product.price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Select Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                          selectedMethod === method.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {selectedMethod === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {paymentMethods.find(m => m.id === selectedMethod)?.name} Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderPaymentForm()}
                  
                  <div className="pt-4 border-t space-y-4">
                    <h4 className="font-medium">Shipping Address</h4>
                    <div>
                      <Label htmlFor="shippingAddress">Address</Label>
                      <Input
                        id="shippingAddress"
                        placeholder="123 Main St"
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Mumbai"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">PIN Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="400001"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isProcessing}
                    variant="gold"
                  >
                    {isProcessing ? 'Processing...' : `Pay ${formatCurrency(product.price)}`}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    🔒 Your payment information is encrypted and secure
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
