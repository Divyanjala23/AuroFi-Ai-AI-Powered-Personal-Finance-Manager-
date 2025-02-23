import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from '../cards/Navbar';
// import Sidebar from '../cards/Sidebar';
import InsightChart from '../cards/InsightChart';
import { Loader2 } from 'lucide-react';

const Insights = () => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPredictions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/insights/predictions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }

        const data = await response.json();
        setPredictions(data.predictions);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching insights');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-emerald-50">
        <div className="flex items-center space-x-2 text-teal-600">
          <Loader2 className="animate-spin h-6 w-6" />
          <span className="text-lg font-medium">Loading insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50">
      <div className="flex">
        {/* <Sidebar /> */}
        <div className="flex-1">
          {/* <Navbar /> */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-teal-800">Insights Dashboard</h1>
              <p className="text-teal-600 mt-2">Analyze your performance predictions and trends</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              {predictions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-teal-600 text-lg">No insights available yet. Start tracking your goals to generate predictions!</p>
                  <button
                    className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                    onClick={() => navigate('/goals')}
                  >
                    View Goals
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h2 className="text-xl font-semibold text-teal-800 mb-2">Prediction Analysis</h2>
                    <p className="text-teal-600">View your performance trends and future projections</p>
                  </div>
                  <InsightChart predictions={predictions} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;