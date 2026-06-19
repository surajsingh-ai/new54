import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts, Product, ProductInput } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductForm from '@/components/admin/ProductForm';
import ProductTable from '@/components/admin/ProductTable';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import InventoryManagement from '@/components/admin/InventoryManagement';
import PricingManagement from '@/components/admin/PricingManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct, refetch } = useProducts();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<{ id: string; name: string } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setOrders(data || []);
    };
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  if (isLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: ProductInput) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        await addProduct(data);
        toast({ title: 'Success', description: 'Product added successfully' });
      }
      setIsFormOpen(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to save product', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteInfo) return;
    try {
      await deleteProduct(deleteInfo.id);
      toast({ title: 'Product deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
    } finally {
      setDeleteInfo(null);
    }
  };

  const handleToggleStatus = async (productId: string, isActive: boolean) => {
    try {
      await updateProduct(productId, { is_active: isActive });
      toast({ title: isActive ? 'Product activated' : 'Product deactivated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleUpdateStock = async (productId: string, quantity: number) => {
    await updateProduct(productId, { stock_quantity: quantity });
  };

  const handleUpdatePrice = async (productId: string, price: number) => {
    await updateProduct(productId, { price });
    await refetch();
  };

  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    products: 'Products Management',
    inventory: 'Inventory Management',
    pricing: 'Pricing Management',
    orders: 'Orders Management',
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title={tabTitles[activeTab]} />
        
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && (
            <DashboardStats products={products} orders={orders} />
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Manage your product catalog</p>
                <Button variant="luxury" onClick={handleAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={(id, name) => setDeleteInfo({ id, name })}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          )}

          {activeTab === 'inventory' && (
            <InventoryManagement products={products} onUpdateStock={handleUpdateStock} />
          )}

          {activeTab === 'pricing' && (
            <PricingManagement products={products} onUpdatePrice={handleUpdatePrice} />
          )}

          {activeTab === 'orders' && <OrdersManagement />}
        </main>
      </div>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      <AlertDialog open={!!deleteInfo} onOpenChange={(open) => !open && setDeleteInfo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteInfo?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
