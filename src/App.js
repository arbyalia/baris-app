import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BarisProvider } from './context/BarisContext';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import ReviewsPage from './pages/ReviewsPage';
import AnalyzingPage from './pages/AnalyzingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BarisProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mulai" element={<OnboardingPage />} />
          <Route path="/ulasan" element={<ReviewsPage />} />
          <Route path="/menganalisis" element={<AnalyzingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </BarisProvider>
  );
}

export default App;
