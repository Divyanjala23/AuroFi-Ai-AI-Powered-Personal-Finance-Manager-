import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  // Login function
  const handleLogin = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      setLoggedIn(true);
      fetchExpenses();
    } else {
      alert('Invalid credentials');
    }
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:5000/api/expenses', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setExpenses(data);
  };

  // Add expense
  const handleAddExpense = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:5000/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ description, amount: parseFloat(amount) }),
    });
    if (response.ok) {
      setDescription('');
      setAmount('');
      fetchExpenses();
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      fetchExpenses();
    }
  }, []);

  return (
    <div className="App">
      <h1>Finance Manager</h1>
      {!loggedIn ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Expenses</h2>
          <ul>
            {expenses.map((expense, index) => (
              <li key={index}>
                {expense.description}: ${expense.amount}
              </li>
            ))}
          </ul>
          <div>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleAddExpense}>Add Expense</button>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;