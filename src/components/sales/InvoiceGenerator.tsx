import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Printer } from 'lucide-react';

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  orderDate: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface InvoiceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  salesOrder: SalesOrder;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  isOpen,
  onClose,
  salesOrder
}) => {
  const invoiceNumber = `INV-${salesOrder.orderNumber.replace('SO-', '')}`;
  const invoiceDate = new Date().toLocaleDateString();
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 30 days from now

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, this would generate a PDF
    console.log('Downloading invoice...', invoiceNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Invoice Generator
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6 bg-white" id="invoice-content">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">INVOICE</h1>
              <p className="text-lg font-semibold">{invoiceNumber}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">Your Company Name</h2>
              <p className="text-gray-600">123 Business St</p>
              <p className="text-gray-600">City, State 12345</p>
              <p className="text-gray-600">Phone: (555) 123-4567</p>
              <p className="text-gray-600">Email: info@company.com</p>
            </div>
          </div>

          <Separator />

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
              <p className="font-medium">{salesOrder.customerName}</p>
              <p className="text-gray-600">Customer Address</p>
              <p className="text-gray-600">City, State 12345</p>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Invoice Date:</span>
                  <span>{invoiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Due Date:</span>
                  <span>{dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Order Number:</span>
                  <span>{salesOrder.orderNumber}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {salesOrder.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.productName}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">{salesOrder.currency} {item.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-2">{salesOrder.currency} {item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator />

          {/* Invoice Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{salesOrder.currency} {salesOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (10%):</span>
                <span>{salesOrder.currency} {(salesOrder.totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{salesOrder.currency} {(salesOrder.totalAmount * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Payment Terms:</h3>
            <p className="text-sm text-gray-600">Payment is due within 30 days of invoice date. Late payments may be subject to fees.</p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
