import React, { useState } from 'react';
import { DollarSign, Tag, Loader2, X } from 'lucide-react';

const AddIncomeCard = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.source || !formData.amount) {
      setError('Please fill in all fields.');
      return;
    }

    if (isNaN(formData.amount)) {
      setError('Please enter a valid amount.');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    setIsLoading(true);
    try {
      // Call the onSubmit prop with the form data
      await onSubmit({
        source: formData.source,
        amount: parseFloat(formData.amount), // Ensure amount is a number
      });

      // Reset form and close the card if successful
      setFormData({ source: '', amount: '' });
      setError('');
      if (onClose) onClose(); // Close the card after successful submission
    } catch (err) {
      setError('Failed to add income. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-teal-800">Add Income</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-teal-600 hover:text-teal-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Source Field */}
        <div className="relative group">
          <Tag className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
          <input
            type="text"
            name="source"
            placeholder="Source (e.g., Salary, Freelance)"
            value={formData.source}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-teal-100 focus:border-teal-500 focus:outline-none"
            required
            aria-label="Income Source"
          />
        </div>

        {/* Amount Field */}
        <div className="relative group">
          <DollarSign className="absolute left-3 top-3 h-5 w-5 text-teal-500" />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-teal-100 focus:border-teal-500 focus:outline-none"
            required
            min="0"
            step="0.01"
            aria-label="Income Amount"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Adding Income...
            </div>
          ) : (
            'Add Income'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddIncomeCard;