
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Package, Plus, Edit, Trash2, Navigation } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Location {
  id: string;
  warehouseId: string;
  rack: string;
  shelf: string;
  bin: string;
  capacity: number;
  occupied: number;
  products: string[];
  coordinates?: {
    x: number;
    y: number;
    z: number;
  };
}

interface LocationManagementProps {
  warehouseId: string;
  warehouseName: string;
}

const mockLocations: Location[] = [
  {
    id: '1',
    warehouseId: 'main-warehouse',
    rack: 'A1',
    shelf: 'S1',
    bin: 'B1',
    capacity: 100,
    occupied: 75,
    products: ['OFF-001', 'OFF-002'],
    coordinates: { x: 10, y: 5, z: 1 }
  },
  {
    id: '2',
    warehouseId: 'main-warehouse',
    rack: 'A1',
    shelf: 'S2',
    bin: 'B3',
    capacity: 80,
    occupied: 32,
    products: ['ELE-045'],
    coordinates: { x: 10, y: 5, z: 2 }
  },
];

export const LocationManagement: React.FC<LocationManagementProps> = ({ 
  warehouseId, 
  warehouseName 
}) => {
  const [locations, setLocations] = useState<Location[]>(
    mockLocations.filter(loc => loc.warehouseId === warehouseId)
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      rack: '',
      shelf: '',
      bin: '',
      capacity: '',
      x: '',
      y: '',
      z: '',
    }
  });

  const handleAddLocation = (data: any) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      warehouseId,
      rack: data.rack,
      shelf: data.shelf,
      bin: data.bin,
      capacity: parseInt(data.capacity),
      occupied: 0,
      products: [],
      coordinates: {
        x: parseFloat(data.x) || 0,
        y: parseFloat(data.y) || 0,
        z: parseFloat(data.z) || 0,
      }
    };
    setLocations([...locations, newLocation]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const getLocationCode = (location: Location) => {
    return `${location.rack}-${location.shelf}-${location.bin}`;
  };

  const getUtilizationColor = (occupied: number, capacity: number) => {
    const percentage = (occupied / capacity) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Location Management - {warehouseName}
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddLocation)} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="rack"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rack</FormLabel>
                        <FormControl>
                          <Input placeholder="A1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shelf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shelf</FormLabel>
                        <FormControl>
                          <Input placeholder="S1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bin</FormLabel>
                        <FormControl>
                          <Input placeholder="B1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="x"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X Coordinate</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="10.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="y"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Y Coordinate</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="5.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="z"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Z Coordinate</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="1.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Location</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <Card key={location.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  {getLocationCode(location)}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacity</span>
                <span className={`text-sm px-2 py-1 rounded ${getUtilizationColor(location.occupied, location.capacity)}`}>
                  {location.occupied}/{location.capacity}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(location.occupied / location.capacity) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Package className="w-4 h-4 mr-1" />
                <span>{location.products.length} Products</span>
              </div>

              {location.coordinates && (
                <div className="flex items-center text-sm text-gray-600">
                  <Navigation className="w-4 h-4 mr-1" />
                  <span>
                    X: {location.coordinates.x}, Y: {location.coordinates.y}, Z: {location.coordinates.z}
                  </span>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Products: {location.products.join(', ') || 'None'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
