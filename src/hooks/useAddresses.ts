import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface AddressInput {
  label?: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  is_default?: boolean;
}

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addAddress = async (address: AddressInput) => {
    if (!user) return null;

    try {
      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          ...address,
          user_id: user.id,
          country: address.country || 'India'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Address added",
        description: "Your address has been saved"
      });

      await fetchAddresses();
      return data;
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAddress = async (id: string, address: Partial<AddressInput>) => {
    if (!user) return null;

    try {
      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .update(address)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Address updated",
        description: "Your address has been updated"
      });

      await fetchAddresses();
      return data;
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Address deleted",
        description: "Your address has been removed"
      });

      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  const setDefaultAddress = async (id: string) => {
    return updateAddress(id, { is_default: true });
  };

  const defaultAddress = addresses.find(a => a.is_default) || addresses[0];

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch: fetchAddresses
  };
};
