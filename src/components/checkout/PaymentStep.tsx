import { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Address } from '@/hooks/useAddresses';
import { cn } from '@/lib/utils';

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

interface PaymentStepProps {
  cartItems: CartItem[];
  cartTotal: number;
  discountAmount: number;
  selectedAddress: Address;
  onBack: () => void;
  onPayment: (paymentMethod: string) => void;
  isProcessing: boolean;
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: CreditCard
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, etc.',
    icon: Smartphone
  },
  {
    id: 'wallet',
    name: 'Wallets',
    description: 'Paytm, Mobikwik, Amazon Pay',
    icon: Wallet
  }
];

const PaymentStep = ({
  cartItems,
  cartTotal,
  discountAmount,
  selectedAddress,
  onBack,
  onPayment,
  isProcessing
}: PaymentStepProps) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const finalTotal = cartTotal - discountAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Payment Methods */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Select Payment Method
        </h2>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={cn(
                "p-4 cursor-pointer transition-all",
                selectedMethod === method.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-primary/50"
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
                    "w-5 h-5 rounded-full border-2 transition-colors",
                    selectedMethod === method.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {selectedMethod === method.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={() => onPayment(selectedMethod)}
            disabled={isProcessing}
            className="flex-1"
            variant="gold"
          >
            {isProcessing ? 'Processing...' : `Pay ${formatCurrency(finalTotal)}`}
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-3">Delivery Address</h3>
          <div className="text-sm space-y-1">
            <p className="font-medium">{selectedAddress.full_name}</p>
            <p className="text-muted-foreground">{selectedAddress.phone}</p>
            <p>
              {selectedAddress.address_line1}
              {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
            </p>
            <p>
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentStep;
