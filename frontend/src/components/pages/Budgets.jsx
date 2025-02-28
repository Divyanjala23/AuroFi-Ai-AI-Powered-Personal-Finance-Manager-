import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, DollarSign } from 'lucide-react';
import BudgetCard from '../cards/BudgetCard';

const Budgets = () => {
  const [income, setIncome] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditBudgetForm, setShowEditBudgetForm] = useState(false);
  const [editBudgetData, setEditBudgetData] = useState(null);
  const navigate = useNavigate();

  // Fetch income, budgets, and recurring expenses from the backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);

        // Fetch income
        const incomeResponse = await fetch('http://localhost:5000/api/income', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!incomeResponse.ok) {
          throw new Error('Failed to fetch income');
        }

        const incomeData = await incomeResponse.json();
        console.log('Fetched income data:', incomeData); // Debugging
        setIncome(incomeData);

        // Fetch budgets
        const budgetsResponse = await fetch('http://localhost:5000/api/budgets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!budgetsResponse.ok) {
          throw new Error('Failed to fetch budgets');
        }

        const budgetsData = await budgetsResponse.json();
        console.log('Fetched budgets data:', budgetsData); // Debugging
        setBudgets(budgetsData);

        // Fetch recurring expenses
        const recurringResponse = await fetch('http://localhost:5000/api/recurring-expenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!recurringResponse.ok) {
          throw new Error('Failed to fetch recurring expenses');
        }

        const recurringData = await recurringResponse.json();
        console.log('Fetched recurring expenses:', recurringData); // Debugging
        setRecurringExpenses(recurringData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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

      // Remove the deleted budget from the state
      setBudgets((prevBudgets) => prevBudgets.filter((budget) => budget.id !== budgetId));
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget. Please try again.');
    }
  };

  // Handle editing a budget
  const handleEditBudget = (budgetId) => {
    const budgetToEdit = budgets.find((budget) => budget.id === budgetId);
    if (budgetToEdit) {
      setEditBudgetData(budgetToEdit);
      setShowEditBudgetForm(true);
    }
  };

  // Handle updating a budget
  const handleUpdateBudget = async (updatedBudget) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/budgets/${updatedBudget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBudget),
      });

      if (!response.ok) {
        throw new Error('Failed to update budget');
      }

      // Update the budget in the state
      const updatedBudgets = budgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      );
      setBudgets(updatedBudgets);
      setShowEditBudgetForm(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-teal-800">Finance Manager</h1>
                <p className="text-teal-600">Track your income and expenses</p>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Budget Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onDelete={handleDeleteBudget}
                  onEdit={handleEditBudget}
                  recurringExpenses={recurringExpenses}
                />
              ))}
            </div>

            {/* Income List */}
            <div className="mt-8">
              {/* <h2 className="text-xl font-bold text-teal-800 mb-4">Income</h2> */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {income.map((incomeEntry) => (
                  <div key={incomeEntry.id} className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">{incomeEntry.source}</h3>
                    <p className="text-gray-600">Amount: ${incomeEntry.amount}</p>
                    <p className="text-gray-600">Date: {new Date(incomeEntry.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Budget Form */}
      {showEditBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-teal-800 mb-4">Edit Budget</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateBudget({
                  ...editBudgetData,
                  category: e.target.category.value,
                  limit: parseFloat(e.target.limit.value),
                });
              }}
              className="space-y-4"
            >
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="relative group">
                <Tag className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  defaultValue={editBudgetData.category}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-teal-100 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>
              <div className="relative group">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                <input
                  type="number"
                  name="limit"
                  placeholder="Monthly Limit"
                  defaultValue={editBudgetData.limit}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-teal-100 focus:border-teal-500 focus:outline-none"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditBudgetForm(false)}
                  className="px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;