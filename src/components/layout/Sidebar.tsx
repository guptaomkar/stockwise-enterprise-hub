
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings,
  PackageCheck,
  ShoppingBag,
  TruckIcon,
  Building,
  Clipboard
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['Administrator', 'Manager', 'Staff', 'Auditor'] },
  { name: 'Products', href: '/products', icon: Package, roles: ['Administrator', 'Manager', 'Staff', 'Auditor'] },
  { name: 'Inventory', href: '/inventory', icon: PackageCheck, roles: ['Administrator', 'Manager', 'Staff', 'Auditor'] },
  { name: 'Stock Control', href: '/inventory-control', icon: Clipboard, roles: ['Administrator', 'Manager', 'Staff'] },
  { name: 'Warehouses', href: '/warehouses', icon: Warehouse, roles: ['Administrator', 'Manager', 'Staff'] },
  { name: 'Procurement', href: '/procurement', icon: ShoppingBag, roles: ['Administrator', 'Manager'] },
  { name: 'Sales & Dispatch', href: '/sales', icon: TruckIcon, roles: ['Administrator', 'Manager', 'Staff'] },
  { name: 'Orders', href: '/orders', icon: ShoppingCart, roles: ['Administrator', 'Manager', 'Staff'] },
  { name: 'Vendors & Customers', href: '/vendors', icon: Building, roles: ['Administrator', 'Manager'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['Administrator', 'Manager', 'Auditor'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['Administrator'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['Administrator', 'Manager'] },
];

export const Sidebar = () => {
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.role || '') || user?.email === 'admin@inventorypro.com'
  );

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">InventoryPro</span>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium border-l-4 transition-colors duration-200`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
