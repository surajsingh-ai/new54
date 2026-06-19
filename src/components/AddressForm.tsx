import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Address, AddressInput } from '@/hooks/useAddresses';

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (address: AddressInput) => Promise<any>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddressForm = ({ address, onSubmit, onCancel, isLoading }: AddressFormProps) => {
  const [formData, setFormData] = useState<AddressInput>({
    label: 'Home',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    is_default: false
  });

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label,
        full_name: address.full_name,
        phone: address.phone,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        is_default: address.is_default
      });
    }
  }, [address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="label">Address Label</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="Home, Office, etc."
            required
          />
        </div>
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Enter full name"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter phone number"
          required
        />
      </div>

      <div>
        <Label htmlFor="address_line1">Address Line 1</Label>
        <Input
          id="address_line1"
          value={formData.address_line1}
          onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
          placeholder="House/Flat No., Building Name, Street"
          required
        />
      </div>

      <div>
        <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
        <Input
          id="address_line2"
          value={formData.address_line2}
          onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
          placeholder="Area, Landmark"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City"
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="State"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            placeholder="Pincode"
            required
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="Country"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) => setFormData({ ...formData, is_default: !!checked })}
        />
        <Label htmlFor="is_default" className="text-sm font-normal">
          Set as default address
        </Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
