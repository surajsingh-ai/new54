import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, LogOut, Heart, Package, MapPin } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchDialog from "@/components/SearchDialog";
import CartButton from "@/components/CartButton";
import ridmaLogo from "@/assets/ridma-luxary-logo.svg";

const navLinks = [
  { href: "/collections?category=mobiles", label: "Mobiles" },
  { href: "/collections?category=electronics", label: "Electronics" },
  { href: "/collections?category=fashion", label: "Fashion" },
  { href: "/collections?category=home", label: "Home" },
  { href: "/collections?category=grocery", label: "Grocery" },
  { href: "/collections", label: "All Products" },
];

const accessoryLinks = [
  { href: "/collections?category=appliances", label: "Appliances" },
  { href: "/collections?category=beauty", label: "Beauty" },
  { href: "/collections?category=sports", label: "Sports" },
  { href: "/collections?category=toys", label: "Toys" },
  { href: "/collections?category=books", label: "Books" },
  { href: "/collections?category=kitchen", label: "Kitchen" },
  { href: "/collections?category=health", label: "Health" },
  { href: "/collections?category=baby", label: "Baby Care" },
  { href: "/collections?category=automotive", label: "Automotive" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#0d1726] bg-[#172337] text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="p-2 -ml-2 xl:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>

          <Link to="/" className="flex flex-shrink-0 items-center" aria-label="The Ridma Luxury home">
            <img
              src={ridmaLogo}
              alt="Ridma Luxary"
              className="h-14 w-14 rounded bg-white object-contain p-1 shadow-sm md:h-16 md:w-16"
            />
          </Link>

          <button className="hidden items-center gap-1 rounded px-2 py-1 text-left text-xs hover:outline hover:outline-1 hover:outline-white/50 md:flex">
            <MapPin className="h-4 w-4" />
            <span>
              Deliver to
              <strong className="block text-sm leading-4">Your location</strong>
            </span>
          </button>

          <button
            className="hidden min-w-0 flex-1 items-center overflow-hidden rounded bg-white text-left text-[#172337] shadow-sm md:flex"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search products"
          >
            <span className="bg-[#eef2f5] px-4 py-3 text-sm font-semibold">All</span>
            <span className="flex-1 truncate px-4 text-sm text-slate-500">Search for products, brands and categories</span>
            <span className="bg-[#ffd814] px-4 py-3">
              <Search className="h-5 w-5" />
            </span>
          </button>

          {/* Icons */}
          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            <button 
              className="p-2 transition-colors hover:text-[#ffd814] md:hidden" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:text-primary transition-colors hidden sm:block" aria-label="Account">
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-xs tracking-widest uppercase text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/track')}>
                    <Package className="w-4 h-4 mr-2" />
                    Track Order
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="hidden p-2 transition-colors hover:text-[#ffd814] sm:block" aria-label="Account">
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
          
          {/* Separate Cart Button */}
          <div className="ml-1">
            <CartButton />
          </div>
        </div>
      </div>

      <div className="hidden border-t border-white/10 bg-[#243447] xl:block">
        <div className="container mx-auto flex h-10 items-center gap-6 px-8 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="text-white/90 hover:text-[#ffd814]">
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white/90 outline-none hover:text-[#ffd814]">
              More categories
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {accessoryLinks.map((link) => (
                <DropdownMenuItem key={link.href} onClick={() => navigate(link.href)} className="cursor-pointer">
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {isAdmin && (
            <Link to="/admin" className="ml-auto text-[#ffd814] hover:text-white">
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-border bg-background text-foreground animate-fade-in xl:hidden">
          <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-lg tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3">
              <span className="text-lg tracking-widest uppercase text-foreground">More Categories</span>
              {accessoryLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-base tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-border">
              <CartButton />
            </div>
            {!user && (
              <Link
                to="/auth"
                className="text-lg tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            {user && (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-lg tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-lg tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
