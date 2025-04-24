
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Check, X, Calendar, AlertTriangle } from "lucide-react";

type OrderWithDetails = {
  id: string;
  user_id: string;
  status: string;
  delivery_date: string | null;
  created_at: string;
  notes: string | null;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  items: {
    id: string;
    product_id: string;
    quantity: number;
    product_name: string;
    available_stock: number;
  }[];
};

const OrderRequestsTable = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [processingOrder, setProcessingOrder] = useState(false);
  const [insufficientStock, setInsufficientStock] = useState<Record<string, boolean>>({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          status,
          delivery_date,
          created_at,
          notes
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // For each order, fetch customer profile and order items
      const ordersWithDetails: OrderWithDetails[] = await Promise.all(
        ordersData.map(async (order) => {
          // Fetch customer profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', order.user_id)
            .single();

          // Fetch user email
          const { data: userData } = await supabase
            .auth.admin.getUserById(order.user_id);

          // Fetch order items with product names
          const { data: orderItemsData } = await supabase
            .from('order_items')
            .select(`
              id,
              product_id,
              quantity,
              products (
                name,
                stock_quantity
              )
            `)
            .eq('order_id', order.id);

          const items = orderItemsData ? orderItemsData.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            product_name: item.products?.name || 'Unknown Product',
            available_stock: item.products?.stock_quantity || 0
          })) : [];

          // Check for insufficient stock
          const stockCheck: Record<string, boolean> = {};
          items.forEach(item => {
            stockCheck[item.id] = item.quantity > item.available_stock;
          });
          setInsufficientStock(prev => ({ ...prev, ...stockCheck }));

          return {
            ...order,
            customer: {
              first_name: profileData?.first_name || 'Unknown',
              last_name: profileData?.last_name || 'Unknown',
              email: userData?.user?.email || 'Unknown'
            },
            items
          };
        })
      );

      setOrders(ordersWithDetails);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Subscribe to orders table changes
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const handleOrderAction = async (action: 'approve' | 'reject') => {
    if (!selectedOrder) return;

    try {
      setProcessingOrder(true);

      if (action === 'approve') {
        // Check if delivery date is provided
        if (!deliveryDate) {
          toast.error('Please select a delivery date');
          return;
        }

        // Check if there's sufficient stock for all items
        const hasInsufficientStock = selectedOrder.items.some(
          item => item.quantity > item.available_stock
        );

        if (hasInsufficientStock) {
          // We'll still allow approval, but with a warning
          toast.warning('Some items have insufficient stock. Proceeding will result in negative stock values.');
        }

        // Update order status and delivery date
        const { error: updateOrderError } = await supabase
          .from('orders')
          .update({
            status: 'approved',
            delivery_date: deliveryDate,
            notes: selectedOrder.notes
          })
          .eq('id', selectedOrder.id);

        if (updateOrderError) throw updateOrderError;

        // Update stock for each product
        for (const item of selectedOrder.items) {
          const { error: updateStockError } = await supabase
            .from('products')
            .update({
              stock_quantity: item.available_stock - item.quantity
            })
            .eq('id', item.product_id);

          if (updateStockError) throw updateStockError;
        }

        toast.success('Order approved successfully');
      } else {
        // Reject the order
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'rejected'
          })
          .eq('id', selectedOrder.id);

        if (error) throw error;
        toast.success('Order rejected');
      }

      setIsDialogOpen(false);
      await fetchOrders();
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      toast.error(`Failed to ${action} order`);
    } finally {
      setProcessingOrder(false);
    }
  };

  const openOrderDialog = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setDeliveryDate('');
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order Requests</h3>
      
      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No order requests found.
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {order.customer.first_name} {order.customer.last_name}
                    <div className="text-xs text-gray-500">{order.customer.email}</div>
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, index) => (
                      <div key={item.id} className="flex items-center">
                        <span>{item.product_name} ({item.quantity})</span>
                        {insufficientStock[item.id] && (
                          <AlertTriangle className="h-4 w-4 ml-1 text-orange-500" />
                        )}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {order.status === 'pending' && (
                      <Button variant="outline" onClick={() => openOrderDialog(order)}>
                        Review
                      </Button>
                    )}
                    {order.status === 'approved' && order.delivery_date && (
                      <div className="text-sm">
                        Delivery: {format(new Date(order.delivery_date), 'MMM d, yyyy')}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Order</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Customer</h4>
                <p>
                  {selectedOrder.customer.first_name} {selectedOrder.customer.last_name} ({selectedOrder.customer.email})
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Items</h4>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.product_name}</span>
                      <span className="font-semibold">
                        {item.quantity}
                        {item.quantity > item.available_stock && (
                          <span className="text-orange-500 ml-2">
                            (Stock: {item.available_stock})
                            <AlertTriangle className="h-4 w-4 inline ml-1" />
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedOrder.status === 'pending' && (
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <div className="flex">
                    <Calendar className="h-4 w-4 mr-2 mt-3 text-gray-500" />
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="flex-1"
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex justify-end space-x-2">
                {selectedOrder.status === 'pending' && (
                  <>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleOrderAction('reject')}
                      disabled={processingOrder}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                    <Button 
                      onClick={() => handleOrderAction('approve')}
                      disabled={processingOrder}
                    >
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                  </>
                )}
                {selectedOrder.status !== 'pending' && (
                  <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderRequestsTable;
