import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  DollarSign, 
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'inventory', label: 'Inventory', icon: Warehouse },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
];

const AdminSidebar = ({ activeTab, onTabChange, collapsed, onCollapsedChange }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border h-full flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo/Brand */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="font-display text-lg tracking-wider">
            SHOPVERSE
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Admin Badge */}
      <div className="p-4 border-t border-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            Admin Panel v1.0
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
