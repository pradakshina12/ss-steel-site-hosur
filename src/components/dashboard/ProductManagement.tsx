
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit, Plus, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Product = {
  id: string;
  name: string;
  description: string | null;
  stock_quantity: number;
  unit: string;
  category_id: string | null;
  category_name: string | null;
  is_active: boolean;
};

type Category = {
  id: string;
  name: string;
};

const ProductManagement = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [processing, setProcessing] = useState(false);
  
  // Form state
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productUnit, setProductUnit] = useState("tons");
  const [productStock, setProductStock] = useState("0");
  const [productActive, setProductActive] = useState(true);
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load product categories');
    }
  };
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          stock_quantity,
          unit,
          category_id,
          is_active,
          product_categories (name)
        `)
        .order('name');

      if (error) throw error;

      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        stock_quantity: product.stock_quantity,
        unit: product.unit,
        category_id: product.category_id,
        category_name: product.product_categories?.name || null,
        is_active: product.is_active || false
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
          (product.category_name && product.category_name.toLowerCase().includes(lowercasedQuery)) ||
          (product.description && product.description.toLowerCase().includes(lowercasedQuery))
        )
      );
    }
  }, [searchQuery, products]);

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductCategory("");
    setProductUnit("tons");
    setProductStock("0");
    setProductActive(true);
  };

  const openAddDialog = () => {
    resetForm();
    setFormMode('add');
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductDescription(product.description || "");
    setProductCategory(product.category_id || "");
    setProductUnit(product.unit);
    setProductStock(product.stock_quantity.toString());
    setProductActive(product.is_active);
    setFormMode('edit');
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      setProcessing(true);
      
      if (!productName.trim()) {
        toast.error('Product name is required');
        return;
      }
      
      const stock = parseFloat(productStock);
      if (isNaN(stock)) {
        toast.error('Please enter a valid number for stock');
        return;
      }
      
      const productData = {
        name: productName.trim(),
        description: productDescription.trim() || null,
        category_id: productCategory || null,
        unit: productUnit,
        stock_quantity: stock,
        is_active: productActive
      };
      
      if (formMode === 'add') {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast.success('Product added successfully');
      } else if (selectedProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      }
      
      setIsDialogOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      setProcessing(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);

      if (error) throw error;
      
      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setProcessing(false);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Product Management</h3>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
      
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
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
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.category_name || 'Uncategorized'}</TableCell>
                  <TableCell className="text-right">
                    {product.stock_quantity} {product.unit}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openDeleteDialog(product)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name*</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productCategory">Category</Label>
              <Select value={productCategory} onValueChange={setProductCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Uncategorized</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productUnit">Unit</Label>
                <Select value={productUnit} onValueChange={setProductUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="sheets">Sheets</SelectItem>
                    <SelectItem value="rolls">Rolls</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productStock">Stock Quantity</Label>
                <Input
                  id="productStock"
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="productActive"
                checked={productActive}
                onChange={(e) => setProductActive(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="productActive">Product is active</Label>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} disabled={processing}>
                {processing ? 'Saving...' : (formMode === 'add' ? 'Add Product' : 'Update Product')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete the product "{selectedProduct?.name}"?</p>
            <p className="text-red-500 text-sm mt-2">This action cannot be undone.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={processing}>
              {processing ? 'Deleting...' : 'Delete Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
