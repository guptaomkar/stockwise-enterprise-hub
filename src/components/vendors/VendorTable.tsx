
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Ban, CheckCircle } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  vatNumber?: string;
  paymentTerms: string;
  status: 'Active' | 'Inactive' | 'Blacklisted';
  orderHistory: Array<{
    poNumber: string;
    date: string;
    amount: number;
    status: string;
  }>;
  documents: Array<{
    name: string;
    type: string;
    uploadDate: string;
  }>;
}

interface VendorTableProps {
  vendors: Vendor[];
  searchTerm: string;
  onEdit: (vendor: Vendor) => void;
  onToggleStatus: (id: string, type: 'vendor' | 'customer', newStatus: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  canManage: boolean;
}

export const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  searchTerm,
  onEdit,
  onToggleStatus,
  getStatusBadge,
  canManage
}) => {
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Payment Terms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">{vendor.name}</TableCell>
              <TableCell>{vendor.contactPerson}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>{vendor.phone}</TableCell>
              <TableCell>{vendor.paymentTerms}</TableCell>
              <TableCell>{getStatusBadge(vendor.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {canManage && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onEdit(vendor)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {vendor.status !== 'Blacklisted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleStatus(vendor.id, 'vendor', 'Blacklisted')}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                      {vendor.status === 'Blacklisted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleStatus(vendor.id, 'vendor', 'Active')}
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
