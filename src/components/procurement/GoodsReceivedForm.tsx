
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface GoodsReceivedFormProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder;
  onSave: (poId: string, grnData: any) => void;
}

export const GoodsReceivedForm: React.FC<GoodsReceivedFormProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
  onSave
}) => {
  const [formData, setFormData] = useState({
    grnNumber: `GRN-${Date.now()}`,
    receivedDate: new Date().toISOString().split('T')[0],
    receivedBy: '',
    notes: '',
    items: purchaseOrder.items.map(item => ({
      ...item,
      receivedQuantity: item.quantity,
      isReceived: true
    }))
  });

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(purchaseOrder.id, formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Goods Received Note - {purchaseOrder.poNumber}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grnNumber">GRN Number</Label>
              <Input
                value={formData.grnNumber}
                onChange={(e) => setFormData({ ...formData, grnNumber: e.target.value })}
                readOnly
              />
            </div>

            <div>
              <Label htmlFor="receivedDate">Received Date</Label>
              <Input
                type="date"
                value={formData.receivedDate}
                onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="receivedBy">Received By</Label>
              <Input
                value={formData.receivedBy}
                onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                placeholder="Enter receiver name"
              />
            </div>

            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input value={purchaseOrder.vendorName} readOnly className="bg-gray-50" />
            </div>
          </div>

          <div>
            <Label>Items Received</Label>
            <div className="space-y-4 mt-2">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 p-4 border rounded">
                  <div>
                    <Label>Product</Label>
                    <Input value={item.productName} readOnly className="bg-gray-50" />
                  </div>

                  <div>
                    <Label>Ordered</Label>
                    <Input value={item.quantity} readOnly className="bg-gray-50" />
                  </div>

                  <div>
                    <Label>Received</Label>
                    <Input
                      type="number"
                      value={item.receivedQuantity}
                      onChange={(e) => handleItemChange(index, 'receivedQuantity', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label>Unit Price</Label>
                    <Input value={`$${item.unitPrice.toFixed(2)}`} readOnly className="bg-gray-50" />
                  </div>

                  <div>
                    <Label>Total</Label>
                    <Input
                      value={`$${(item.receivedQuantity * item.unitPrice).toFixed(2)}`}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={item.isReceived}
                      onCheckedChange={(checked) => handleItemChange(index, 'isReceived', checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about the received goods..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Confirm Receipt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
