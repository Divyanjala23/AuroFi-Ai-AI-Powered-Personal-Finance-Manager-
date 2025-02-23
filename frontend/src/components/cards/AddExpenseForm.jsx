import React, { useState } from 'react';
import { DollarSign, Tag, Calendar, Loader2, Plus } from 'lucide-react';

const AddExpenseForm = ({ onSubmit }) => {
  const predefinedCategories = [
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'utilities', name: 'Utilities', icon: '💡' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'health', name: 'Health', icon: '🏥' }
  ];

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
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
    if (!formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ 
        amount: '', 
        category: '', 
        date: new Date().toISOString().split('T')[0],
        note: '' 
      });
      setError('');
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teal-800">Add Expense</h2>
          <p className="text-teal-600 mt-2">Track your spending by adding new expenses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-200 transition-colors"
                disabled={isLoading}
                min="0"
                step="0.01"
              />
            </div>

            <div className="relative group">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-200 transition-colors"
                disabled={isLoading}
              />
            </div>

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
              <textarea
                name="note"
                placeholder="Add a note (optional)"
                value={formData.note}
                onChange={handleChange}
                className="w-full pl-4 pr-4 py-3 bg-white border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-200 transition-colors resize-none h-24"
                disabled={isLoading}
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
                Adding Expense...
              </div>
            ) : (
              'Add Expense'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-teal-600">
              Keep track of every expense to better manage your finances
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;