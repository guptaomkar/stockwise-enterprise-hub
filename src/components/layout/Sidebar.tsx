
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
  Clipboard,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';

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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.role || '') || user?.email === 'admin@inventorypro.com'
  );

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="flex h-full flex-col bg-white shadow-lg border-r border-gray-200">
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">InventoryPro</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700 border-r-4'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md transition-colors duration-200`
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
    </>
  );
};
