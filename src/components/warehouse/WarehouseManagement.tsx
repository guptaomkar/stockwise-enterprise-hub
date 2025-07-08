
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Package, Users } from 'lucide-react';

const warehouses = [
  {
    id: 1,
    name: 'Main Warehouse',
    location: 'New York, NY',
    capacity: '85%',
    items: 1250,
    staff: 12,
  },
  {
    id: 2,
    name: 'West Coast Hub',
    location: 'Los Angeles, CA',
    capacity: '67%',
    items: 890,
    staff: 8,
  },
  {
    id: 3,
    name: 'Distribution Center',
    location: 'Chicago, IL',
    capacity: '92%',
    items: 1580,
    staff: 15,
  },
];

export const WarehouseManagement = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                {warehouse.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {warehouse.location}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity</span>
                  <span className="font-medium">{warehouse.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: warehouse.capacity }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{warehouse.items}</p>
                    <p className="text-xs text-gray-500">Items</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{warehouse.staff}</p>
                    <p className="text-xs text-gray-500">Staff</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
