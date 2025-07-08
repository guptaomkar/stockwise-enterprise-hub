
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 45000, purchases: 32000 },
  { month: 'Feb', sales: 52000, purchases: 38000 },
  { month: 'Mar', sales: 48000, purchases: 35000 },
  { month: 'Apr', sales: 61000, purchases: 42000 },
  { month: 'May', sales: 55000, purchases: 40000 },
  { month: 'Jun', sales: 67000, purchases: 45000 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Office Supplies', value: 28 },
  { name: 'Food & Beverage', value: 20 },
  { name: 'Furniture', value: 17 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const Analytics = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales vs Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="purchases" fill="#10b981" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
