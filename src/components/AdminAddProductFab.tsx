import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts, ProductInput } from '@/hooks/useProducts';
import ProductForm from '@/components/admin/ProductForm';
import { toast } from 'sonner';

const AdminAddProductFab = () => {
  const { isAdmin } = useAuth();
  const { addProduct } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdmin) return null;

  const handleSubmit = async (data: ProductInput) => {
    setIsSubmitting(true);
    try {
      await addProduct(data);
      toast.success('Product added successfully');
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="luxury"
        size="lg"
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 shadow-lg"
        title="Add new product"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <ProductForm
        open={isOpen}
        onOpenChange={setIsOpen}
        product={null}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default AdminAddProductFab;
