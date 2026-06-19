import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCart } from './useCart';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image_url: string;
  };
}

export interface Order {
  id: string;
  status: string;
  total: number;
  shipping_address: string;
  created_at: string;
  order_items: OrderItem[];
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { cartItems, clearCart, cartTotal } = useCart();

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total,
          shipping_address,
          created_at,
          order_items(
            id,
            quantity,
            price,
            product:products(id, name, image_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders. Please refresh the page.",
          variant: "destructive"
        });
        setOrders([]);
      } else {
        console.log('Fetched orders:', data?.length || 0);
        setOrders(data as unknown as Order[]);
      }
    } catch (error) {
      console.error('Unexpected error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (shippingAddress: string) => {
    if (!user || cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive"
      });
      return null;
    }

    let orderData: any = null; // Track if order was created for cleanup

    try {
      // Ensure total is a number
      const orderTotal = Number(cartTotal);
      if (isNaN(orderTotal) || orderTotal <= 0) {
        toast({
          title: "Error",
          description: "Invalid order total. Please refresh and try again.",
          variant: "destructive"
        });
        return null;
      }

      // Validate all cart items BEFORE creating the order
      // This prevents creating orphaned orders if validation fails
      const orderItems = cartItems.map(item => {
        const itemPrice = Number(item.product.price);
        if (isNaN(itemPrice) || itemPrice <= 0) {
          throw new Error(`Invalid price for product: ${item.product.name}`);
        }
        if (!item.product_id) {
          throw new Error(`Missing product ID for: ${item.product.name}`);
        }
        if (!item.quantity || item.quantity <= 0) {
          throw new Error(`Invalid quantity for product: ${item.product.name}`);
        }
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price: itemPrice
        };
      });

      console.log('Creating order with:', {
        user_id: user.id,
        total: orderTotal,
        shipping_address: shippingAddress,
        cartItemsCount: cartItems.length
      });

      // Create order (only after validation passes)
      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: orderTotal,
          shipping_address: shippingAddress,
          status: 'pending'
        })
        .select()
        .single();
      if (orderError) {
        console.error('Order creation error:', orderError);
        toast({ 
          title: "Error", 
          description: orderError.message || "Failed to create order", 
          variant: "destructive" 
        });
        return null;
      }

      if (!createdOrder) {
        console.error('No order data returned');
        toast({ 
          title: "Error", 
          description: "Order was not created. Please try again.", 
          variant: "destructive" 
        });
        return null;
      }

      // Track that order was created (for cleanup if needed)
      orderData = createdOrder; // Assign to outer scope variable
      const createdOrderId = createdOrder.id;

      // Add order_id to each item now that we have the order
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: createdOrder.id
      }));

      console.log('Creating order items:', orderItemsWithOrderId.length);
      console.log('Order items data:', orderItemsWithOrderId);

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId)
        .select();

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        console.error('Error details:', {
          message: itemsError.message,
          details: itemsError.details,
          hint: itemsError.hint,
          code: itemsError.code
        });
        // Clean up: delete the order if items failed
        try {
          await supabase.from('orders').delete().eq('id', createdOrderId);
          console.log('Cleaned up orphaned order:', createdOrderId);
        } catch (cleanupError) {
          console.error('Failed to cleanup order:', cleanupError);
        }
        toast({ 
          title: "Error", 
          description: itemsError.message || "Failed to add order items. Check console for details.", 
          variant: "destructive" 
        });
        return null;
      }

      if (!itemsData || itemsData.length === 0) {
        console.error('No order items data returned from insert');
        // Clean up: delete the order if no items were created
        try {
          await supabase.from('orders').delete().eq('id', createdOrderId);
          console.log('Cleaned up order - no items were created:', createdOrderId);
        } catch (cleanupError) {
          console.error('Failed to cleanup order:', cleanupError);
        }
        toast({ 
          title: "Error", 
          description: "Order items were not created. Please try again.", 
          variant: "destructive" 
        });
        return null;
      }

      console.log('Order created successfully:', createdOrder.id);
      console.log('Order items created:', itemsData?.length || 0);

      // Clear cart after successful order
      await clearCart();
      
      toast({ 
        title: "Order placed!", 
        description: "Your order has been placed successfully" 
      });
      
      // Refresh orders list
      await fetchOrders();
      
      return createdOrder;
    } catch (error) {
      console.error('Unexpected error creating order:', error);
      
      // Cleanup: If order was created but an unexpected error occurred,
      // try to delete it to prevent orphaned orders
      if (orderData?.id) {
        try {
          await supabase.from('orders').delete().eq('id', orderData.id);
          console.log('Cleaned up orphaned order due to unexpected error:', orderData.id);
        } catch (cleanupError) {
          console.error('Failed to cleanup order after unexpected error:', cleanupError);
        }
      }
      
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "An unexpected error occurred", 
        variant: "destructive" 
      });
      return null;
    }
  };

  const createDirectOrder = async (productId: string, quantity: number = 1, shippingAddress: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to place an order",
        variant: "destructive"
      });
      return null;
    }

    try {
      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('id', productId)
        .single();

      if (productError || !product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive"
        });
        return null;
      }

      const orderTotal = Number(product.price) * quantity;
      
      // Create order
      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: orderTotal,
          shipping_address: shippingAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError || !createdOrder) {
        toast({
          title: "Error",
          description: "Failed to create order",
          variant: "destructive"
        });
        return null;
      }

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: createdOrder.id,
          product_id: productId,
          quantity: quantity,
          price: Number(product.price)
        });

      if (itemError) {
        // Clean up order if item creation fails
        await supabase.from('orders').delete().eq('id', createdOrder.id);
        toast({
          title: "Error",
          description: "Failed to create order item",
          variant: "destructive"
        });
        return null;
      }

      await fetchOrders();
      return createdOrder;
    } catch (error) {
      console.error('Error creating direct order:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    createOrder,
    createDirectOrder,
    refetch: fetchOrders
  };
};
