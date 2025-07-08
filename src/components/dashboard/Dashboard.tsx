
import React from 'react';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';
import { InventoryChart } from './InventoryChart';
import { LowStockAlerts } from './LowStockAlerts';

export const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryChart />
        <LowStockAlerts />
      </div>

      <RecentActivity />
    </div>
  );
};
