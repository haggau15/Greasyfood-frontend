import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
    const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_FUNCTION_URL}?code=${process.env.REACT_APP_FUNCTION_KEY}`,
        {
          method: 'GET'
        }
      );
      const data = await response.body;
      setData(data);
    };
    fetchData();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://vg.no"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Redddddact
        </a>
      </header>
        <div>
      {data ? (
        <p>Received data: {data}</p>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
    </div>
  );
}

export default App;
