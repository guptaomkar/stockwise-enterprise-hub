
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Building, Users, FileText, Ban } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { VendorForm } from './VendorForm';
import { CustomerForm } from './CustomerForm';
import { VendorTable } from './VendorTable';
import { CustomerTable } from './CustomerTable';

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

const initialVendors: Vendor[] = [
  {
    id: 'V001',
    name: 'ABC Suppliers Ltd',
    contactPerson: 'John Smith',
    email: 'john@abcsuppliers.com',
    phone: '+1-555-0123',
    address: '123 Industrial Ave, City, State 12345',
    gstin: 'GSTIN123456789',
    paymentTerms: 'Net 30',
    status: 'Active',
    orderHistory: [
      { poNumber: 'PO-2024-001', date: '2024-01-15', amount: 15000, status: 'Completed' }
    ],
    documents: [
      { name: 'Certificate.pdf', type: 'Certificate', uploadDate: '2024-01-01' }
    ]
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'Tech Solutions Inc',
    contactPerson: 'Jane Doe',
    email: 'jane@techsolutions.com',
    phone: '+1-555-0456',
    address: '456 Business Blvd, City, State 67890',
    gstin: 'GSTIN987654321',
    creditLimit: 50000,
    paymentTerms: 'Net 15',
    status: 'Active',
    orderHistory: [
      { orderNumber: 'SO-2024-001', date: '2024-01-15', amount: 2500, status: 'Delivered' }
    ]
  }
];

export const VendorManagement = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isVendorFormOpen, setIsVendorFormOpen] = useState(false);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>();
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const canManage = user?.role === 'Administrator' || user?.role === 'Manager';

  const handleSaveVendor = (vendorData: Omit<Vendor, 'id'> | Vendor) => {
    if ('id' in vendorData) {
      setVendors(vendors.map(v => v.id === vendorData.id ? vendorData : v));
    } else {
      const newVendor: Vendor = {
        ...vendorData,
        id: `V${String(vendors.length + 1).padStart(3, '0')}`,
        orderHistory: [],
        documents: []
      };
      setVendors([...vendors, newVendor]);
    }
    setIsVendorFormOpen(false);
    setEditingVendor(undefined);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id'> | Customer) => {
    if ('id' in customerData) {
      setCustomers(customers.map(c => c.id === customerData.id ? customerData : c));
    } else {
      const newCustomer: Customer = {
        ...customerData,
        id: `C${String(customers.length + 1).padStart(3, '0')}`,
        orderHistory: []
      };
      setCustomers([...customers, newCustomer]);
    }
    setIsCustomerFormOpen(false);
    setEditingCustomer(undefined);
  };

  const handleToggleStatus = (id: string, type: 'vendor' | 'customer', newStatus: string) => {
    if (type === 'vendor') {
      setVendors(vendors.map(v => 
        v.id === id ? { ...v, status: newStatus as Vendor['status'] } : v
      ));
    } else {
      setCustomers(customers.map(c => 
        c.id === id ? { ...c, status: newStatus as Customer['status'] } : c
      ));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'Blacklisted':
        return <Badge className="bg-red-100 text-red-800">Blacklisted</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = {
    totalVendors: vendors.length,
    activeVendors: vendors.filter(v => v.status === 'Active').length,
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'Active').length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vendor & Customer Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{stats.totalVendors}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeVendors}</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {canManage && (
              <Button onClick={() => setIsVendorFormOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </Button>
            )}
          </div>

          <VendorTable
            vendors={vendors}
            searchTerm={searchTerm}
            onEdit={setEditingVendor}
            onToggleStatus={handleToggleStatus}
            getStatusBadge={getStatusBadge}
            canManage={canManage}
          />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {canManage && (
              <Button onClick={() => setIsCustomerFormOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            )}
          </div>

          <CustomerTable
            customers={customers}
            searchTerm={searchTerm}
            onEdit={setEditingCustomer}
            onToggleStatus={handleToggleStatus}
            getStatusBadge={getStatusBadge}
            canManage={canManage}
          />
        </TabsContent>
      </Tabs>

      {isVendorFormOpen && (
        <VendorForm
          isOpen={isVendorFormOpen}
          onClose={() => {
            setIsVendorFormOpen(false);
            setEditingVendor(undefined);
          }}
          vendor={editingVendor}
          onSave={handleSaveVendor}
        />
      )}

      {isCustomerFormOpen && (
        <CustomerForm
          isOpen={isCustomerFormOpen}
          onClose={() => {
            setIsCustomerFormOpen(false);
            setEditingCustomer(undefined);
          }}
          customer={editingCustomer}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
};
