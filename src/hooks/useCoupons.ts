import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  expires_at: string | null;
  is_active: boolean;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
}

export const useCoupons = () => {
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateCoupon = async (code: string, orderTotal: number): Promise<AppliedCoupon | null> => {
    setLoading(true);
    
    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!coupon) {
        toast({
          title: "Invalid coupon",
          description: "This coupon code is not valid",
          variant: "destructive"
        });
        return null;
      }

      // Check expiry
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        toast({
          title: "Coupon expired",
          description: "This coupon has expired",
          variant: "destructive"
        });
        return null;
      }

      // Check minimum order amount
      if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
        toast({
          title: "Minimum not met",
          description: `Minimum order amount of ₹${coupon.min_order_amount} required`,
          variant: "destructive"
        });
        return null;
      }

      // Check usage limit
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        toast({
          title: "Coupon exhausted",
          description: "This coupon has reached its usage limit",
          variant: "destructive"
        });
        return null;
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (orderTotal * coupon.discount_value) / 100;
        if (coupon.max_discount) {
          discountAmount = Math.min(discountAmount, coupon.max_discount);
        }
      } else {
        discountAmount = coupon.discount_value;
      }

      discountAmount = Math.min(discountAmount, orderTotal);

      const applied: AppliedCoupon = {
        coupon: coupon as Coupon,
        discountAmount
      };

      setAppliedCoupon(applied);
      
      toast({
        title: "Coupon applied!",
        description: `You saved ₹${discountAmount.toFixed(2)}`
      });

      return applied;
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast({
        title: "Error",
        description: "Failed to validate coupon",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon removed",
      description: "Discount has been removed from your order"
    });
  };

  const calculateDiscount = (orderTotal: number): number => {
    if (!appliedCoupon) return 0;
    
    const { coupon } = appliedCoupon;
    let discountAmount = 0;
    
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderTotal * coupon.discount_value) / 100;
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    return Math.min(discountAmount, orderTotal);
  };

  return {
    appliedCoupon,
    loading,
    validateCoupon,
    removeCoupon,
    calculateDiscount
  };
};
