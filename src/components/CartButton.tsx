import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const CartButton = () => {
  const { cartCount } = useCart();

  return (
    <Link to="/cart">
      <Button
        variant="outline"
        size="icon"
        className="relative hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center rounded-full border-2 border-background">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;

