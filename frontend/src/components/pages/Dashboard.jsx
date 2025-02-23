import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, TrendingUp, CreditCard, Target, AlertCircle } from 'lucide-react';
import BudgetCard from '../cards/BudgetCard';
import GoalCard from '../cards/GoalCard';
import InsightChart from '../cards/InsightChart';
import ExpenseList from '../cards/ExpenseList';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [expensesRes, budgetsRes, goalsRes, predictionsRes] = await Promise.all([
          fetch('http://localhost:5000/api/expenses', { headers }),
          fetch('http://localhost:5000/api/budgets', { headers }),
          fetch('http://localhost:5000/api/goals', { headers }),
          fetch('http://localhost:5000/api/insights/predictions', { headers })
        ]);

        const [expensesData, budgetsData, goalsData, predictionsData] = await Promise.all([
          expensesRes.json(),
          budgetsRes.json(),
          goalsRes.json(),
          predictionsRes.json()
        ]);

        setExpenses(Array.isArray(expensesData) ? expensesData : []);
        setBudgets(Array.isArray(budgetsData) ? budgetsData : []);
        setGoals(Array.isArray(goalsData) ? goalsData : []);
        setPredictions(Array.isArray(predictionsData.predictions) ? predictionsData.predictions : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const LoadingState = () => (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
        <p className="text-teal-800 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (loading) return <LoadingState />;

  return (
    <div className="container mx-auto p-6">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-teal-800">Dashboard Overview</h1>
        <p className="text-teal-600">Track your financial progress and insights</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-5 w-5" />
            <h3 className="font-medium">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold">
            ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-medium">Active Budgets</h3>
          </div>
          <p className="text-2xl font-bold">{budgets.length}</p>
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5" />
            <h3 className="font-medium">Goals Progress</h3>
          </div>
          <p className="text-2xl font-bold">
            {goals.filter(g => g.progress >= 100).length}/{goals.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ExpenseList expenses={expenses.slice(0, 5)} />
          <InsightChart predictions={predictions} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-teal-800 mb-4">Active Budgets</h2>
            <div className="space-y-4">
              {budgets.slice(0, 3).map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-teal-800 mb-4">Financial Goals</h2>
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;