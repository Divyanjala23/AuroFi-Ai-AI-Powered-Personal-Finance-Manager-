import React from 'react';
import { Target, TrendingUp, Sparkles, Calendar, Trash2 } from 'lucide-react';

const GoalCard = ({ goal, onDelete }) => {
  const {
    goal_name = 'Unnamed Goal',
    target_amount = 0,
    saved_amount = 0,
    target_date = null,  // Add this line
  } = goal || {};

  // Calculate progress percentage
  const progress = (saved_amount / target_amount) * 100 || 0;
  const remaining = target_amount - saved_amount;
  const isComplete = progress >= 100;

  const getGoalIcon = (goalName) => {
    const goalIcons = {
      'Emergency Fund': '🏦',
      'Vacation': '✈️',
      'New Car': '🚗',
      'House': '🏠',
      'Education': '📚',
      'Retirement': '👴',
      'Wedding': '💍',
      'Business': '💼',
      default: '🎯',
    };
    return goalIcons[goalName] || goalIcons.default;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl bg-teal-50 p-3 rounded-xl">
            {getGoalIcon(goal_name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-teal-800">{goal_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Target className="h-4 w-4 text-teal-600" />
              <span className="text-sm text-teal-600">Financial Goal</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-teal-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-teal-600" />
              <span className="text-sm text-teal-600">Target</span>
            </div>
            <span className="text-lg font-bold text-teal-800">
              ${target_amount.toLocaleString()}
            </span>
          </div>

          <div className="bg-teal-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span className="text-sm text-teal-600">Saved</span>
            </div>
            <span className="text-lg font-bold text-teal-800">
              ${saved_amount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-teal-600">Progress</span>
            <span className="text-sm font-medium text-teal-800">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-teal-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isComplete ? 'bg-yellow-500' : 'bg-teal-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-teal-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-teal-600">Remaining</span>
              <p className="font-bold text-teal-800">
                ${Math.max(remaining, 0).toLocaleString()}
              </p>
            </div>
            {target_date && (  // Add this block
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-teal-600">
                  <Calendar className="h-4 w-4" />
                  <span>Target Date</span>
                </div>
                <p className="font-medium text-teal-800">{new Date(target_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="mt-4 text-center bg-yellow-50 rounded-xl p-3">
          <p className="text-yellow-700 font-medium">
            Congratulations! Goal achieved 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalCard;