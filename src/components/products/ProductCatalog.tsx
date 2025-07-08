
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Shield } from 'lucide-react';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  warehouse: string;
  location: string;
  barcode?: string;
  status: string;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Office Paper A4',
    sku: 'OFF-001',
    description: 'High quality A4 printing paper',
    category: 'office-supplies',
    price: 12.99,
    stock: 150,
    minStock: 50,
    warehouse: 'main-warehouse',
    location: 'A1-S1-B1',
    barcode: '1234567890123',
    status: 'Active',
  },
  {
    id: '2',
    name: 'USB Cable Type-C',
    sku: 'ELE-045',
    description: 'Premium Type-C charging cable',
    category: 'electronics',
    price: 8.99,
    stock: 75,
    minStock: 25,
    warehouse: 'west-coast-hub',
    location: 'B2-S3-B5',
    barcode: '2345678901234',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    sku: 'ELE-023',
    description: 'Ergonomic wireless mouse with USB receiver',
    category: 'electronics',
    price: 24.99,
    stock: 32,
    minStock: 50,
    warehouse: 'distribution-center',
    location: 'C1-S2-B7',
    barcode: '3456789012345',
    status: 'Low Stock',
  },
];

export const ProductCatalog = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const canAdd = user?.role === 'Administrator' || user?.role === 'Manager' || user?.email === 'admin@inventorypro.com';
  const canView = user?.role === 'Administrator' || user?.role === 'Manager' || user?.role === 'Staff' || user?.role === 'Auditor' || user?.email === 'admin@inventorypro.com';

  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      // Edit existing product
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        status: productData.stock <= productData.minStock ? 'Low Stock' : 'Active',
      };
      setProducts([...products, newProduct]);
    }
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  if (!canView) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Access Restricted</h2>
          <p className="text-gray-500">You don't have permission to view the product catalog.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        {canAdd && (
          <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ProductTable 
          products={products}
          searchTerm={searchTerm} 
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          canEdit={canAdd}
        />
      </div>

      {isFormOpen && (
        <ProductForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(undefined);
          }}
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      )}

      {!canAdd && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="text-center py-4">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Limited Access</h3>
              <p className="text-gray-500">You can view products but cannot add or edit them.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
