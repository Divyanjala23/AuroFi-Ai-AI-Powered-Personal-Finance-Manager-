import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/pages/Dashboard';
import Expenses from './components/pages/Expenses';
import Budgets from './components/pages/Budgets';
import Goals from './components/pages/Goals';
import Insights from './components/pages/Insights';
// import Navbar from './components/cards/Navbar';
import Sidebar from './components/cards/Sidebar';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Show Navbar only if logged in */}
      {/* {loggedIn && <Navbar onLogout={handleLogout} />} */}

      <div className="flex">
        {/* Show Sidebar only if logged in */}
        {loggedIn && <Sidebar />}

        <div className="flex-1 p-4">
          <Routes>
            {/* Route for Login */}
            <Route
              path="/login"
              element={
                !loggedIn ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />

            {/* Route for Register */}
            <Route
              path="/register"
              element={
                !loggedIn ? (
                  <Register onRegister={() => navigate('/login')} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />

            {/* Route for Dashboard */}
            <Route
              path="/dashboard"
              element={
                loggedIn ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Route for Expenses */}
            <Route
              path="/expenses"
              element={
                loggedIn ? (
                  <Expenses />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Route for Budgets */}
            <Route
              path="/budgets"
              element={
                loggedIn ? (
                  <Budgets />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Route for Goals */}
            <Route
              path="/goals"
              element={
                loggedIn ? (
                  <Goals />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Route for Insights */}
            <Route
              path="/insights"
              element={
                loggedIn ? (
                  <Insights />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Default Route (Redirect to Dashboard if logged in, else to Login) */}
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>

          {/* Show Register/Login Toggle Button if not logged in */}
          {!loggedIn && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  const path = window.location.pathname === '/login' ? '/register' : '/login';
                  navigate(path); // Navigate programmatically
                }}
                className="text-blue-600 underline"
              >
                {window.location.pathname === '/login'
                  ? 'Need an account? Register'
                  : 'Already have an account? Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;