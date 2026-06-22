import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-[#172337] text-white">
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-2xl font-bold md:text-3xl">Get Deals In Your Inbox</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                Subscribe for daily deals, new launches, category offers and delivery updates.
              </p>
            </div>
            <form className="grid gap-3 sm:grid-cols-[280px_auto]">
              <Input
                type="email"
                placeholder="Your email address"
                className="h-11 border-white/25 bg-white text-[#172337] placeholder:text-slate-500"
              />
              <Button className="h-11 bg-[#ffd814] px-6 font-semibold text-[#172337] hover:bg-[#f7ca00]">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-4 text-xl font-black">The Ridma Luxury</h4>
            <p className="mb-5 text-sm leading-6 text-white/70">
              A multi-category marketplace for electronics, fashion, home, grocery, beauty, sports, books and more.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="border border-white/25 p-2 transition hover:bg-white hover:text-[#172337]" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="border border-white/25 p-2 transition hover:bg-white hover:text-[#172337]" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="border border-white/25 p-2 transition hover:bg-white hover:text-[#172337]" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest">Shop</h5>
            <ul className="space-y-3">
              <li><Link to="/collections" className="text-sm text-white/70 hover:text-white">All Products</Link></li>
              <li><Link to="/collections?category=mobiles" className="text-sm text-white/70 hover:text-white">Mobiles</Link></li>
              <li><Link to="/collections?category=electronics" className="text-sm text-white/70 hover:text-white">Electronics</Link></li>
              <li><Link to="/collections?category=fashion" className="text-sm text-white/70 hover:text-white">Fashion</Link></li>
              <li><Link to="/collections?category=grocery" className="text-sm text-white/70 hover:text-white">Grocery</Link></li>
              <li><Link to="/collections?category=kitchen" className="text-sm text-white/70 hover:text-white">Kitchen</Link></li>
              <li><Link to="/collections?category=health" className="text-sm text-white/70 hover:text-white">Health</Link></li>
              <li><Link to="/collections?category=baby" className="text-sm text-white/70 hover:text-white">Baby Care</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest">Account</h5>
            <ul className="space-y-3">
              <li><Link to="/profile" className="text-sm text-white/70 hover:text-white">My Profile</Link></li>
              <li><Link to="/orders" className="text-sm text-white/70 hover:text-white">Your Orders</Link></li>
              <li><Link to="/wishlist" className="text-sm text-white/70 hover:text-white">Wishlist</Link></li>
              <li><Link to="/track" className="text-sm text-white/70 hover:text-white">Track Order</Link></li>
              <li><Link to="/cart" className="text-sm text-white/70 hover:text-white">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest">Customer Care</h5>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-sm text-white/70 hover:text-white">Contact Us</Link></li>
              <li><Link to="/contact" className="text-sm text-white/70 hover:text-white">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="text-sm text-white/70 hover:text-white">Payments</Link></li>
              <li><Link to="/contact" className="text-sm text-white/70 hover:text-white">FAQs</Link></li>
              <li><Link to="/terms" className="text-sm text-white/70 hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/60 md:flex-row md:px-6 lg:px-10">
          <p>&copy; 2026 The Ridma Luxury. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
