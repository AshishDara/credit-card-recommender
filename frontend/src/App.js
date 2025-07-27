import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import HomePage from './pages/HomePage';
import ComparisonPage from './pages/ComparisonPage';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare" element={<ComparisonPage />} />
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;