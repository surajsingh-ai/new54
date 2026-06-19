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
import { Check, X, Percent, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface PricingManagementProps {
  products: Product[];
  onUpdatePrice: (productId: string, price: number) => Promise<void>;
}

const PricingManagement = ({ products, onUpdatePrice }: PricingManagementProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkPercentage, setBulkPercentage] = useState<number>(0);
  const [bulkType, setBulkType] = useState<'increase' | 'decrease'>('increase');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { toast } = useToast();

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditValue(product.price);
    setOriginalPrice(product.price);
  };

  const handleSave = async (productId: string) => {
    if (editValue <= 0) {
      toast({ 
        title: 'Invalid price', 
        description: 'Price must be greater than 0',
        variant: 'destructive' 
      });
      return;
    }
    if (editValue > 1000000) {
      toast({ 
        title: 'Invalid price', 
        description: 'Price exceeds maximum limit',
        variant: 'destructive' 
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      await onUpdatePrice(productId, editValue);
      toast({ title: 'Price updated successfully' });
      setEditingId(null);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update price',
        variant: 'destructive' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue(0);
    setOriginalPrice(0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.length === 0) {
      toast({ 
        title: 'No products selected', 
        description: 'Please select products to update',
        variant: 'destructive' 
      });
      return;
    }

    setIsUpdating(true);
    try {
      for (const productId of selectedProducts) {
        const product = products.find(p => p.id === productId);
        if (product) {
          const multiplier = bulkType === 'increase' 
            ? 1 + (bulkPercentage / 100)
            : 1 - (bulkPercentage / 100);
          const newPrice = Math.round(product.price * multiplier * 100) / 100;
          await onUpdatePrice(productId, Math.max(1, newPrice));
        }
      }
      toast({ title: 'Prices updated successfully' });
      setBulkDialogOpen(false);
      setSelectedProducts([]);
      setBulkPercentage(0);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update prices',
        variant: 'destructive' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const priceChange = editValue - originalPrice;
  const priceChangePercent = originalPrice > 0 ? ((priceChange / originalPrice) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedProducts.length > 0 && (
            <span>{selectedProducts.length} product(s) selected</span>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={() => setBulkDialogOpen(true)}
          disabled={selectedProducts.length === 0}
          className="gap-2"
        >
          <Percent className="h-4 w-4" />
          Bulk Price Update
        </Button>
      </div>

      {/* Pricing Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-center">Change</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isEditing = editingId === product.id;
              const currentPriceChange = isEditing ? editValue - product.price : 0;
              
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                    />
                  </TableCell>
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
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          min="1"
                          max="1000000"
                          step="0.01"
                          value={editValue}
                          onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                          className="w-28 text-right"
                        />
                      </div>
                    ) : (
                      <span className="font-medium">{formatCurrency(product.price)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isEditing && currentPriceChange !== 0 && (
                      <Badge 
                        variant="outline" 
                        className={currentPriceChange > 0 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }
                      >
                        {currentPriceChange > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {currentPriceChange > 0 ? '+' : ''}
                        {((currentPriceChange / product.price) * 100).toFixed(1)}%
                      </Badge>
                    )}
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
                        Edit Price
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bulk Update Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Price Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Apply a percentage change to {selectedProducts.length} selected product(s)
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label>Percentage</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={bulkPercentage}
                  onChange={(e) => setBulkPercentage(parseFloat(e.target.value) || 0)}
                  placeholder="Enter percentage"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={bulkType === 'increase' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBulkType('increase')}
                    className="gap-1"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Increase
                  </Button>
                  <Button
                    type="button"
                    variant={bulkType === 'decrease' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBulkType('decrease')}
                    className="gap-1"
                  >
                    <TrendingDown className="h-4 w-4" />
                    Decrease
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate} disabled={isUpdating || bulkPercentage <= 0}>
              {isUpdating ? 'Updating...' : 'Apply Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingManagement;
