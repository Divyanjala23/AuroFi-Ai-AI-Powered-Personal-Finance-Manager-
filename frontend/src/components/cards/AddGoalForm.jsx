import React, { useState } from 'react';
import { Target, DollarSign, Calendar, Loader2, X } from 'lucide-react';

const AddGoalForm = ({ onSubmit, onClose }) => {
  const predefinedGoals = [
    { id: 'savings', name: 'Emergency Fund', icon: '🏦', description: 'Build emergency savings' },
    { id: 'vacation', name: 'Vacation', icon: '✈️', description: 'Save for dream vacation' },
    { id: 'car', name: 'New Car', icon: '🚗', description: 'Save for a vehicle' },
    { id: 'house', name: 'House Down Payment', icon: '🏠', description: 'Save for home purchase' },
    { id: 'education', name: 'Education', icon: '📚', description: 'Save for education' },
    { id: 'retirement', name: 'Retirement', icon: '👴', description: 'Build retirement savings' }
  ];

  const [formData, setFormData] = useState({
    goal_name: '',
    target_amount: '',
    target_date: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleGoalSelect = (goalName, description = '') => {
    setFormData({
      ...formData,
      goal_name: goalName,
      description: description
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goal_name || !formData.target_amount) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ 
        goal_name: '', 
        target_amount: '', 
        target_date: '',
        description: '' 
      });
      setError('');
    } catch (err) {
      setError('Failed to add goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-teal-600 hover:text-teal-800"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teal-800">Set Financial Goal</h2>
          <p className="text-teal-600 mt-2">Plan your future by setting clear financial targets</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {predefinedGoals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => handleGoalSelect(goal.name, goal.description)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.goal_name === goal.name
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-teal-100 hover:border-teal-200 text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-sm font-medium text-center">{goal.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative group">
              <Target className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
              <input
                type="text"
                name="goal_name"
                placeholder="Goal Name"
                value={formData.goal_name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-200 transition-colors"
                disabled={isLoading}
              />
            </div>

            <div className="relative group">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
              <input
                type="number"
                name="target_amount"
                placeholder="Target Amount"
                value={formData.target_amount}
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
                name="target_date"
                placeholder="Target Date"
                value={formData.target_date}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-200 transition-colors"
                disabled={isLoading}
              />
            </div>

            <div className="relative group">
              <textarea
                name="description"
                placeholder="Goal Description (optional)"
                value={formData.description}
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
                Setting Goal...
              </div>
            ) : (
              'Set Financial Goal'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-teal-600">
              Set clear goals to achieve your financial dreams
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalForm;