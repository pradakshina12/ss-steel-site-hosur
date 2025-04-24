
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

type Product = {
  id: string;
  name: string;
  description: string;
  stock_quantity: number;
  unit: string;
  category_name: string;
};

type Order = {
  id: string;
  status: string;
  delivery_date: string | null;
  created_at: string;
  items: {
    id: string;
    product_name: string;
    quantity: number;
  }[];
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Request form state
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          stock_quantity,
          unit,
          product_categories (name)
        `)
        .eq('is_active', true)
        .gt('stock_quantity', 0)
        .order('name');

      if (error) throw error;

      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        stock_quantity: product.stock_quantity,
        unit: product.unit,
        category_name: product.product_categories?.name || 'Uncategorized'
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load available products');
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          delivery_date,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // For each order, fetch order items
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: orderItemsData } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              products (name)
            `)
            .eq('order_id', order.id);

          const items = orderItemsData ? orderItemsData.map((item) => ({
            id: item.id,
            product_name: item.products?.name || 'Unknown Product',
            quantity: item.quantity
          })) : [];

          return {
            ...order,
            items
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load your order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchOrders()]);
      setLoading(false);
    };
    
    loadData();
    
    // Subscribe to orders table changes
    if (user) {
      const ordersSubscription = supabase
        .channel('public:orders')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchOrders();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(ordersSubscription);
      };
    }
  }, [user]);

  const handleCreateRequest = async () => {
    if (!user) return;
    
    try {
      setSubmitting(true);
      
      if (!selectedProduct) {
        toast.error('Please select a product');
        return;
      }
      
      const quantityNum = parseFloat(quantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        toast.error('Please enter a valid quantity');
        return;
      }
      
      // Find the selected product to check stock
      const product = products.find(p => p.id === selectedProduct);
      if (!product) {
        toast.error('Selected product not found');
        return;
      }
      
      if (quantityNum > product.stock_quantity) {
        toast.warning(`The requested quantity exceeds available stock (${product.stock_quantity} ${product.unit})`);
        // Allow the request to proceed anyway
      }
      
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          notes: notes.trim() || null
        })
        .select();

      if (orderError) throw orderError;
      
      // Create the order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData[0].id,
          product_id: selectedProduct,
          quantity: quantityNum
        });

      if (itemError) throw itemError;
      
      toast.success('Your request has been submitted');
      setIsDialogOpen(false);
      resetForm();
      await fetchOrders();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedProduct("");
    setQuantity("1");
    setNotes("");
  };

  const openRequestDialog = () => {
    resetForm();
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
      <h2 className="text-2xl font-semibold mb-4">Customer Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Available Products</h3>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Your Requests</h3>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex flex-col justify-between">
          <h3 className="text-lg font-semibold">Create New Request</h3>
          <Button 
            variant="secondary" 
            className="mt-2 bg-white text-purple-700 hover:bg-gray-100"
            onClick={openRequestDialog}
          >
            Request Products
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Available Products</TabsTrigger>
          <TabsTrigger value="orders">Your Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Available Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{product.category_name}</TableCell>
                    <TableCell className="text-right">
                      {product.stock_quantity} {product.unit}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedProduct(product.id);
                        setIsDialogOpen(true);
                      }}>
                        Request
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {order.items.map((item, index) => (
                          <li key={index}>{item.product_name} ({item.quantity})</li>
                        ))}
                      </ul>
                    </TableCell>
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
                        <div className="text-gray-500 text-sm">Awaiting approval</div>
                      )}
                      {order.status === 'approved' && order.delivery_date && (
                        <div className="text-green-600 text-sm">
                          Delivery: {format(new Date(order.delivery_date), 'MMM d, yyyy')}
                        </div>
                      )}
                      {order.status === 'rejected' && (
                        <div className="text-red-500 text-sm">Your request was rejected</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Product Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Products</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productSelect">Select Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.stock_quantity} {product.unit} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {selectedProduct && (
                <p className="text-xs text-gray-500">
                  Selected product: {products.find(p => p.id === selectedProduct)?.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or notes"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRequest} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;
