
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Eye, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { PurchaseOrderTable } from './PurchaseOrderTable';
import { GoodsReceivedForm } from './GoodsReceivedForm';

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

const initialPOs: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    vendorId: 'V001',
    vendorName: 'ABC Suppliers Ltd',
    status: 'Pending',
    totalAmount: 15000,
    orderDate: '2024-01-15',
    expectedDelivery: '2024-01-22',
    items: [
      { productId: '1', productName: 'Office Paper A4', quantity: 100, unitPrice: 12.99, total: 1299 },
      { productId: '2', productName: 'USB Cable Type-C', quantity: 50, unitPrice: 8.99, total: 449.50 }
    ]
  }
];

export const ProcurementManagement = () => {
  const { user } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPOs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGRNOpen, setIsGRNOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | undefined>();

  const canCreate = user?.role === 'Administrator' || user?.role === 'Manager';
  const canApprove = user?.role === 'Administrator' || user?.role === 'Manager';

  const handleSavePO = (poData: Omit<PurchaseOrder, 'id'> | PurchaseOrder) => {
    if ('id' in poData) {
      setPurchaseOrders(purchaseOrders.map(po => po.id === poData.id ? poData : po));
    } else {
      const newPO: PurchaseOrder = {
        ...poData,
        id: Date.now().toString(),
        poNumber: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`
      };
      setPurchaseOrders([...purchaseOrders, newPO]);
    }
    setIsFormOpen(false);
    setEditingPO(undefined);
  };

  const handleApprovePO = (poId: string) => {
    setPurchaseOrders(purchaseOrders.map(po =>
      po.id === poId ? { ...po, status: 'Approved' as const } : po
    ));
  };

  const handleReceiveGoods = (poId: string, grnData: any) => {
    setPurchaseOrders(purchaseOrders.map(po =>
      po.id === poId ? { ...po, status: 'Received' as const } : po
    ));
    setIsGRNOpen(false);
    setSelectedPO(undefined);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Draft': { color: 'bg-gray-100 text-gray-800', icon: FileText },
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Approved': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      'Received': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || FileText;
    
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const stats = {
    totalPOs: purchaseOrders.length,
    pendingApproval: purchaseOrders.filter(po => po.status === 'Pending').length,
    approved: purchaseOrders.filter(po => po.status === 'Approved').length,
    received: purchaseOrders.filter(po => po.status === 'Received').length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Procurement Management</h1>
        {canCreate && (
          <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Purchase Order
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total POs</p>
                <p className="text-2xl font-bold">{stats.totalPOs}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-blue-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Received</p>
                <p className="text-2xl font-bold text-green-600">{stats.received}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="grn">Goods Received</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search purchase orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <PurchaseOrderTable
            purchaseOrders={purchaseOrders}
            searchTerm={searchTerm}
            onEdit={setEditingPO}
            onApprove={handleApprovePO}
            onReceive={(po) => {
              setSelectedPO(po);
              setIsGRNOpen(true);
            }}
            canApprove={canApprove}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="grn">
          <Card>
            <CardHeader>
              <CardTitle>Goods Received Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">GRN management interface will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.filter(po => po.status === 'Pending').map(po => (
                  <div key={po.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{po.poNumber}</h3>
                      <p className="text-sm text-gray-600">{po.vendorName}</p>
                      <p className="text-sm font-medium">${po.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprovePO(po.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isFormOpen && (
        <PurchaseOrderForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPO(undefined);
          }}
          purchaseOrder={editingPO}
          onSave={handleSavePO}
        />
      )}

      {isGRNOpen && selectedPO && (
        <GoodsReceivedForm
          isOpen={isGRNOpen}
          onClose={() => {
            setIsGRNOpen(false);
            setSelectedPO(undefined);
          }}
          purchaseOrder={selectedPO}
          onSave={handleReceiveGoods}
        />
      )}
    </div>
  );
};
