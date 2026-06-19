import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import productToteBlack from '@/assets/product-tote-black.jpg';
import productCrossbodyTan from '@/assets/product-crossbody-tan.jpg';
import productSatchelTan from '@/assets/product-satchel-tan.jpg';
import productBackpackBlack from '@/assets/product-backpack-black.jpg';
import { formatCurrency } from '@/lib/utils';

const imageMap: Record<string, string> = {
  '/product-tote-black.jpg': productToteBlack,
  '/product-crossbody-tan.jpg': productCrossbodyTan,
  '/product-satchel-tan.jpg': productSatchelTan,
  '/product-backpack-black.jpg': productBackpackBlack,
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  processing: <Package className="w-5 h-5 text-blue-500" />,
  shipped: <Truck className="w-5 h-5 text-purple-500" />,
  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

const Orders = () => {
  const { orders, loading } = useOrders();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
          <Link to="/auth">
            <Button variant="gold">Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">Start shopping to place your first order</p>
            <Link to="/collections">
              <Button variant="gold">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex flex-wrap gap-4 justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">{formatCurrency(order.total)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcons[order.status] || statusIcons.pending}
                    <span className="font-medium">{statusLabels[order.status] || order.status}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Shipping:</strong> {order.shipping_address}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={imageMap[item.product.image_url] || item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
