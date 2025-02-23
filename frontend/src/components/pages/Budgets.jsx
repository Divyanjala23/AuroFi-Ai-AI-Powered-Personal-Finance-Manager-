import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Loader2 } from 'lucide-react';
// import Navbar from '../cards/Navbar';
// import Sidebar from '../cards/Sidebar';
import BudgetCard from '../cards/BudgetCard';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/budgets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch budgets');
        }

        const data = await response.json();
        console.log('Backend Response:', data); // Log the response for debugging

        // Ensure budgets is always an array
        if (Array.isArray(data)) {
          setBudgets(data);
        } else {
          console.warn('Expected an array but received:', data);
          setBudgets([]); // Set to empty array if response is not an array
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
        setError(error.message); // Set error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, [navigate]);

  // Filter budgets based on search term
  const filteredBudgets = Array.isArray(budgets)
    ? budgets.filter((budget) =>
        budget.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-teal-600">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-lg font-medium">Loading budgets...</p>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-teal-600">
      <div className="bg-teal-50 p-4 rounded-full mb-4">
        <Plus className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-teal-800 mb-2">No budgets yet</h3>
      <p className="text-teal-600 mb-4">Create your first budget to start tracking expenses</p>
      <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
        Create Budget
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar /> */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-teal-800">Budgets</h1>
                <p className="text-teal-600">Manage and track your spending limits</p>
              </div>
              <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                <Plus className="h-5 w-5" />
                New Budget
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-teal-400" />
                  <input
                    type="text"
                    placeholder="Search budgets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-teal-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-teal-100 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors">
                  <Filter className="h-5 w-5" />
                  Filter
                </button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Content */}
            {isLoading ? (
              <LoadingState />
            ) : budgets.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBudgets.map((budget) => (
                  <BudgetCard key={budget.id} budget={budget} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;