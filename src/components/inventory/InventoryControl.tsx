
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, AlertTriangle, Package, BarChart3, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { StockAdjustmentForm } from './StockAdjustmentForm';
import { BatchTrackingForm } from './BatchTrackingForm';
import { LowStockAlertsPanel } from './LowStockAlertsPanel';

interface StockItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  warehouse: string;
  location: string;
  lastUpdated: string;
  batches: Array<{
    batchNumber: string;
    quantity: number;
    expiryDate?: string;
    status: 'Good' | 'Expired' | 'Damaged' | 'Lost';
  }>;
}

const initialStock: StockItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Office Paper A4',
    sku: 'OFF-001',
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    warehouse: 'main-warehouse',
    location: 'A1-S1-B1',
    lastUpdated: '2024-01-15T10:30:00Z',
    batches: [
      { batchNumber: 'B001', quantity: 100, expiryDate: '2025-12-31', status: 'Good' },
      { batchNumber: 'B002', quantity: 50, expiryDate: '2025-06-30', status: 'Good' }
    ]
  },
  {
    id: '2',
    productId: '3',
    productName: 'Wireless Mouse',
    sku: 'ELE-023',
    currentStock: 32,
    minStock: 50,
    maxStock: 200,
    warehouse: 'distribution-center',
    location: 'C1-S2-B7',
    lastUpdated: '2024-01-14T15:45:00Z',
    batches: [
      { batchNumber: 'B003', quantity: 32, status: 'Good' }
    ]
  }
];

export const InventoryControl = () => {
  const { user } = useAuth();
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStock);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [isBatchTrackingOpen, setIsBatchTrackingOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const canAdjust = user?.role === 'Administrator' || user?.role === 'Manager';

  const handleStockAdjustment = (adjustment: any) => {
    setStockItems(stockItems.map(item => 
      item.id === adjustment.itemId 
        ? { ...item, currentStock: adjustment.newQuantity, lastUpdated: new Date().toISOString() }
        : item
    ));
    setIsAdjustmentOpen(false);
    setSelectedItem(undefined);
  };

  const handleBatchUpdate = (batchData: any) => {
    setStockItems(stockItems.map(item =>
      item.id === batchData.itemId
        ? { ...item, batches: batchData.batches }
        : item
    ));
    setIsBatchTrackingOpen(false);
    setSelectedItem(undefined);
  };

  const getLowStockItems = () => stockItems.filter(item => item.currentStock <= item.minStock);
  const getExpiringItems = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return stockItems.filter(item => 
      item.batches.some(batch => 
        batch.expiryDate && new Date(batch.expiryDate) <= thirtyDaysFromNow
      )
    );
  };

  const getStockStatus = (item: StockItem) => {
    if (item.currentStock === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (item.currentStock <= item.minStock) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    if (item.currentStock >= item.maxStock) return { status: 'Overstock', color: 'bg-blue-100 text-blue-800' };
    return { status: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  const stats = {
    totalItems: stockItems.length,
    lowStock: getLowStockItems().length,
    outOfStock: stockItems.filter(item => item.currentStock === 0).length,
    expiringSoon: getExpiringItems().length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory & Stock Control</h1>
        {canAdjust && (
          <Button onClick={() => setIsAdjustmentOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Stock Adjustment
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Stock Levels</TabsTrigger>
          <TabsTrigger value="batches">Batch Tracking</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {stockItems
              .filter(item => 
                item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(item => {
                const { status, color } = getStockStatus(item);
                return (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-semibold">{item.productName}</h3>
                              <p className="text-sm text-gray-600">{item.sku} • {item.warehouse} • {item.location}</p>
                            </div>
                            <Badge className={color}>{status}</Badge>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Current Stock</p>
                              <p className="text-lg font-semibold">{item.currentStock}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Min Stock</p>
                              <p className="text-lg">{item.minStock}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Max Stock</p>
                              <p className="text-lg">{item.maxStock}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Last Updated</p>
                              <p className="text-sm">{new Date(item.lastUpdated).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsBatchTrackingOpen(true);
                            }}
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Batches
                          </Button>
                          {canAdjust && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsAdjustmentOpen(true);
                              }}
                            >
                              Adjust Stock
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <CardTitle>Batch & Lot Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockItems.map(item => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{item.productName}</h3>
                    <div className="grid gap-2">
                      {item.batches.map((batch, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div>
                            <span className="font-mono text-sm">Batch: {batch.batchNumber}</span>
                            <span className="ml-4">Qty: {batch.quantity}</span>
                            {batch.expiryDate && (
                              <span className="ml-4">Expires: {new Date(batch.expiryDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          <Badge className={
                            batch.status === 'Good' ? 'bg-green-100 text-green-800' :
                            batch.status === 'Expired' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {batch.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <LowStockAlertsPanel items={getLowStockItems()} />
        </TabsContent>

        <TabsContent value="expiry">
          <Card>
            <CardHeader>
              <CardTitle>Expiry Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getExpiringItems().map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.productName}</h3>
                      <p className="text-sm text-gray-600">{item.sku}</p>
                    </div>
                    <div className="text-right">
                      {item.batches
                        .filter(batch => batch.expiryDate && new Date(batch.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
                        .map((batch, index) => (
                          <div key={index} className="text-sm">
                            Batch {batch.batchNumber}: {new Date(batch.expiryDate!).toLocaleDateString()}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAdjustmentOpen && selectedItem && (
        <StockAdjustmentForm
          isOpen={isAdjustmentOpen}
          onClose={() => {
            setIsAdjustmentOpen(false);
            setSelectedItem(undefined);
          }}
          stockItem={selectedItem}
          onSave={handleStockAdjustment}
        />
      )}

      {isBatchTrackingOpen && selectedItem && (
        <BatchTrackingForm
          isOpen={isBatchTrackingOpen}
          onClose={() => {
            setIsBatchTrackingOpen(false);
            setSelectedItem(undefined);
          }}
          stockItem={selectedItem}
          onSave={handleBatchUpdate}
        />
      )}
    </div>
  );
};
