import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      <h1>Finance Manager</h1>
      <p>Backend Message: {message}</p>
    </div>
  );
}

export default App;