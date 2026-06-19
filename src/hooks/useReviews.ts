import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_email?: string;
}

export const useReviews = (productId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const addReview = async (rating: number, reviewText: string) => {
    if (!user || !productId) {
      toast({
        title: "Error",
        description: "You must be logged in to leave a review",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          review_text: reviewText || null
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already reviewed",
            description: "You have already reviewed this product",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return null;
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });

      await fetchReviews();
      return data;
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
      return null;
    }
  };

  const userReview = reviews.find(r => r.user_id === user?.id);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    averageRating,
    reviewCount: reviews.length,
    userReview,
    addReview,
    refetch: fetchReviews
  };
};
