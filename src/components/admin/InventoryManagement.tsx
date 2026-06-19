import { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Save, AlertTriangle, Check, X, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryManagementProps {
  products: Product[];
  onUpdateStock: (productId: string, quantity: number) => Promise<void>;
  lowStockThreshold?: number;
}

const InventoryManagement = ({ 
  products, 
  onUpdateStock, 
  lowStockThreshold = 10 
}: InventoryManagementProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
    if (quantity < lowStockThreshold) return { label: 'Low Stock', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    if (quantity < lowStockThreshold * 2) return { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
    return { label: 'In Stock', color: 'bg-green-500/10 text-green-500 border-green-500/20' };
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditValue(product.stock_quantity || 0);
  };

  const handleSave = async (productId: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStock(productId, editValue);
      toast({ title: 'Stock updated successfully' });
      setEditingId(null);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update stock',
        variant: 'destructive' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue(0);
  };

  const lowStockProducts = products.filter(p => (p.stock_quantity || 0) < lowStockThreshold);
  const outOfStockProducts = products.filter(p => (p.stock_quantity || 0) === 0);

  return (
    <div className="space-y-6">
      {/* Inventory Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${outOfStockProducts.length > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-5 w-5 ${outOfStockProducts.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
            <div>
              <p className="font-medium">Out of Stock</p>
              <p className="text-sm text-muted-foreground">
                {outOfStockProducts.length} product{outOfStockProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${lowStockProducts.length > 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
          <div className="flex items-center gap-3">
            <Package className={`h-5 w-5 ${lowStockProducts.length > 0 ? 'text-amber-500' : 'text-green-500'}`} />
            <div>
              <p className="font-medium">Low Stock (below {lowStockThreshold})</p>
              <p className="text-sm text-muted-foreground">
                {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Stock Quantity</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const status = getStockStatus(product.stock_quantity || 0);
              const isEditing = editingId === product.id;
              
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell className="text-center">
                    {isEditing ? (
                      <Input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                        className="w-24 mx-auto text-center"
                      />
                    ) : (
                      <span className="font-medium">{product.stock_quantity || 0}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSave(product.id)}
                          disabled={isUpdating}
                          className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancel}
                          disabled={isUpdating}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        Update Stock
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryManagement;
