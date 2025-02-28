import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, BarChart, Save, RefreshCw } from "lucide-react";

const BudgetAllocator = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [allocatedBudget, setAllocatedBudget] = useState([]);
  const [isAutoAllocation, setIsAutoAllocation] = useState(true);
  const [manualPercentages, setManualPercentages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const navigate = useNavigate();

  // Fetch predefined categories and percentages from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/budgets/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categories = await response.json();
        setAllocatedBudget(categories);

        // Initialize manual percentages
        const initialPercentages = {};
        categories.forEach((category) => {
          initialPercentages[category.name] = category.percentage;
        });
        setManualPercentages(initialPercentages);

        // Calculate initial total percentage
        const total = categories.reduce((sum, category) => sum + category.percentage, 0);
        setTotalPercentage(total);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load budget categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (isAutoAllocation) {
      autoAllocateBudget();
    } else {
      manualAllocateBudget();
    }
  };

  const autoAllocateBudget = async () => {
    const allocated = allocatedBudget.map((category) => ({
      ...category,
      amount: (totalBudget * category.percentage) / 100,
    }));
    setAllocatedBudget(allocated);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/budgets/allocate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          totalBudget,
          budgets: allocated,
          allocationMethod: "auto",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to allocate budget");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error allocating budget:", error);
      setError("Failed to allocate budget.");
    } finally {
      setLoading(false);
    }
  };

  const manualAllocateBudget = async () => {
    const allocated = allocatedBudget.map((category) => ({
      ...category,
      amount: (totalBudget * manualPercentages[category.name]) / 100,
      percentage: manualPercentages[category.name],
    }));
    setAllocatedBudget(allocated);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/budgets/allocate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          totalBudget,
          budgets: allocated,
          allocationMethod: "manual",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to allocate budget");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error allocating budget:", error);
      setError("Failed to allocate budget.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualPercentageChange = (categoryName, percentage) => {
    const newValue = parseFloat(percentage) || 0;

    // Update the specific category percentage
    const updatedPercentages = {
      ...manualPercentages,
      [categoryName]: newValue,
    };

    setManualPercentages(updatedPercentages);

    // Calculate total percentage
    const total = Object.values(updatedPercentages).reduce((sum, val) => sum + (val || 0), 0);
    setTotalPercentage(total);
  };

  const getPercentageBarColor = () => {
    if (totalPercentage === 100) return "bg-emerald-500";
    if (totalPercentage < 100) return "bg-teal-500";
    return "bg-red-500";
  };

  // Pre-defined category icons
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      Housing: "🏠",
      Food: "🍲",
      Transportation: "🚗",
      Entertainment: "🎬",
      Shopping: "🛍️",
      Utilities: "💡",
      Healthcare: "⚕️",
      Savings: "💰",
      Education: "📚",
      Travel: "✈️",
    };

    return iconMap[categoryName] || "💵";
  };

  const CategorySlider = ({ category }) => {
    const percentage = manualPercentages[category.name] || 0;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{category.emoji || getCategoryIcon(category.name)}</span>
            <span className="font-medium text-teal-800">{category.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={percentage || ""}
              onChange={(e) => handleManualPercentageChange(category.name, e.target.value)}
              className="w-16 p-1 border border-teal-200 rounded-md text-right text-teal-800"
              placeholder="0"
              min="0"
              max="100"
              step="0.1"
            />
            <span className="text-teal-600">%</span>
          </div>
        </div>
        <div className="relative h-2 bg-teal-100 rounded-full">
          <div
            className="absolute h-2 bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading && allocatedBudget.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-teal-800 font-medium">Loading budget allocator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-teal-800">Budget Allocator</h1>
          <p className="text-teal-600">Customize your budget distribution</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-teal-600" />
                Budget Settings
              </h2>

              <form onSubmit={handleBudgetSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-2">
                    Total Monthly Budget
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-teal-500">$</span>
                    </div>
                    <input
                      type="number"
                      value={totalBudget || ""}
                      onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                      className="pl-8 block w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-teal-800"
                      placeholder="Enter your budget"
                      required
                    />
                  </div>
                </div>

                {/* Allocation Method */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-teal-700">
                    Allocation Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAutoAllocation(true)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-colors ${
                        isAutoAllocation
                          ? "bg-teal-500 text-white"
                          : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                      }`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Auto Allocate
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAutoAllocation(false)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-colors ${
                        !isAutoAllocation
                          ? "bg-teal-500 text-white"
                          : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                      }`}
                    >
                      <BarChart className="h-4 w-4" />
                      Manual Allocate
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-3 rounded-xl hover:from-teal-600 hover:to-emerald-600 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Allocate Budget
                    </>
                  )}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm">Budget allocated successfully!</p>
                </div>
              )}
            </div>
          </div>

          {/* Budget Allocation Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-teal-800 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-teal-600" />
                  {isAutoAllocation ? "Auto Budget Allocation" : "Manual Budget Allocation"}
                </h2>
                {!isAutoAllocation && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        totalPercentage === 100
                          ? "text-emerald-600"
                          : totalPercentage > 100
                          ? "text-red-600"
                          : "text-teal-600"
                      }`}
                    >
                      {totalPercentage.toFixed(1)}%
                    </span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full">
                      <div
                        className={`h-2 ${getPercentageBarColor()} rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Allocation Sliders */}
              {!isAutoAllocation && (
                <div className="space-y-6 mb-6">
                  {allocatedBudget.map((category, index) => (
                    <CategorySlider key={index} category={category} />
                  ))}

                  <div className="mt-4 px-4 py-3 bg-teal-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPercentageBarColor()}`}></div>
                      <p
                        className={`text-sm ${
                          totalPercentage === 100
                            ? "text-emerald-700"
                            : totalPercentage > 100
                            ? "text-red-700"
                            : "text-teal-700"
                        }`}
                      >
                        {totalPercentage === 100
                          ? "Perfect! Allocations equal 100%."
                          : totalPercentage > 100
                          ? `Allocations exceed 100% by ${(totalPercentage - 100).toFixed(1)}%`
                          : `Allocations need ${(100 - totalPercentage).toFixed(1)}% more to reach 100%`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Allocated Budgets */}
              {allocatedBudget.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-teal-800">Allocated Amounts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allocatedBudget.map((category, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-teal-50 rounded-xl border border-teal-100"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full text-xl">
                            {category.emoji || getCategoryIcon(category.name)}
                          </div>
                          <div>
                            <h4 className="font-medium text-teal-800">{category.name}</h4>
                            <p className="text-sm text-teal-600">
                              {isAutoAllocation ? category.percentage : manualPercentages[category.name] || 0}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-teal-800">
                            $
                            {(
                              (totalBudget *
                                (isAutoAllocation ? category.percentage : manualPercentages[category.name] || 0)) /
                              100
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocator;