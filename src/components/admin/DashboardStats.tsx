import { Package, PackageCheck, AlertTriangle, DollarSign, ShoppingCart, Clock } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
}

interface DashboardStatsProps {
  products: Product[];
  orders: Order[];
  lowStockThreshold?: number;
}

const DashboardStats = ({ products, orders, lowStockThreshold = 10 }: DashboardStatsProps) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active !== false).length;
  const lowStockItems = products.filter(p => (p.stock_quantity || 0) < lowStockThreshold).length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { 
      title: 'Total Products', 
      value: totalProducts, 
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      title: 'Active Products', 
      value: activeProducts, 
      icon: PackageCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      title: 'Low Stock Items', 
      value: lowStockItems, 
      icon: AlertTriangle,
      color: lowStockItems > 0 ? 'text-amber-500' : 'text-green-500',
      bgColor: lowStockItems > 0 ? 'bg-amber-500/10' : 'bg-green-500/10'
    },
    { 
      title: 'Total Revenue', 
      value: `₹${totalRevenue.toLocaleString('en-IN')}`, 
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      title: 'Pending Orders', 
      value: pendingOrders, 
      icon: Clock,
      color: pendingOrders > 0 ? 'text-orange-500' : 'text-green-500',
      bgColor: pendingOrders > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'
    },
    { 
      title: 'Total Orders', 
      value: orders.length, 
      icon: ShoppingCart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-display">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="font-display text-lg mb-4">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{Number(order.total).toLocaleString('en-IN')}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                    order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                    order.status === 'processing' ? 'bg-amber-500/10 text-amber-500' :
                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;
