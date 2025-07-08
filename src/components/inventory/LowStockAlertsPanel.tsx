
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShoppingCart, Mail } from 'lucide-react';

interface StockItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  warehouse: string;
  location: string;
}

interface LowStockAlertsPanelProps {
  items: StockItem[];
}

export const LowStockAlertsPanel: React.FC<LowStockAlertsPanelProps> = ({ items }) => {
  const handleReorder = (item: StockItem) => {
    console.log('Creating reorder for:', item.productName);
    // In a real app, this would create a purchase order or reorder request
  };

  const handleSendAlert = (item: StockItem) => {
    console.log('Sending alert for:', item.productName);
    // In a real app, this would send email/SMS notification
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-green-500" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-green-600 font-medium">All items are well stocked!</p>
            <p className="text-sm text-gray-500 mt-2">No items below minimum stock level.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          Low Stock Alerts ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-600">
                      {item.sku} • {item.warehouse} • {item.location}
                    </p>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center space-x-4">
                  <div>
                    <span className="text-sm text-gray-600">Current: </span>
                    <span className="font-medium text-red-600">{item.currentStock}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Min: </span>
                    <span className="font-medium">{item.minStock}</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {item.currentStock === 0 ? 'Out of Stock' : 'Low Stock'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleReorder(item)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Reorder
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendAlert(item)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Alert
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Automated Reorder Settings</h4>
          <p className="text-sm text-blue-700">
            Set up automatic purchase orders when stock reaches minimum levels. 
            Configure reorder points and quantities in Settings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
