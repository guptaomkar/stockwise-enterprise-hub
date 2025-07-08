
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Eye, CheckCircle, Package } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  totalAmount: number;
  orderDate: string;
  expectedDelivery: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  searchTerm: string;
  onEdit: (po: PurchaseOrder) => void;
  onApprove: (poId: string) => void;
  onReceive: (po: PurchaseOrder) => void;
  canApprove: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
}

export const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  purchaseOrders,
  searchTerm,
  onEdit,
  onApprove,
  onReceive,
  canApprove,
  getStatusBadge
}) => {
  const filteredPOs = purchaseOrders.filter(po =>
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PO Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Expected Delivery</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPOs.map((po) => (
            <TableRow key={po.id}>
              <TableCell className="font-mono">{po.poNumber}</TableCell>
              <TableCell>{po.vendorName}</TableCell>
              <TableCell>{new Date(po.orderDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(po.expectedDelivery).toLocaleDateString()}</TableCell>
              <TableCell>${po.totalAmount.toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(po.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(po)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  {canApprove && po.status === 'Pending' && (
                    <Button
                      size="sm"
                      onClick={() => onApprove(po.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  {po.status === 'Approved' && (
                    <Button
                      size="sm"
                      onClick={() => onReceive(po)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
