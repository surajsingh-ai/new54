import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";

import productToteBlack from '@/assets/product-tote-black.jpg';
import productCrossbodyTan from '@/assets/product-crossbody-tan.jpg';
import productSatchelTan from '@/assets/product-satchel-tan.jpg';
import productBackpackBlack from '@/assets/product-backpack-black.jpg';

const imageMap: Record<string, string> = {
  '/product-tote-black.jpg': productToteBlack,
  '/product-crossbody-tan.jpg': productCrossbodyTan,
  '/product-satchel-tan.jpg': productSatchelTan,
  '/product-backpack-black.jpg': productBackpackBlack,
};
import { formatCurrency } from '@/lib/utils';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const { products } = useProducts();
  const navigate = useNavigate();

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.description?.toLowerCase().includes(query.toLowerCase())
  ) ?? [];

  const handleProductClick = (productId: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-widest uppercase">
            Search
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
        {query && (
          <div className="mt-4 max-h-64 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <div className="space-y-2">
                {filteredProducts.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    {product.image_url && (
                      <img
                        src={imageMap[product.image_url] || product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {product.category}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatCurrency(product.price)}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No products found
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
