import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Loader from './Loader';
import HomePage from './HomePage';
import AuthenticationPage from './AuthenticationPage';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 2s for rotation + 1s for slide/fade

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthenticationPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
