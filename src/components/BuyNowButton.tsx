import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';

interface BuyNowButtonProps {
  product: Product;
  className?: string;
}

const BuyNowButton = ({ product, className }: BuyNowButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createDirectOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/payment', { state: { product } });
  };

  return (
    <Button
      variant="gold"
      size="sm"
      onClick={handleBuyNow}
      disabled={isProcessing}
      className={`gap-1.5 ${className}`}
    >
      <CreditCard className="w-4 h-4 shrink-0" />
      <span className="truncate">{isProcessing ? 'Processing...' : 'BUY'}</span>
    </Button>
  );
};

export default BuyNowButton;