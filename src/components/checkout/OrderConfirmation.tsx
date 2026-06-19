import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

interface OrderConfirmationProps {
  orderId: string;
  orderTotal: number;
}

const OrderConfirmation = ({ orderId, orderTotal }: OrderConfirmationProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h2>
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <Card className="p-6 text-left">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-medium">{orderId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-bold text-primary">{formatCurrency(orderTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <span className="text-green-600 font-medium">Paid</span>
          </div>
        </div>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Package className="w-5 h-5" />
          <span>Estimated delivery: 3-5 business days</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={() => navigate('/orders')} className="flex-1" variant="gold">
          View Orders
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button onClick={() => navigate('/collections')} variant="outline" className="flex-1">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
