
import React from 'react';
import { Package, TrendingUp, AlertTriangle, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Total Products',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    title: 'Stock Value',
    value: '$485,290',
    change: '+8.2%',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  {
    title: 'Low Stock Items',
    value: '23',
    change: '-15.3%',
    changeType: 'negative',
    icon: AlertTriangle,
    color: 'bg-yellow-500',
  },
  {
    title: 'Warehouses',
    value: '8',
    change: '+1',
    changeType: 'positive',
    icon: Building2,
    color: 'bg-purple-500',
  },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
