
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', value: 425000 },
  { month: 'Feb', value: 445000 },
  { month: 'Mar', value: 485000 },
  { month: 'Apr', value: 465000 },
  { month: 'May', value: 495000 },
  { month: 'Jun', value: 485290 },
];

export const InventoryChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Inventory Value Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Inventory Value']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
