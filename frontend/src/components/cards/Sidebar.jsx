import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  LineChart,
  Settings,
  HelpCircle,
  User,
  LogOut
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: 'Loading...', email: '' });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Receipt, label: 'Expenses', path: '/expenses' },
    { icon: PieChart, label: 'Budgets', path: '/budgets' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: LineChart, label: 'Insights', path: '/insights' },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  const MenuItem = ({ icon: Icon, label, path }) => (
    <button
      onClick={() => navigate(path)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all duration-200
        ${isActiveRoute(path)
          ? 'bg-teal-600 text-white shadow-md'
          : 'text-teal-100 hover:bg-white/10'
        }
      `}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="bg-gradient-to-b from-teal-800 to-teal-900 text-white w-64 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 px-4">
          <div className="bg-white/10 p-2 rounded-xl">
            <PieChart className="h-6 w-6 text-teal-200" />
          </div>
          <h2 className="text-xl font-bold text-white">Finance App</h2>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 mb-6">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
        >
          <div className="bg-teal-600 p-2 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-white">{user.name}</h3>
            <p className="text-sm text-teal-200">{user.email}</p>
          </div>
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 px-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.path} {...item} />
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="p-6">
        <div className="pt-6 border-t border-white/10">
          <nav className="space-y-2">
            {bottomMenuItems.map((item) => (
              <MenuItem key={item.path} {...item} />
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-teal-100 hover:bg-white/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;