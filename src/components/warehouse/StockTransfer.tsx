
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Truck, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface StockTransfer {
  id: string;
  productSku: string;
  productName: string;
  quantity: number;
  fromWarehouse: string;
  toWarehouse: string;
  fromLocation: string;
  toLocation: string;
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  notes?: string;
}

const mockTransfers: StockTransfer[] = [
  {
    id: '1',
    productSku: 'OFF-001',
    productName: 'Office Paper A4',
    quantity: 50,
    fromWarehouse: 'main-warehouse',
    toWarehouse: 'west-coast-hub',
    fromLocation: 'A1-S1-B1',
    toLocation: 'B2-S3-B5',
    status: 'pending',
    requestedBy: 'John Admin',
    requestedAt: '2024-01-15 10:30 AM',
    notes: 'Urgent transfer for West Coast operations'
  },
  {
    id: '2',
    productSku: 'ELE-045',
    productName: 'USB Cable Type-C',
    quantity: 25,
    fromWarehouse: 'distribution-center',
    toWarehouse: 'main-warehouse',
    fromLocation: 'C1-S2-B7',
    toLocation: 'A2-S1-B3',
    status: 'in-transit',
    requestedBy: 'Sarah Manager',
    requestedAt: '2024-01-14 02:15 PM',
  },
];

export const StockTransfer: React.FC = () => {
  const [transfers, setTransfers] = useState<StockTransfer[]>(mockTransfers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      productSku: '',
      quantity: '',
      fromWarehouse: '',
      toWarehouse: '',
      fromLocation: '',
      toLocation: '',
      notes: '',
    }
  });

  const warehouses = [
    { id: 'main-warehouse', name: 'Main Warehouse' },
    { id: 'west-coast-hub', name: 'West Coast Hub' },
    { id: 'distribution-center', name: 'Distribution Center' },
  ];

  const products = [
    { sku: 'OFF-001', name: 'Office Paper A4' },
    { sku: 'ELE-045', name: 'USB Cable Type-C' },
    { sku: 'ELE-023', name: 'Wireless Mouse' },
  ];

  const handleCreateTransfer = (data: any) => {
    const selectedProduct = products.find(p => p.sku === data.productSku);
    const newTransfer: StockTransfer = {
      id: Date.now().toString(),
      productSku: data.productSku,
      productName: selectedProduct?.name || '',
      quantity: parseInt(data.quantity),
      fromWarehouse: data.fromWarehouse,
      toWarehouse: data.toWarehouse,
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      status: 'pending',
      requestedBy: 'Current User',
      requestedAt: new Date().toLocaleString(),
      notes: data.notes,
    };

    setTransfers([newTransfer, ...transfers]);
    setIsAddDialogOpen(false);
    form.reset();

    toast({
      title: "Transfer Request Created",
      description: `Stock transfer for ${selectedProduct?.name} has been initiated.`,
    });
  };

  const updateTransferStatus = (transferId: string, newStatus: StockTransfer['status']) => {
    setTransfers(transfers.map(transfer => 
      transfer.id === transferId 
        ? { 
            ...transfer, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toLocaleString() : transfer.completedAt
          }
        : transfer
    ));

    toast({
      title: "Transfer Status Updated",
      description: `Transfer has been marked as ${newStatus}.`,
    });
  };

  const getStatusIcon = (status: StockTransfer['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in-transit': return <Truck className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: StockTransfer['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const getWarehouseName = (warehouseId: string) => {
    return warehouses.find(w => w.id === warehouseId)?.name || warehouseId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Stock Transfers</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Stock Transfer</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateTransfer)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="productSku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.sku} value={product.sku}>
                                {product.sku} - {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromWarehouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Warehouse</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source warehouse" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {warehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toWarehouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Warehouse</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination warehouse" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {warehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Location (Rack-Shelf-Bin)</FormLabel>
                        <FormControl>
                          <Input placeholder="A1-S1-B1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Location (Rack-Shelf-Bin)</FormLabel>
                        <FormControl>
                          <Input placeholder="B2-S3-B5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional notes about the transfer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Transfer</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {transfers.map((transfer) => (
          <Card key={transfer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(transfer.status)}
                  <span className="text-lg">{transfer.productName}</span>
                  <span className="text-sm text-gray-500">({transfer.productSku})</span>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transfer.status)}`}>
                  {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">{getWarehouseName(transfer.fromWarehouse)}</div>
                    <div className="text-xs text-gray-500">{transfer.fromLocation}</div>
                  </div>
                  <ArrowRightLeft className="w-5 h-5 text-gray-400" />
                  <div className="text-center">
                    <div className="text-sm font-medium">{getWarehouseName(transfer.toWarehouse)}</div>
                    <div className="text-xs text-gray-500">{transfer.toLocation}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{transfer.quantity}</div>
                  <div className="text-xs text-gray-500">units</div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <div>Requested by: {transfer.requestedBy}</div>
                <div>Requested at: {transfer.requestedAt}</div>
                {transfer.completedAt && <div>Completed at: {transfer.completedAt}</div>}
                {transfer.notes && <div>Notes: {transfer.notes}</div>}
              </div>

              {transfer.status !== 'completed' && transfer.status !== 'cancelled' && (
                <div className="flex space-x-2">
                  {transfer.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateTransferStatus(transfer.id, 'in-transit')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Transfer
                    </Button>
                  )}
                  {transfer.status === 'in-transit' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateTransferStatus(transfer.id, 'completed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete Transfer
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateTransferStatus(transfer.id, 'cancelled')}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
