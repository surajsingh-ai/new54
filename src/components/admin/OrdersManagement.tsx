import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

interface CustomerProfile {
  full_name: string | null;
  email: string | null;
}

interface AdminOrder {
  id: string;
  user_id: string;
  status: string;
  payment_status: string | null;
  total: number;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  customer?: CustomerProfile;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
];

const OrdersManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          status,
          payment_status,
          total,
          shipping_address,
          created_at,
          updated_at,
          order_items(
            id,
            quantity,
            price,
            product:products(id, name, image_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive'
        });
      } else {
        // Fetch customer profiles for all unique user_ids
        const userIds = [...new Set((data || []).map((o: any) => o.user_id))];
        let profilesMap: Record<string, CustomerProfile> = {};
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, full_name, email')
            .in('user_id', userIds);
          if (profiles) {
            profilesMap = Object.fromEntries(profiles.map(p => [p.user_id, { full_name: p.full_name, email: p.email }]));
          }
        }
        const ordersWithCustomer = (data || []).map((o: any) => ({
          ...o,
          customer: profilesMap[o.user_id] || { full_name: null, email: null }
        }));
        setOrders(ordersWithCustomer as AdminOrder[]);
      }
    } catch (error) {
      console.error('Unexpected error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update order status',
          variant: 'destructive'
        });
      } else {
        toast({ title: 'Order status updated' });
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const getStatusConfig = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} order(s)
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{order.customer?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{order.customer?.email || '—'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.order_items?.length || 0} item(s)
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                      disabled={updatingOrderId === order.id}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <Badge variant="outline" className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <status.icon className="h-4 w-4" />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={
                        order.payment_status === 'paid' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : order.payment_status === 'failed'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      }
                    >
                      {order.payment_status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Customer Details</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Name</p>
                    <p className="font-medium">{selectedOrder.customer?.full_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium">{selectedOrder.customer?.email || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="outline" className={getStatusConfig(selectedOrder.status).color}>
                    {getStatusConfig(selectedOrder.status).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment</p>
                  <Badge 
                    variant="outline" 
                    className={
                      selectedOrder.payment_status === 'paid' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    }
                  >
                    {selectedOrder.payment_status || 'pending'}
                  </Badge>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                  <p className="text-sm bg-secondary/50 p-3 rounded">{selectedOrder.shipping_address}</p>
                </div>
              )}

              {/* Order Items */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-secondary/30 p-3 rounded">
                      {item.product?.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{Number(item.price).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <p className="font-medium">Total</p>
                <p className="text-xl font-display">₹{Number(selectedOrder.total).toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
