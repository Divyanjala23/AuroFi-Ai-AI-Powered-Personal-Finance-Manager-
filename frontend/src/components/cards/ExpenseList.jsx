import React from 'react';
import PropTypes from 'prop-types';
import { DollarSign, Calendar, Clock, Search } from 'lucide-react';

const ExpenseList = ({ expenses = [] }) => {
  if (!Array.isArray(expenses)) {
    console.error('Expenses is not an array:', expenses);
    return null;
  }

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      Housing: '🏠',
      Food: '🍽️',
      Transport: '🚗',
      Utilities: '💡',
      Entertainment: '🎯',
      Shopping: '🛍️',
      Healthcare: '🏥',
      default: '💵'
    };
    return categoryIcons[category] || categoryIcons.default;
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-teal-800">Recent Expenses</h2>
            <p className="text-teal-600 text-sm mt-1">
              {expenses.length} transactions · Total: ${totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-teal-50 p-2 rounded-full">
            <DollarSign className="h-6 w-6 text-teal-600" />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-teal-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-3 bg-teal-50 border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-200 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xl">{getCategoryIcon(expense.category)}</span>
              </div>
              
              <div>
                <h3 className="font-semibold text-teal-800">{expense.category}</h3>
                <div className="flex items-center gap-2 text-sm text-teal-600">
                  <Calendar className="h-4 w-4" />
                  <span>{expense.date || 'Today'}</span>
                  {expense.time && (
                    <>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{expense.time}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-bold text-teal-800">
                ${expense.amount.toLocaleString()}
              </span>
              {expense.note && (
                <span className="text-sm text-teal-600 mt-1">{expense.note}</span>
              )}
            </div>
          </div>
        ))}

        {expenses.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💫</div>
            <h3 className="text-lg font-semibold text-teal-800">No expenses yet</h3>
            <p className="text-teal-600 mt-1">Start adding your expenses to track them</p>
          </div>
        )}
      </div>

      {expenses.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors">
            View All Transactions
          </button>
        </div>
      )}
    </div>
  );
};

ExpenseList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string,
      time: PropTypes.string,
      note: PropTypes.string,
    })
  ),
};

export default ExpenseList;