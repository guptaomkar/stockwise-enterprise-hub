
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Ban, CheckCircle } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  vatNumber?: string;
  creditLimit: number;
  paymentTerms: string;
  status: 'Active' | 'Inactive' | 'Blacklisted';
  orderHistory: Array<{
    orderNumber: string;
    date: string;
    amount: number;
    status: string;
  }>;
}

interface CustomerTableProps {
  customers: Customer[];
  searchTerm: string;
  onEdit: (customer: Customer) => void;
  onToggleStatus: (id: string, type: 'vendor' | 'customer', newStatus: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  canManage: boolean;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  searchTerm,
  onEdit,
  onToggleStatus,
  getStatusBadge,
  canManage
}) => {
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Credit Limit</TableHead>
            <TableHead>Payment Terms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.contactPerson}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>${customer.creditLimit.toLocaleString()}</TableCell>
              <TableCell>{customer.paymentTerms}</TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {canManage && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {customer.status !== 'Blacklisted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleStatus(customer.id, 'customer', 'Blacklisted')}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                      {customer.status === 'Blacklisted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleStatus(customer.id, 'customer', 'Active')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </>
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
