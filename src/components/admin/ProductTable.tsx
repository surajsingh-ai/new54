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
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string, productName: string) => void;
  onToggleStatus?: (productId: string, isActive: boolean) => void;
}

type SortField = 'name' | 'category' | 'price' | 'stock_quantity';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

const ProductTable = ({ products, onEdit, onDelete, onToggleStatus }: ProductTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'stock_quantity') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const getStockBadge = (quantity: number | null) => {
    const qty = quantity || 0;
    if (qty === 0) return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Out of Stock</Badge>;
    if (qty < 10) return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Low: {qty}</Badge>;
    return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{qty}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="w-12">ID</TableHead>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Name
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Category
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Price
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('stock_quantity')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Stock
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  #{product.id.slice(0, 6)}
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
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{getStockBadge(product.stock_quantity)}</TableCell>
                <TableCell className="text-center">
                  {onToggleStatus ? (
                    <Switch
                      checked={product.is_active !== false}
                      onCheckedChange={(checked) => onToggleStatus(product.id, checked)}
                    />
                  ) : (
                    <Badge 
                      variant="outline"
                      className={product.is_active !== false 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }
                    >
                      {product.is_active !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product.id, product.name)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paginatedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No products match your search' : 'No products found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min((safeCurrentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {safeCurrentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;
