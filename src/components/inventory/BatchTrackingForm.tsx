
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface StockItem {
  id: string;
  productName: string;
  sku: string;
  batches: Array<{
    batchNumber: string;
    quantity: number;
    expiryDate?: string;
    status: 'Good' | 'Expired' | 'Damaged' | 'Lost';
  }>;
}

interface BatchTrackingFormProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem: StockItem;
  onSave: (batchData: any) => void;
}

export const BatchTrackingForm: React.FC<BatchTrackingFormProps> = ({
  isOpen,
  onClose,
  stockItem,
  onSave
}) => {
  const [batches, setBatches] = useState(stockItem.batches);

  const addBatch = () => {
    setBatches([
      ...batches,
      {
        batchNumber: `B${Date.now()}`,
        quantity: 0,
        expiryDate: '',
        status: 'Good' as const
      }
    ]);
  };

  const removeBatch = (index: number) => {
    setBatches(batches.filter((_, i) => i !== index));
  };

  const updateBatch = (index: number, field: string, value: any) => {
    const newBatches = [...batches];
    newBatches[index] = { ...newBatches[index], [field]: value };
    setBatches(newBatches);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      itemId: stockItem.id,
      batches
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Batch & Lot Tracking - {stockItem.productName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium">{stockItem.productName}</h3>
            <p className="text-sm text-gray-600">{stockItem.sku}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Batches/Lots</Label>
              <Button type="button" onClick={addBatch} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Batch
              </Button>
            </div>

            <div className="space-y-4">
              {batches.map((batch, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 p-4 border rounded">
                  <div>
                    <Label>Batch Number</Label>
                    <Input
                      value={batch.batchNumber}
                      onChange={(e) => updateBatch(index, 'batchNumber', e.target.value)}
                      placeholder="Batch/Lot Number"
                    />
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={batch.quantity}
                      onChange={(e) => updateBatch(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>

                  <div>
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={batch.expiryDate || ''}
                      onChange={(e) => updateBatch(index, 'expiryDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select
                      value={batch.status}
                      onValueChange={(value) => updateBatch(index, 'status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Damaged">Damaged</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBatch(index)}
                      disabled={batches.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded">
              <p className="text-sm">
                <strong>Total Quantity:</strong> {batches.reduce((sum, batch) => sum + batch.quantity, 0)}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Batches
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
