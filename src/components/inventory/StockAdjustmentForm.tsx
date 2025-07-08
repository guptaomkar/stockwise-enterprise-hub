
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface StockItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  warehouse: string;
  location: string;
}

interface StockAdjustmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem: StockItem;
  onSave: (adjustment: any) => void;
}

const adjustmentReasons = [
  'Damaged goods',
  'Lost items',
  'Expired products',
  'Theft/shrinkage',
  'Counting error',
  'Transfer adjustment',
  'Return to supplier',
  'Other'
];

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  isOpen,
  onClose,
  stockItem,
  onSave
}) => {
  const [formData, setFormData] = useState({
    adjustmentType: 'add' as 'add' | 'remove' | 'set',
    quantity: 0,
    reason: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const getNewQuantity = () => {
    switch (formData.adjustmentType) {
      case 'add':
        return stockItem.currentStock + formData.quantity;
      case 'remove':
        return Math.max(0, stockItem.currentStock - formData.quantity);
      case 'set':
        return formData.quantity;
      default:
        return stockItem.currentStock;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      itemId: stockItem.id,
      originalQuantity: stockItem.currentStock,
      newQuantity: getNewQuantity(),
      adjustmentType: formData.adjustmentType,
      quantity: formData.quantity,
      reason: formData.reason,
      notes: formData.notes,
      date: formData.date,
      adjustedBy: 'Current User' // In real app, get from auth context
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Stock Adjustment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium">{stockItem.productName}</h3>
            <p className="text-sm text-gray-600">{stockItem.sku}</p>
            <p className="text-sm text-gray-600">{stockItem.warehouse} • {stockItem.location}</p>
            <p className="font-medium mt-2">Current Stock: {stockItem.currentStock}</p>
          </div>

          <div>
            <Label htmlFor="adjustmentType">Adjustment Type</Label>
            <Select
              value={formData.adjustmentType}
              onValueChange={(value: any) => setFormData({ ...formData, adjustmentType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Stock</SelectItem>
                <SelectItem value="remove">Remove Stock</SelectItem>
                <SelectItem value="set">Set Stock Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">
              {formData.adjustmentType === 'set' ? 'New Stock Level' : 'Quantity'}
            </Label>
            <Input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm">
              <strong>New Stock Level:</strong> {getNewQuantity()}
            </p>
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => setFormData({ ...formData, reason: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {adjustmentReasons.map(reason => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this adjustment..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm Adjustment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
