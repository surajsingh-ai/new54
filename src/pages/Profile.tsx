import { useState } from 'react';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useWishlist } from '@/hooks/useWishlist';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { orders } = useOrders();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Account</h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email || ''} disabled />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your name"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      placeholder="Enter your address"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={() => setIsEditing(false)}>Save</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order History ({orders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(order.total)}</p>
                            <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={() => navigate('/orders')}>
                        View All Orders
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No orders yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Wishlist ({wishlistItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlistItems.length > 0 ? (
                    <div className="space-y-4">
                      {wishlistItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-16 h-16 bg-muted rounded"></div>
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={() => navigate('/wishlist')}>
                        View All Wishlist Items
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No items in wishlist</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Notifications</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Email notifications for orders</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Marketing emails</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Privacy</h3>
                    <Button variant="outline" size="sm">Download My Data</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;