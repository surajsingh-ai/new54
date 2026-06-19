import { useState } from 'react';
import { Heart, ShoppingCart, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Product, ProductInput } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import BuyNowButton from '@/components/BuyNowButton';
import ProductForm from '@/components/admin/ProductForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
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

import productToteBlack from '@/assets/product-tote-black.jpg';
import productCrossbodyTan from '@/assets/product-crossbody-tan.jpg';
import productSatchelTan from '@/assets/product-satchel-tan.jpg';
import productBackpackBlack from '@/assets/product-backpack-black.jpg';
import walletBlack from '@/assets/wallet-black.jpg';
import walletBrown1 from '@/assets/wallet-brown-1.jpg';
import walletBrown2 from '@/assets/wallet-brown-2.jpg';
import walletMonogram1 from '@/assets/wallet-monogram-1.jpg';
import walletMonogram2 from '@/assets/wallet-monogram-2.jpg';
import walletMonogram3 from '@/assets/wallet-monogram-3.jpg';
import beltBrown1 from '@/assets/belt-brown-1.jpg';
import beltMonogram1 from '@/assets/belt-monogram-1.jpg';
import beltMonogram2 from '@/assets/belt-monogram-2.jpg';
import { formatCurrency } from '@/lib/utils';

const imageMap: Record<string, string> = {
  '/product-tote-black.jpg': productToteBlack,
  '/product-crossbody-tan.jpg': productCrossbodyTan,
  '/product-satchel-tan.jpg': productSatchelTan,
  '/product-backpack-black.jpg': productBackpackBlack,
  '/wallet-black.jpg': walletBlack,
  '/wallet-brown-1.jpg': walletBrown1,
  '/wallet-brown-2.jpg': walletBrown2,
  '/wallet-monogram-1.jpg': walletMonogram1,
  '/wallet-monogram-2.jpg': walletMonogram2,
  '/wallet-monogram-3.jpg': walletMonogram3,
  '/belt-brown-1.jpg': beltBrown1,
  '/belt-monogram-1.jpg': beltMonogram1,
  '/belt-monogram-2.jpg': beltMonogram2,
};

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAdmin } = useAuth();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUrl = imageMap[product.image_url] || product.image_url;
  const liked = isInWishlist(product.id);

  const handleEditSubmit = async (data: ProductInput) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', product.id);
      if (error) throw error;
      toast.success('Product updated successfully');
      setIsEditOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);
      if (error) throw error;
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {/* Wishlist button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
          />
        </button>

        {/* Admin edit & delete buttons */}
        {isAdmin && (
          <div className="absolute top-4 left-4 flex gap-1">
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-2 bg-primary/90 backdrop-blur-sm rounded-full hover:bg-primary transition-colors"
              title="Edit product"
            >
              <Pencil className="w-4 h-4 text-primary-foreground" />
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="p-2 bg-destructive/90 backdrop-blur-sm rounded-full hover:bg-destructive transition-colors"
              title="Delete product"
            >
              <Trash2 className="w-4 h-4 text-destructive-foreground" />
            </button>
          </div>
        )}

        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-foreground mb-1 hover:text-primary cursor-pointer">{product.name}</h3>
          </Link>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="space-y-3">
            <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCart(product.id)}
                className="gap-1.5 flex-1 min-w-0"
              >
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span className="truncate">Add to Cart</span>
              </Button>
              <BuyNowButton product={product} className="flex-1 min-w-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      {isAdmin && (
        <>
          <ProductForm
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            product={product}
            onSubmit={handleEditSubmit}
            isLoading={isSubmitting}
          />

          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
};

export default ProductCard;
