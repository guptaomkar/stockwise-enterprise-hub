
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Package, Truck, FileText } from 'lucide-react';

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

interface SalesOrderTableProps {
  salesOrders: SalesOrder[];
  searchTerm: string;
  onEdit: (order: SalesOrder) => void;
  onReserve: (orderId: string) => void;
  onDispatch: (orderId: string) => void;
  onGenerateInvoice: (order: SalesOrder) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

export const SalesOrderTable: React.FC<SalesOrderTableProps> = ({
  salesOrders,
  searchTerm,
  onEdit,
  onReserve,
  onDispatch,
  onGenerateInvoice,
  getStatusBadge
}) => {
  const filteredOrders = salesOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono">{order.orderNumber}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
              <TableCell>{order.currency} {order.totalAmount.toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(order)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  {order.status === 'Confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => onReserve(order.id)}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                  )}
                  {order.status === 'Reserved' && (
                    <Button
                      size="sm"
                      onClick={() => onDispatch(order.id)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Truck className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGenerateInvoice(order)}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
