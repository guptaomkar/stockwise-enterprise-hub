
import React from 'react';
import { Bell, Search, User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  user: any;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products, orders, or customers..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</span>
              <span className="text-xs text-gray-500">{user?.role || 'Administrator'}</span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
