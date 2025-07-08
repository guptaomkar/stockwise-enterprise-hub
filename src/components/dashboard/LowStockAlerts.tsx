
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const lowStockItems = [
  { id: 1, name: 'Office Paper A4', current: 5, minimum: 20, sku: 'OFF-001' },
  { id: 2, name: 'USB Cable Type-C', current: 12, minimum: 25, sku: 'ELE-045' },
  { id: 3, name: 'Wireless Mouse', current: 3, minimum: 15, sku: 'ELE-023' },
  { id: 4, name: 'Coffee Beans', current: 8, minimum: 30, sku: 'FOD-012' },
  { id: 5, name: 'Printer Ink Black', current: 2, minimum: 10, sku: 'OFF-078' },
];

export const LowStockAlerts = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
          Low Stock Alerts
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">
                  {item.current} / {item.minimum}
                </p>
                <p className="text-xs text-gray-500">Current / Min</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
