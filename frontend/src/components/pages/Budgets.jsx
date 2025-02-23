import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Loader2 } from 'lucide-react';
import BudgetCard from '../cards/BudgetCard';
import AddBudgetForm from '../cards/AddBudgetForm';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showAddBudgetForm, setShowAddBudgetForm] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({ category: '', amount: '' });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const navigate = useNavigate();

  // Fetch budgets from the backend
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
        console.log('Backend Response:', data); // Debugging

        if (Array.isArray(data)) {
          setBudgets(data);
        } else {
          console.warn('Expected an array but received:', data);
          setBudgets([]);
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, [navigate]);

  // Handle adding a new budget
  const handleAddBudget = async (newBudget) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBudget),
      });

      if (!response.ok) {
        throw new Error('Failed to add budget');
      }

      const addedBudget = await response.json();
      console.log('Added Budget:', addedBudget); // Debugging

      setBudgets((prevBudgets) => [...prevBudgets, addedBudget]);
      setShowAddBudgetForm(false);
    } catch (error) {
      console.error('Error adding budget:', error);
      setError('Failed to add budget. Please try again.');
    }
  };

  // Handle deleting a budget
  const handleDeleteBudget = async (budgetId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      setBudgets((prevBudgets) => prevBudgets.filter((budget) => budget.id !== budgetId));
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget. Please try again.');
    }
  };

  // Filter budgets based on search term and filter criteria
  const filteredBudgets = Array.isArray(budgets)
    ? budgets.filter((budget) => {
        const matchesSearch = budget.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCriteria.category
          ? budget.category === filterCriteria.category
          : true;
        const matchesAmount = filterCriteria.amount
          ? budget.amount <= parseFloat(filterCriteria.amount)
          : true;
        return matchesSearch && matchesCategory && matchesAmount;
      })
    : [];

  console.log('Filtered Budgets:', filteredBudgets); // Debugging

  // Loading state
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-teal-600">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-lg font-medium">Loading budgets...</p>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-teal-600">
      <div className="bg-teal-50 p-4 rounded-full mb-4">
        <Plus className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-teal-800 mb-2">No budgets yet</h3>
      <p className="text-teal-600 mb-4">Create your first budget to start tracking expenses</p>
      <button
        onClick={() => setShowAddBudgetForm(true)}
        className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
      >
        Create Budget
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-teal-800">Budgets</h1>
                <p className="text-teal-600">Manage and track your spending limits</p>
              </div>
              <button
                onClick={() => setShowAddBudgetForm(true)}
                className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
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
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-teal-100 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                >
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
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onDelete={handleDeleteBudget}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Budget Form */}
      {showAddBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <AddBudgetForm
            onSubmit={handleAddBudget}
            onClose={() => setShowAddBudgetForm(false)}
          />
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-teal-800 mb-4">Filter Budgets</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-teal-600">Category</label>
                <select
                  value={filterCriteria.category}
                  onChange={(e) =>
                    setFilterCriteria({ ...filterCriteria, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-teal-100 focus:border-teal-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Savings'].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600">Maximum Amount</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filterCriteria.amount || 0}
                  onChange={(e) =>
                    setFilterCriteria({ ...filterCriteria, amount: e.target.value })
                  }
                  className="w-full"
                />
                <p className="text-sm text-teal-600">Selected: ${filterCriteria.amount || 0}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;