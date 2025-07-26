import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { Home } from './pages/Home';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <Home />
      </div>
    </ChatProvider>
  );
}

export default App;
