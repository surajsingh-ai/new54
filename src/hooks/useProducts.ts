import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { marketplaceProducts } from '@/data/marketplace';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  gender: string;
  stock_quantity: number | null;
  is_active: boolean | null;
  materials: string | null;
  care_instructions: string | null;
  specifications: any | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category: string;
  gender?: string;
  stock_quantity?: number;
  is_active?: boolean;
  materials?: string;
  care_instructions?: string;
}

export const useProducts = (category?: string, gender?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getFallbackProducts = useCallback(() => {
    return marketplaceProducts.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesGender = gender ? product.gender === gender : true;
      return matchesCategory && matchesGender;
    });
  }, [category, gender]);

  const fetchProducts = useCallback(async () => {
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (gender) {
        query = query.eq('gender', gender);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        setProducts(getFallbackProducts());
      } else {
        console.log('Fetched products:', data?.length || 0);
        const fetchedProducts = (data || []) as Product[];
        const fallbackProducts = getFallbackProducts();
        const fallbackIds = new Set(fallbackProducts.map((product) => product.id));
        const mergedProducts = [
          ...fallbackProducts,
          ...fetchedProducts.filter((product) => !fallbackIds.has(product.id)),
        ];
        setProducts(mergedProducts);
      }
    } catch (error) {
      console.error('Unexpected error fetching products:', error);
      setProducts(getFallbackProducts());
    } finally {
      setLoading(false);
    }
  }, [category, gender, getFallbackProducts]);

  const addProduct = async (product: ProductInput) => {
    try {
      // Ensure price is a number
      const productData = {
        ...product,
        price: Number(product.price),
        description: product.description || null,
        image_url: product.image_url || null,
      };

      console.log('Adding product to Supabase:', productData);

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }

      console.log('Product added successfully:', data);
      
      // Refresh the products list
      await fetchProducts();
      
      return data;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<ProductInput>) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    await fetchProducts();
    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();

    const channelName = `products-changes-${crypto.randomUUID()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts, addProduct, updateProduct, deleteProduct };
};
