import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  LineChart,
  Settings,
  HelpCircle,
  User
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
          <div className="bg-teal-600 p-2 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white">John Doe</h3>
            <p className="text-sm text-teal-200">Premium Account</p>
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;