
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Package, ShoppingCart, TruckIcon } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'stock_update',
    message: 'Stock updated for Office Paper A4',
    user: 'John Doe',
    time: '2 minutes ago',
    icon: Package,
  },
  {
    id: 2,
    type: 'order',
    message: 'New purchase order #PO-2024-001 created',
    user: 'Jane Smith',
    time: '15 minutes ago',
    icon: ShoppingCart,
  },
  {
    id: 3,
    type: 'shipment',
    message: 'Shipment #SH-2024-045 dispatched',
    user: 'Mike Johnson',
    time: '1 hour ago',
    icon: TruckIcon,
  },
  {
    id: 4,
    type: 'stock_update',
    message: 'Low stock alert for Wireless Mouse',
    user: 'System',
    time: '2 hours ago',
    icon: Package,
  },
];

export const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <activity.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">
                  by {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
