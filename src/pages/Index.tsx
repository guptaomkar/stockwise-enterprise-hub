
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Dashboard } from '../components/dashboard/Dashboard';
import { ProductCatalog } from '../components/products/ProductCatalog';
import { InventoryOverview } from '../components/inventory/InventoryOverview';
import { InventoryControl } from '../components/inventory/InventoryControl';
import { WarehouseManagement } from '../components/warehouse/WarehouseManagement';
import { OrderManagement } from '../components/orders/OrderManagement';
import { ProcurementManagement } from '../components/procurement/ProcurementManagement';
import { SalesManagement } from '../components/sales/SalesManagement';
import { Analytics } from '../components/analytics/Analytics';
import { VendorManagement } from '../components/vendors/VendorManagement';
import { UserManagement } from '../components/users/UserManagement';
import { Settings } from '../components/settings/Settings';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
          <Header user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/inventory" element={<InventoryOverview />} />
                <Route path="/inventory-control" element={<InventoryControl />} />
                <Route path="/warehouses" element={<WarehouseManagement />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/procurement" element={<ProcurementManagement />} />
                <Route path="/sales" element={<SalesManagement />} />
                <Route path="/vendors" element={<VendorManagement />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
