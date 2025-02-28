import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/pages/Dashboard";
import Expenses from "./components/pages/Expenses";
import Budgets from "./components/pages/Budgets";
import Goals from "./components/pages/Goals";
import Insights from "./components/pages/Insights";
import Profile from "./components/pages/Profile";
import Sidebar from "./components/cards/Sidebar";
import ChangePassword from "./components/features/ChangePassword";
import EmailNotifications from "./components/features/EmailNotifications";
import LoginHistory from "./components/features/LoginHistory";
import PrivacySettings from "./components/features/PrivacySettings";
import Subscription from "./components/features/Subscription";
import BillingHistory from "./components/features/BillingHistory";
import ContactSupport from "./components/features/ContactSupport";
import Feedback from "./components/features/Feedback";
import SocialLinks from "./components/features/SocialLinks";
import ReferralProgram from "./components/features/ReferralProgram";
import BudgetAllocator from "./components/pages/BudgetAllocator";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // Check if the user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  // Handle login
  const handleLogin = () => {
    setLoggedIn(true);
    navigate("/budgetallocator"); // Redirect to BudgetAllocator after login
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Show Sidebar only if logged in */}
        {loggedIn && <Sidebar onLogout={handleLogout} />}

        <div className="flex-1 p-4">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                !loggedIn ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/budgetallocator" replace />
                )
              }
            />
            <Route
              path="/register"
              element={
                !loggedIn ? (
                  <Register onRegister={() => navigate("/login")} />
                ) : (
                  <Navigate to="/budgetallocator" replace />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                loggedIn ? <Dashboard /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/budgetallocator"
              element={
                loggedIn ? <BudgetAllocator /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/expenses"
              element={
                loggedIn ? <Expenses /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/budgets"
              element={
                loggedIn ? <Budgets /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/goals"
              element={loggedIn ? <Goals /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/insights"
              element={
                loggedIn ? <Insights /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/profile"
              element={
                loggedIn ? (
                  <Profile onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* New Feature Routes */}
            <Route
              path="/change-password"
              element={
                loggedIn ? <ChangePassword /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/notifications"
              element={
                loggedIn ? (
                  <EmailNotifications />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login-history"
              element={
                loggedIn ? <LoginHistory /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/privacy-settings"
              element={
                loggedIn ? (
                  <PrivacySettings />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/subscription"
              element={
                loggedIn ? <Subscription /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/billing-history"
              element={
                loggedIn ? <BillingHistory /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/contact-support"
              element={
                loggedIn ? <ContactSupport /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/feedback"
              element={
                loggedIn ? <Feedback /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/social-links"
              element={
                loggedIn ? <SocialLinks /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/referral-program"
              element={
                loggedIn ? (
                  <ReferralProgram />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Default Route (Redirect to BudgetAllocator if logged in, else to Login) */}
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Navigate to="/budgetallocator" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>

          {/* Show Register/Login Toggle Button if not logged in */}
          {!loggedIn && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  const path =
                    window.location.pathname === "/login"
                      ? "/register"
                      : "/login";
                  navigate(path); // Navigate programmatically
                }}
                className="text-blue-600 underline"
              >
                {window.location.pathname === "/login"
                  ? "Need an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;