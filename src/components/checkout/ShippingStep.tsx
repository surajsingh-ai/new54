import { useState } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAddresses, Address, AddressInput } from '@/hooks/useAddresses';
import AddressForm from '@/components/AddressForm';
import { cn } from '@/lib/utils';

interface ShippingStepProps {
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onBack: () => void;
  onNext: () => void;
}

const ShippingStep = ({
  selectedAddress,
  onSelectAddress,
  onBack,
  onNext
}: ShippingStepProps) => {
  const { addresses, loading, addAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAddress = async (data: AddressInput) => {
    setIsSubmitting(true);
    const result = await addAddress(data);
    if (result) {
      setShowForm(false);
      onSelectAddress(result as Address);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading addresses...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Select Delivery Address
      </h2>

      {showForm ? (
        <Card className="p-6">
          <h3 className="font-medium mb-4">Add New Address</h3>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setShowForm(false)}
            isLoading={isSubmitting}
          />
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedAddress?.id === address.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                )}
                onClick={() => onSelectAddress(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{address.full_name}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        {address.label}
                      </span>
                      {address.is_default && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {address.phone}
                    </p>
                    <p className="text-sm mt-2">
                      {address.address_line1}
                      {address.address_line2 && `, ${address.address_line2}`}
                    </p>
                    <p className="text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                  </div>
                  {selectedAddress?.id === address.id && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full py-8 border-dashed"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Address
            </Button>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onBack}>
              Back to Cart
            </Button>
            <Button
              onClick={onNext}
              disabled={!selectedAddress}
              className="flex-1"
              variant="gold"
            >
              Continue to Payment
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShippingStep;
