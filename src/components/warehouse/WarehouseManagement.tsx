import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, MapPin, Package, Users, Plus, Edit, Trash2, Shield, Navigation, ArrowRightLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { LocationManagement } from './LocationManagement';
import { StockTransfer } from './StockTransfer';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  capacity: string;
  items: number;
  staff: number;
  manager: string;
  phone: string;
  email: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const initialWarehouses: Warehouse[] = [
  {
    id: 'main-warehouse',
    name: 'Main Warehouse',
    location: 'New York, NY',
    address: '123 Industrial Ave, New York, NY 10001',
    capacity: '85%',
    items: 1250,
    staff: 12,
    manager: 'John Smith',
    phone: '+1-555-0101',
    email: 'main@inventorypro.com',
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  },
  {
    id: 'west-coast-hub',
    name: 'West Coast Hub',
    location: 'Los Angeles, CA',
    address: '456 Warehouse Blvd, Los Angeles, CA 90001',
    capacity: '67%',
    items: 890,
    staff: 8,
    manager: 'Sarah Johnson',
    phone: '+1-555-0102',
    email: 'west@inventorypro.com',
    coordinates: { latitude: 34.0522, longitude: -118.2437 }
  },
  {
    id: 'distribution-center',
    name: 'Distribution Center',
    location: 'Chicago, IL',
    address: '789 Logistics Way, Chicago, IL 60601',
    capacity: '92%',
    items: 1580,
    staff: 15,
    manager: 'Mike Wilson',
    phone: '+1-555-0103',
    email: 'chicago@inventorypro.com',
    coordinates: { latitude: 41.8781, longitude: -87.6298 }
  },
];

export const WarehouseManagement = () => {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  
  const form = useForm({
    defaultValues: {
      name: '',
      location: '',
      address: '',
      manager: '',
      phone: '',
      email: '',
      latitude: '',
      longitude: '',
    }
  });

  const isAdmin = user?.role === 'Administrator' || user?.email === 'admin@inventorypro.com';
  const canManage = isAdmin || user?.role === 'Manager';

  const handleAddWarehouse = (data: any) => {
    const newWarehouse: Warehouse = {
      id: `warehouse-${Date.now()}`,
      ...data,
      capacity: '0%',
      items: 0,
      staff: 0,
      coordinates: data.latitude && data.longitude ? {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude)
      } : undefined,
    };
    setWarehouses([...warehouses, newWarehouse]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    form.reset({
      name: warehouse.name,
      location: warehouse.location,
      address: warehouse.address,
      manager: warehouse.manager,
      phone: warehouse.phone,
      email: warehouse.email,
      latitude: warehouse.coordinates?.latitude?.toString() || '',
      longitude: warehouse.coordinates?.longitude?.toString() || '',
    });
  };

  const handleUpdateWarehouse = (data: any) => {
    if (editingWarehouse) {
      const updatedWarehouses = warehouses.map(w => 
        w.id === editingWarehouse.id ? { 
          ...w, 
          ...data,
          coordinates: data.latitude && data.longitude ? {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude)
          } : w.coordinates,
        } : w
      );
      setWarehouses(updatedWarehouses);
      setEditingWarehouse(null);
      form.reset();
    }
  };

  const handleDeleteWarehouse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      setWarehouses(warehouses.filter(w => w.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
        {isAdmin && (
          <Dialog open={isAddDialogOpen || !!editingWarehouse} onOpenChange={(open) => {
            if (!open) {
              setIsAddDialogOpen(false);
              setEditingWarehouse(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(editingWarehouse ? handleUpdateWarehouse : handleAddWarehouse)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warehouse Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Main Warehouse" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City, State</FormLabel>
                          <FormControl>
                            <Input placeholder="New York, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Warehouse Street, City, State 12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input type="number" step="any" placeholder="40.7128" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input type="number" step="any" placeholder="-74.0060" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="manager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manager Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1-555-0123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="warehouse@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingWarehouse(null);
                      form.reset();
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingWarehouse ? 'Update' : 'Add'} Warehouse
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Location Management</TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                      {warehouse.name}
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditWarehouse(warehouse)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteWarehouse(warehouse.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {warehouse.location}
                  </div>
                  
                  {warehouse.coordinates && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Navigation className="w-4 h-4 mr-2" />
                      <span className="text-xs">
                        {warehouse.coordinates.latitude}, {warehouse.coordinates.longitude}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Address:</p>
                    <p>{warehouse.address}</p>
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

                  <div className="pt-2 border-t">
                    <div className="text-sm">
                      <p className="font-medium text-gray-700">Manager:</p>
                      <p className="text-gray-600">{warehouse.manager}</p>
                    </div>
                    <div className="text-sm mt-2">
                      <p className="text-gray-600">{warehouse.phone}</p>
                      <p className="text-gray-600">{warehouse.email}</p>
                    </div>
                  </div>

                  {canManage && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedWarehouse(warehouse)}
                      className="w-full"
                    >
                      Manage Locations
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations">
          {selectedWarehouse ? (
            <LocationManagement 
              warehouseId={selectedWarehouse.id} 
              warehouseName={selectedWarehouse.name}
            />
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Warehouse</h3>
                  <p className="text-gray-500">Choose a warehouse from the overview to manage its locations.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transfers">
          <StockTransfer />
        </TabsContent>
      </Tabs>

      {!isAdmin && !canManage && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="text-center py-4">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Limited Access</h3>
              <p className="text-gray-500">You can view warehouses but cannot manage them or their locations.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
