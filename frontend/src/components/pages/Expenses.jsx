import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, Loader2, Download, Calendar, ArrowUpDown } from 'lucide-react';
import ExpenseList from '../cards/ExpenseList';
import AddExpenseForm from '../cards/AddExpenseForm';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false); // State to toggle form
  const [sortBy, setSortBy] = useState('date'); // State for sorting
  const [dateRange, setDateRange] = useState({ start: '', end: '' }); // State for date range
  const navigate = useNavigate();

  // Disable scrolling on the main page when the modal is open
  useEffect(() => {
    if (showAddExpenseForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showAddExpenseForm]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/expenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setExpenses(data);
        } else {
          throw new Error('Invalid expenses data');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError(error.message);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  // Handle adding a new expense
  const handleAddExpense = async (newExpense) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const addedExpense = await response.json();
      setExpenses([...expenses, addedExpense]); // Update the expenses list
      setShowAddExpenseForm(false); // Hide the form after submission
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense. Please try again.');
    }
  };

  // Handle sorting
  const handleSort = (criteria) => {
    setSortBy(criteria);
    const sortedExpenses = [...expenses].sort((a, b) => {
      if (criteria === 'date') {
        return new Date(a.date) - new Date(b.date);
      } else if (criteria === 'amount') {
        return a.amount - b.amount;
      }
      return 0;
    });
    setExpenses(sortedExpenses);
  };

  // Handle date range filtering
  const handleDateRangeFilter = () => {
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      return (
        (!startDate || expenseDate >= startDate) &&
        (!endDate || expenseDate <= endDate)
      );
    });
    setExpenses(filtered);
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LoadingState = () => (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
        <p className="text-teal-800 font-medium">Loading your expenses...</p>
      </div>
    </div>
  );

  if (loading) return <LoadingState />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-teal-800">Expenses</h1>
              <p className="text-teal-600">
                {filteredExpenses.length} transactions · Total: ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-teal-100 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors">
                <Download className="h-5 w-5" />
                Export
              </button>
              <button
                onClick={() => setShowAddExpenseForm(true)}
                className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-teal-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-teal-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => handleDateRangeFilter()}
                className="flex items-center gap-2 px-4 py-2 border-2 border-teal-100 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                Date Range
              </button>
              <button
                onClick={() => handleSort(sortBy === 'date' ? 'amount' : 'date')}
                className="flex items-center gap-2 px-4 py-2 border-2 border-teal-100 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
              >
                <ArrowUpDown className="h-5 w-5" />
                Sort
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-teal-100 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors">
                <Filter className="h-5 w-5" />
                Filter
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Expense List */}
          <div className="bg-white rounded-xl shadow-sm">
            <ExpenseList expenses={filteredExpenses} />
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <AddExpenseForm
            onSubmit={handleAddExpense}
            onClose={() => setShowAddExpenseForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Expenses;