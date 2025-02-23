import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Receipt, PieChart, Target, LineChart, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const NavButton = ({ to, icon: Icon, label }) => (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 
        ${isActiveRoute(to) 
          ? 'bg-teal-700 text-white shadow-sm' 
          : 'text-teal-100 hover:bg-teal-700/50'}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-2 rounded-lg">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Finance Manager</h1>
          </div>

          <div className="flex items-center gap-2">
            <NavButton to="/dashboard" icon={Home} label="Dashboard" />
            <NavButton to="/expenses" icon={Receipt} label="Expenses" />
            <NavButton to="/budgets" icon={PieChart} label="Budgets" />
            <NavButton to="/goals" icon={Target} label="Goals" />
            <NavButton to="/insights" icon={LineChart} label="Insights" />
            
            <div className="w-px h-8 bg-teal-400 mx-2" />
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg 
                bg-red-500 text-white hover:bg-red-600 
                transition-colors duration-200 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;