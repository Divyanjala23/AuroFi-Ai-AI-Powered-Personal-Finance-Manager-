import React, { useState } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
// import ExpenseList from './components/Expenses/ExpenseList';
// import BankAccounts from './components/Bank/BankAccounts';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <h1 className="text-2xl font-bold">Finance Manager</h1>
      </nav>
      <div className="p-4">
        {!loggedIn ? (
          showRegister ? (
            <Register onRegister={() => setShowRegister(false)} />
          ) : (
            <Login onLogin={() => setLoggedIn(true)} />
          )
        ) : (
          <>
            {/* <ExpenseList />
            <BankAccounts /> */}
          </>
        )}
        {!loggedIn && (
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="mt-4 text-blue-600 underline"
          >
            {showRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        )}
      </div>
    </div>
  );
};

export default App;