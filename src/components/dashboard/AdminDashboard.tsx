
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderRequestsTable from "./OrderRequestsTable";
import InventoryManagement from "./InventoryManagement";
import ProductManagement from "./ProductManagement";
import { Spinner } from "../ui/spinner";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Get count of pending orders
        const { count: orderCount, error: orderError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (orderError) throw orderError;
        setPendingOrders(orderCount || 0);

        // Get count of products
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (productsError) throw productsError;
        setTotalProducts(productsCount || 0);

        // Get count of low stock products (< 50 units as an example threshold)
        const { count: lowStockCount, error: lowStockError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .lt('stock_quantity', 50);

        if (lowStockError) throw lowStockError;
        setLowStockProducts(lowStockCount || 0);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
        setLoading(false);
      }
    };

    fetchDashboardStats();
    
    // Listen for new orders
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        toast.info('New order request received!');
        setPendingOrders(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Pending Orders</h3>
          <p className="text-3xl font-bold">{pendingOrders}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Low Stock Products</h3>
          <p className="text-3xl font-bold">{lowStockProducts}</p>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Order Requests</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="products">Product Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <OrderRequestsTable />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>
        
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
