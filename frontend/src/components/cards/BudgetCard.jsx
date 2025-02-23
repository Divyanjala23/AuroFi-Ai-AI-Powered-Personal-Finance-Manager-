import React from 'react';
import { DollarSign, AlertCircle, TrendingUp, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

const BudgetCard = ({ budget, onDelete }) => {
  const spent = budget.spent || 0;
  const percentage = Math.min((spent / budget.limit) * 100, 100);
  const isOverBudget = spent > budget.limit;
  const remaining = budget.limit - spent;

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
      default: '📊'
    };
    return categoryIcons[category] || categoryIcons.default;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(budget.category)}</span>
          <div>
            <h2 className="text-xl font-bold text-teal-800">{budget.category}</h2>
            <p className="text-sm text-teal-600">Monthly Budget</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOverBudget && (
            <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />
          )}
          <button
            onClick={() => onDelete(budget.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
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
    </div>
  );
};

export default BudgetCard;