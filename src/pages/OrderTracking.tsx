import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderTracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const navigate = useNavigate();

  const handleTrack = () => {
    // Mock tracking data
    setOrderStatus({
      id: trackingId,
      status: 'shipped',
      estimatedDelivery: '2024-01-15',
      trackingNumber: 'TRK123456789',
      steps: [
        { status: 'confirmed', date: '2024-01-10', completed: true },
        { status: 'processing', date: '2024-01-11', completed: true },
        { status: 'shipped', date: '2024-01-12', completed: true },
        { status: 'delivered', date: '2024-01-15', completed: false }
      ]
    });
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (status === 'confirmed') return <CheckCircle className={`w-5 h-5 ${completed ? 'text-green-500' : 'text-gray-300'}`} />;
    if (status === 'processing') return <Clock className={`w-5 h-5 ${completed ? 'text-blue-500' : 'text-gray-300'}`} />;
    if (status === 'shipped') return <Truck className={`w-5 h-5 ${completed ? 'text-orange-500' : 'text-gray-300'}`} />;
    if (status === 'delivered') return <Package className={`w-5 h-5 ${completed ? 'text-green-500' : 'text-gray-300'}`} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Order ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your order ID"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <Button onClick={handleTrack} disabled={!trackingId}>
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {orderStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order #{orderStatus.id}
                  <Badge variant="secondary" className="capitalize">
                    {orderStatus.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-medium">{orderStatus.trackingNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-medium">{orderStatus.estimatedDelivery}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Order Progress</h3>
                  {orderStatus.steps.map((step: any, index: number) => (
                    <div key={step.status} className="flex items-center gap-4">
                      {getStatusIcon(step.status, step.completed)}
                      <div className="flex-1">
                        <p className={`font-medium capitalize ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                      {step.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderTracking;