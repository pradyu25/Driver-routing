
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Routes>
          <Route path="/" element={
            <div className="container mx-auto">
              <Home />
            </div>
          } />
          <Route path="/results/:id" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
