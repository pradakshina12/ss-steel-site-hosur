
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit } from "lucide-react";

type Product = {
  id: string;
  name: string;
  stock_quantity: number;
  unit: string;
  category: string;
};

const InventoryManagement = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStockQuantity, setNewStockQuantity] = useState("");
  const [updating, setUpdating] = useState(false);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          stock_quantity,
          unit,
          product_categories (name)
        `)
        .order('name');

      if (error) throw error;

      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        stock_quantity: product.stock_quantity,
        unit: product.unit,
        category: product.product_categories?.name || 'Uncategorized'
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Subscribe to products table changes
    const productsSubscription = supabase
      .channel('public:products')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsSubscription);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(lowercasedQuery) ||
          product.category.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  }, [searchQuery, products]);

  const openUpdateDialog = (product: Product) => {
    setSelectedProduct(product);
    setNewStockQuantity(product.stock_quantity.toString());
    setIsDialogOpen(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;

    try {
      setUpdating(true);
      
      const quantity = parseFloat(newStockQuantity);
      
      if (isNaN(quantity)) {
        toast.error('Please enter a valid number');
        return;
      }
      
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: quantity })
        .eq('id', selectedProduct.id);

      if (error) throw error;
      
      toast.success(`Stock updated for ${selectedProduct.name}`);
      setIsDialogOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setUpdating(false);
    }
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
      <h3 className="text-xl font-semibold mb-4">Inventory Management</h3>
      
      <div className="mb-4 flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className={`text-right font-semibold ${
                    product.stock_quantity < 50 ? 'text-orange-500' : 
                    product.stock_quantity < 20 ? 'text-red-500' : ''
                  }`}>
                    {product.stock_quantity}
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openUpdateDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Update Stock Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Stock Quantity</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">{selectedProduct.name}</h4>
                <p className="text-gray-500">Current Stock: {selectedProduct.stock_quantity} {selectedProduct.unit}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">New Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={newStockQuantity}
                  onChange={(e) => setNewStockQuantity(e.target.value)}
                />
              </div>
              
              <DialogFooter>
                <Button onClick={handleUpdateStock} disabled={updating}>
                  {updating ? 'Updating...' : 'Update Stock'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
