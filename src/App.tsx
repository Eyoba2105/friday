import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { LandingPage } from './pages/LandingPage';
import { RoomPage } from './pages/RoomPage';
import { initTelegramWebApp } from './utils/telegram';

function App() {
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;