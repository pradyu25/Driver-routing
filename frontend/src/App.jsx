
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              FMCSA Trip Planner & ELD Log Generator
            </h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results/:id" element={<Results />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; 2026 Autonomous Logistics AI. Compliant with FMCSA 395.8.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
