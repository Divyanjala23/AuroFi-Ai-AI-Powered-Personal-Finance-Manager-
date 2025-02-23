import React, { useState } from 'react';
import { DollarSign, Tag, Loader2, Plus, X } from 'lucide-react';

const AddBudgetForm = ({ onSubmit, onClose }) => {
  const predefinedCategories = [
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'food', name: 'Food & Groceries', icon: '🛒' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    { id: 'utilities', name: 'Utilities', icon: '💡' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎯' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'savings', name: 'Savings', icon: '💰' }
  ];

  const [formData, setFormData] = useState({
    category: '',
    limit: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleCategorySelect = (categoryName) => {
    setFormData({
      ...formData,
      category: categoryName
    });
    setShowCustomInput(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ category: '', limit: '' });
      setError('');
    } catch (err) {
      setError('Failed to add budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-teal-600 hover:text-teal-800"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teal-800">Add New Budget</h2>
          <p className="text-teal-600 mt-2">Choose a category and set your spending limit</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {predefinedCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.name)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                    formData.category === category.name
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-teal-100 hover:border-teal-200 text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium truncate">{category.name}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="p-3 rounded-lg border-2 border-dashed border-teal-300 hover:border-teal-500 text-teal-600 hover:bg-teal-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Custom</span>
              </button>
            </div>

            {showCustomInput && (
              <div className="relative group">
                <Tag className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
                <input
                  type="text"
                  name="category"
                  placeholder="Custom Category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-200 transition-colors"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="relative group">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
              <input
                type="number"
                name="limit"
                placeholder="Monthly Limit"
                value={formData.limit}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-200 transition-colors"
                disabled={isLoading}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Adding Budget...
              </div>
            ) : (
              'Add Budget'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-teal-600">
              Choose from common categories or add your own custom category
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetForm;