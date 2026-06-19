import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { findMarketplaceProduct } from '@/data/marketplace';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

const GUEST_CART_KEY = 'kaylaitalia_guest_cart';
const CART_UPDATED_EVENT = 'cart-updated';

const getGuestCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const notifyCartUpdated = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

const saveGuestCart = (items: CartItem[]) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  notifyCartUpdated();
};

const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
  notifyCartUpdated();
};

const getCartProduct = async (productId: string): Promise<CartItem['product'] | null> => {
  const { data: product } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .eq('id', productId)
    .maybeSingle();

  if (product) return product as CartItem['product'];

  const fallbackProduct = findMarketplaceProduct(productId);
  if (!fallbackProduct) return null;

  return {
    id: fallbackProduct.id,
    name: fallbackProduct.name,
    price: fallbackProduct.price,
    image_url: fallbackProduct.image_url || '',
  };
};

const productExistsInDatabase = async (productId: string) => {
  const { data } = await supabase
    .from('products')
    .select('id')
    .eq('id', productId)
    .maybeSingle();

  return Boolean(data);
};

const upsertGuestCartItem = async (productId: string, quantity: number) => {
  const cartProduct = await getCartProduct(productId);
  if (!cartProduct) return false;

  const guest = getGuestCart();
  const existing = guest.find((item) => item.product_id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    guest.push({
      id: `guest-${Date.now()}`,
      product_id: productId,
      quantity,
      product: cartProduct,
    });
  }

  saveGuestCart(guest);
  return true;
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setCartItems(getGuestCart());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`id, product_id, quantity, product:products(id, name, price, image_url)`)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
      setCartItems(getGuestCart());
    } else {
      setCartItems([...(data as unknown as CartItem[]), ...getGuestCart()]);
    }
    setLoading(false);
  }, [user]);

  const mergeGuestCart = useCallback(async () => {
    if (!user) return;

    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;

    const remainingGuestItems: CartItem[] = [];

    for (const item of guestItems) {
      const isDatabaseProduct = await productExistsInDatabase(item.product_id);

      if (!isDatabaseProduct) {
        remainingGuestItems.push(item);
        continue;
      }

      await supabase
        .from('cart_items')
        .upsert(
          { user_id: user.id, product_id: item.product_id, quantity: item.quantity },
          { onConflict: 'user_id,product_id' }
        )
        .select();
    }

    if (remainingGuestItems.length > 0) {
      saveGuestCart(remainingGuestItems);
    } else {
      clearGuestCart();
    }
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      const added = await upsertGuestCartItem(productId, quantity);
      if (!added) {
        toast({ title: "Error", description: "Product not found", variant: "destructive" });
      } else {
        setCartItems(getGuestCart());
        toast({ title: "Added", description: "Item added to cart" });
      }
      return added;
    }

    const isDatabaseProduct = await productExistsInDatabase(productId);

    if (!isDatabaseProduct) {
      const added = await upsertGuestCartItem(productId, quantity);
      if (!added) {
        toast({ title: "Error", description: "Product not found", variant: "destructive" });
      } else {
        await fetchCartItems();
        toast({ title: "Added", description: "Item added to cart" });
      }
      return added;
    }

    const existingItem = cartItems.find((item) => item.product_id === productId);

    if (existingItem) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) {
        toast({ title: "Error", description: error.message || "Failed to update cart", variant: "destructive" });
        return false;
      }

      toast({ title: "Updated", description: "Cart updated successfully" });
      await fetchCartItems();
      notifyCartUpdated();
      return true;
    }

    const { error } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, product_id: productId, quantity });

    if (error) {
      toast({ title: "Error", description: error.message || "Failed to add to cart", variant: "destructive" });
      return false;
    }

    toast({ title: "Added", description: "Item added to cart" });
    await fetchCartItems();
    notifyCartUpdated();
    return true;
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user || cartItemId.startsWith('guest-')) {
      const guest = getGuestCart().filter((item) => item.id !== cartItemId);
      saveGuestCart(guest);
      setCartItems(user ? cartItems.filter((item) => item.id !== cartItemId) : guest);
      return;
    }

    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
    if (error) {
      toast({ title: "Error", description: "Failed to remove item", variant: "destructive" });
    } else {
      await fetchCartItems();
      notifyCartUpdated();
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    if (!user || cartItemId.startsWith('guest-')) {
      const guest = getGuestCart();
      const item = guest.find((guestItem) => guestItem.id === cartItemId);
      if (item) item.quantity = quantity;
      saveGuestCart(guest);
      setCartItems(user ? cartItems.map((cartItem) => (cartItem.id === cartItemId ? { ...cartItem, quantity } : cartItem)) : [...guest]);
      return;
    }

    const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', cartItemId);
    if (error) {
      toast({ title: "Error", description: "Failed to update quantity", variant: "destructive" });
    } else {
      await fetchCartItems();
      notifyCartUpdated();
    }
  };

  const clearCart = async () => {
    if (!user) {
      clearGuestCart();
      setCartItems([]);
      return;
    }

    const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
    clearGuestCart();
    if (!error) setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user) {
      mergeGuestCart().then(() => fetchCartItems());
    } else {
      fetchCartItems();
    }
  }, [user, fetchCartItems, mergeGuestCart]);

  useEffect(() => {
    const handleCartUpdated = () => fetchCartItems();
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
  }, [fetchCartItems]);

  return { cartItems, loading, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, refetch: fetchCartItems };
};
