import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
  };
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('liked_items')
      .select(`
        id,
        product_id,
        product:products(id, name, price, image_url, description)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
    } else {
      setWishlistItems(data as unknown as WishlistItem[]);
    }
    setLoading(false);
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive"
      });
      return;
    }

    const existingItem = wishlistItems.find(item => item.product_id === productId);

    if (existingItem) {
      const { error } = await supabase
        .from('liked_items')
        .delete()
        .eq('id', existingItem.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update wishlist", variant: "destructive" });
      } else {
        toast({ title: "Removed", description: "Item removed from wishlist" });
        fetchWishlist();
      }
    } else {
      const { error } = await supabase
        .from('liked_items')
        .insert({ user_id: user.id, product_id: productId });

      if (error) {
        toast({ title: "Error", description: "Failed to add to wishlist", variant: "destructive" });
      } else {
        toast({ title: "Added", description: "Item added to wishlist" });
        fetchWishlist();
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return {
    wishlistItems,
    loading,
    toggleWishlist,
    isInWishlist,
    refetch: fetchWishlist
  };
};
