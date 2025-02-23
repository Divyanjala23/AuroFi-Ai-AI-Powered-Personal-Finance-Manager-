import React from 'react';
import { Line } from 'recharts';
import { TrendingUp, Brain, AlertCircle } from 'lucide-react';

const InsightChart = ({ predictions = [], insights = [] }) => {
  // Transform predictions for recharts
  const chartData = predictions.map((value, index) => ({
    month: `Month ${index + 1}`,
    value: value
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal-800">Expense Predictions</h2>
          <div className="flex items-center gap-2 mt-1">
            <Brain className="h-4 w-4 text-teal-600" />
            <span className="text-sm text-teal-600">AI-Powered Insights</span>
          </div>
        </div>
        <div className="bg-teal-50 p-3 rounded-xl">
          <TrendingUp className="h-6 w-6 text-teal-600" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-64 w-full">
          <Line
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0D9488"
              strokeWidth={2}
              fill="url(#gradient)"
              dot={{ fill: '#0D9488', strokeWidth: 2 }}
            />
          </Line>
        </div>

        {insights && insights.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-800 font-semibold">
              <AlertCircle className="h-5 w-5 text-teal-600" />
              <h3>Key Insights</h3>
            </div>
            {insights.map((insight, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-xl"
              >
                <p className="text-teal-800">{insight}</p>
              </div>
            ))}
          </div>
        )}

        {(!insights || insights.length === 0) && (
          <div className="text-center py-4 bg-teal-50 rounded-xl">
            <div className="text-4xl mb-2">🔮</div>
            <p className="text-teal-800 font-medium">
              AI is analyzing your spending patterns
            </p>
            <p className="text-teal-600 text-sm mt-1">
              Check back soon for personalized insights
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-teal-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-teal-600">
            Last updated: {new Date().toLocaleDateString()}
          </span>
          <button className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightChart;