import React, { useState } from 'react';
import { DollarSign, AlertCircle, TrendingUp, ChevronUp, ChevronDown, Trash2, Edit, X, Loader2, Tag } from 'lucide-react';

const BudgetCard = ({ budget, onDelete, onEdit }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    category: budget.category,
    limit: budget.limit,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const spent = budget.spent || 0; // Amount spent in this category
  const percentage = Math.min((spent / budget.limit) * 100, 100); // Progress percentage
  const isOverBudget = spent > budget.limit; // Check if the budget is exceeded
  const remaining = budget.limit - spent; // Remaining budget

  // Get an icon for the budget category
  const getCategoryIcon = (category) => {
    const categoryIcons = {
      Housing: '🏠',
      Food: '🍽️',
      Transport: '🚗',
      Utilities: '💡',
      Entertainment: '🎯',
      Shopping: '🛍️',
      Healthcare: '🏥',
      Savings: '💰',
      default: '📊',
    };
    return categoryIcons[category] || categoryIcons.default;
  };

  // Handle editing a budget
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/budgets/${budget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update budget');
      }

      const updatedBudget = await response.json();
      onEdit(updatedBudget); // Notify the parent component of the update
      setShowEditForm(false);
      setError('');
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a budget
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/budgets/${budget.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      onDelete(budget.id); // Notify the parent component of the deletion
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header: Category and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(budget.category)}</span>
          <div>
            <h2 className="text-xl font-bold text-teal-800">{budget.category}</h2>
            <p className="text-sm text-teal-600">Monthly Budget</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOverBudget && <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />}
          {/* Edit Button */}
          <button
            onClick={() => setShowEditForm(true)}
            className="text-teal-600 hover:text-teal-800 transition-colors"
            aria-label="Edit Budget"
          >
            <Edit className="h-5 w-5" />
          </button>
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete Budget"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Budget Details */}
      <div className="space-y-4">
        {/* Budget Limit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-teal-600" />
            <span className="font-semibold text-lg text-teal-800">
              ${budget.limit.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            <span className="text-sm text-teal-600">Limit</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-teal-600">Progress</span>
            <span className={`font-medium ${isOverBudget ? 'text-red-500' : 'text-teal-600'}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget ? 'bg-red-500' : 'bg-teal-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Spent and Remaining */}
        <div className="flex justify-between items-center pt-2 border-t border-teal-100">
          <div className="flex flex-col">
            <span className="text-sm text-teal-600">Spent</span>
            <div className="flex items-center gap-1">
              <ChevronUp className={`h-4 w-4 ${isOverBudget ? 'text-red-500' : 'text-teal-600'}`} />
              <span className={`font-medium ${isOverBudget ? 'text-red-500' : 'text-teal-700'}`}>
                ${spent.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-teal-600">Remaining</span>
            <div className="flex items-center gap-1">
              <ChevronDown className={`h-4 w-4 ${remaining < 0 ? 'text-red-500' : 'text-teal-600'}`} />
              <span className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-teal-700'}`}>
                ${Math.abs(remaining).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Budget Form */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-teal-800 mb-4">Edit Budget</h2>
            <form onSubmit={handleEdit} className="space-y-4">
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
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-teal-100 focus:border-teal-500 focus:outline-none"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;