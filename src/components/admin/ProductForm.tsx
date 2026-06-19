import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Product, ProductInput } from '@/hooks/useProducts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const categories = [
  { value: 'mobiles', label: 'Mobiles' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'sports', label: 'Sports' },
  { value: 'toys', label: 'Toys' },
  { value: 'books', label: 'Books' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'health', label: 'Health' },
  { value: 'baby', label: 'Baby Care' },
  { value: 'automotive', label: 'Automotive' },
];

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: ProductInput) => Promise<void>;
  isLoading?: boolean;
}

const ProductForm = ({ open, onOpenChange, product, onSubmit, isLoading }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'electronics',
    gender: 'unisex',
    stock_quantity: 100,
    is_active: true,
    materials: '',
    care_instructions: '',
  });

  const [originalPrice, setOriginalPrice] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        image_url: product.image_url || '',
        category: product.category,
        gender: product.gender || 'unisex',
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active !== false,
        materials: product.materials || '',
        care_instructions: product.care_instructions || '',
      });
      setOriginalPrice(product.price);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category: 'electronics',
        gender: 'unisex',
        stock_quantity: 100,
        is_active: true,
        materials: '',
        care_instructions: '',
      });
      setOriginalPrice(0);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }
    
    if (formData.price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    if (formData.price > 1000000) {
      alert('Price exceeds maximum limit');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const priceChange = product ? formData.price - originalPrice : 0;
  const priceChangePercent = originalPrice > 0 ? ((priceChange / originalPrice) * 100).toFixed(1) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Price with change indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="price">Price (₹) *</Label>
              {product && priceChange !== 0 && (
                <Badge 
                  variant="outline" 
                  className={priceChange > 0 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }
                >
                  {priceChange > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {priceChange > 0 ? '+' : ''}{priceChangePercent}%
                </Badge>
              )}
            </div>
            <Input
              id="price"
              type="number"
              min="1"
              max="1000000"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
            {product && priceChange !== 0 && (
              <p className="text-xs text-muted-foreground">
                Original: ₹{originalPrice.toLocaleString('en-IN')} → New: ₹{formData.price.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Materials & Care */}
          <div className="space-y-2">
            <Label htmlFor="materials">Materials</Label>
            <Input
              id="materials"
              value={formData.materials}
              onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              placeholder="e.g., Cotton, stainless steel, plastic, leather"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="care_instructions">Care Instructions</Label>
            <Textarea
              id="care_instructions"
              value={formData.care_instructions}
              onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
              rows={2}
              placeholder="e.g., Store in dust bag, avoid direct sunlight"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="is_active">Product Status</Label>
              <p className="text-xs text-muted-foreground">
                {formData.is_active ? 'Product is visible to customers' : 'Product is hidden from customers'}
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="luxury" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
