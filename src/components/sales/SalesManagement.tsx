
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Truck, FileText, DollarSign, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SalesOrderForm } from './SalesOrderForm';
import { SalesOrderTable } from './SalesOrderTable';
import { InvoiceGenerator } from './InvoiceGenerator';

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: 'Draft' | 'Confirmed' | 'Reserved' | 'Dispatched' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  currency: string;
  orderDate: string;
  deliveryDate: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    reserved: boolean;
  }>;
}

const initialOrders: SalesOrder[] = [
  {
    id: '1',
    orderNumber: 'SO-2024-001',
    customerId: 'C001',
    customerName: 'Tech Solutions Inc',
    status: 'Confirmed',
    totalAmount: 2500,
    currency: 'USD',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    items: [
      { productId: '1', productName: 'Office Paper A4', quantity: 50, unitPrice: 12.99, total: 649.50, reserved: false },
      { productId: '2', productName: 'USB Cable Type-C', quantity: 25, unitPrice: 8.99, total: 224.75, reserved: false }
    ]
  }
];

export const SalesManagement = () => {
  const { user } = useAuth();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialOrders);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | undefined>();
  const [showInvoice, setShowInvoice] = useState(false);

  const canCreate = user?.role === 'Administrator' || user?.role === 'Manager' || user?.role === 'Staff';

  const handleSaveOrder = (orderData: Omit<SalesOrder, 'id'> | SalesOrder) => {
    if ('id' in orderData) {
      setSalesOrders(salesOrders.map(order => order.id === orderData.id ? orderData : order));
    } else {
      const newOrder: SalesOrder = {
        ...orderData,
        id: Date.now().toString(),
        orderNumber: `SO-${new Date().getFullYear()}-${String(salesOrders.length + 1).padStart(3, '0')}`
      };
      setSalesOrders([...salesOrders, newOrder]);
    }
    setIsFormOpen(false);
    setEditingOrder(undefined);
  };

  const handleReserveStock = (orderId: string) => {
    setSalesOrders(salesOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Reserved' as const,
          items: order.items.map(item => ({ ...item, reserved: true }))
        };
      }
      return order;
    }));
  };

  const handleDispatch = (orderId: string) => {
    setSalesOrders(salesOrders.map(order =>
      order.id === orderId ? { ...order, status: 'Dispatched' as const } : order
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Draft': { color: 'bg-gray-100 text-gray-800', icon: FileText },
      'Confirmed': { color: 'bg-blue-100 text-blue-800', icon: FileText },
      'Reserved': { color: 'bg-yellow-100 text-yellow-800', icon: Package },
      'Dispatched': { color: 'bg-purple-100 text-purple-800', icon: Truck },
      'Delivered': { color: 'bg-green-100 text-green-800', icon: Package },
      'Cancelled': { color: 'bg-red-100 text-red-800', icon: FileText }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || FileText;
    
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const stats = {
    totalOrders: salesOrders.length,
    confirmed: salesOrders.filter(order => order.status === 'Confirmed').length,
    dispatched: salesOrders.filter(order => order.status === 'Dispatched').length,
    totalRevenue: salesOrders.filter(order => order.status !== 'Cancelled').reduce((sum, order) => sum + order.totalAmount, 0)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales & Dispatch</h1>
        {canCreate && (
          <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Sales Order
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dispatched</p>
                <p className="text-2xl font-bold text-purple-600">{stats.dispatched}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Sales Orders</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch Management</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search sales orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <SalesOrderTable
            salesOrders={salesOrders}
            searchTerm={searchTerm}
            onEdit={setEditingOrder}
            onReserve={handleReserveStock}
            onDispatch={handleDispatch}
            onGenerateInvoice={(order) => {
              setSelectedOrder(order);
              setShowInvoice(true);
            }}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="dispatch">
          <Card>
            <CardHeader>
              <CardTitle>Dispatch Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesOrders.filter(order => ['Reserved', 'Dispatched'].includes(order.status)).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-sm">Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(order.status)}
                      {order.status === 'Reserved' && (
                        <Button
                          size="sm"
                          onClick={() => handleDispatch(order.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Dispatch
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Invoice management interface will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Sales reports and analytics will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isFormOpen && (
        <SalesOrderForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingOrder(undefined);
          }}
          salesOrder={editingOrder}
          onSave={handleSaveOrder}
        />
      )}

      {showInvoice && selectedOrder && (
        <InvoiceGenerator
          isOpen={showInvoice}
          onClose={() => {
            setShowInvoice(false);
            setSelectedOrder(undefined);
          }}
          salesOrder={selectedOrder}
        />
      )}
    </div>
  );
};
