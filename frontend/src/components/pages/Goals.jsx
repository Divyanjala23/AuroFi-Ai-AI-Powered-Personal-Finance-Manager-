import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalCard from '../cards/GoalCard';
import { Loader2 } from 'lucide-react';
import AddGoalForm from '../cards/AddGoalForm';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/goals', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }

        const data = await response.json();
        setGoals(data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching goals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [navigate]);

  const handleAddGoal = async (newGoal) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGoal),
      });

      if (!response.ok) {
        throw new Error('Failed to add goal');
      }

      const addedGoal = await response.json();
      setGoals([...goals, addedGoal]);
      setShowAddGoalForm(false);
    } catch (error) {
      console.error('Error adding goal:', error);
      setError('Failed to add goal. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-emerald-50">
        <div className="flex items-center space-x-2 text-teal-600">
          <Loader2 className="animate-spin h-6 w-6" />
          <span className="text-lg font-medium">Loading goals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50">
      <div className="flex">
        <div className="flex-1">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-teal-800">Your Goals</h1>
              <p className="text-teal-600 mt-2">Track and manage your personal objectives</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-teal-600 text-lg">No goals found. Start creating your goals today!</p>
                  <button
                    className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                    onClick={() => setShowAddGoalForm(true)}
                  >
                    Create New Goal
                  </button>
                </div>
              ) : (
                goals.map((goal) => (
                  <div key={goal.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                    <GoalCard goal={goal} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Form */}
      {showAddGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <AddGoalForm
            onSubmit={handleAddGoal}
            onClose={() => setShowAddGoalForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Goals;