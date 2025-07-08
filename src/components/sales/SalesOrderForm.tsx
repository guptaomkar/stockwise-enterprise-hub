
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

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

interface SalesOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  salesOrder?: SalesOrder;
  onSave: (data: Omit<SalesOrder, 'id'> | SalesOrder) => void;
}

const customers = [
  { id: 'C001', name: 'Tech Solutions Inc' },
  { id: 'C002', name: 'Global Trading LLC' },
  { id: 'C003', name: 'Office Pro Services' }
];

const products = [
  { id: '1', name: 'Office Paper A4', price: 12.99 },
  { id: '2', name: 'USB Cable Type-C', price: 8.99 },
  { id: '3', name: 'Wireless Mouse', price: 24.99 }
];

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];

export const SalesOrderForm: React.FC<SalesOrderFormProps> = ({
  isOpen,
  onClose,
  salesOrder,
  onSave
}) => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    orderDate: '',
    deliveryDate: '',
    currency: 'USD',
    status: 'Draft' as 'Draft' | 'Confirmed' | 'Reserved' | 'Dispatched' | 'Delivered' | 'Cancelled',
    items: [{ productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0, reserved: false }]
  });

  useEffect(() => {
    if (salesOrder) {
      setFormData({
        customerId: salesOrder.customerId,
        customerName: salesOrder.customerName,
        orderDate: salesOrder.orderDate,
        deliveryDate: salesOrder.deliveryDate,
        currency: salesOrder.currency,
        status: salesOrder.status,
        items: salesOrder.items
      });
    }
  }, [salesOrder]);

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || ''
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].unitPrice = product.price;
      }
    }
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0, reserved: false }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0);
    
    const orderData = {
      ...formData,
      totalAmount,
      orderNumber: salesOrder?.orderNumber || ''
    };

    if (salesOrder) {
      onSave({ ...orderData, id: salesOrder.id });
    } else {
      onSave(orderData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {salesOrder ? 'Edit Sales Order' : 'Create Sales Order'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="orderDate">Order Date</Label>
              <Input
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'Draft' | 'Confirmed' | 'Reserved' | 'Dispatched' | 'Delivered' | 'Cancelled') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Items</Label>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 p-4 border rounded">
                  <div>
                    <Label>Product</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => handleItemChange(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Total</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.total.toFixed(2)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <div className="text-lg font-semibold">
                Total: {formData.currency} {formData.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {salesOrder ? 'Update' : 'Create'} Sales Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
