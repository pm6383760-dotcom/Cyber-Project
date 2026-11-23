import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScanProvider } from './context/ScanContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ThreatIntelPage from './pages/ThreatIntelPage';
import SettingsPage from './pages/SettingsPage';

const AppLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex">
        {!isLanding && <Sidebar />}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/threat-intel" element={<ThreatIntelPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ScanProvider>
        <Router>
          <AppLayout />
        </Router>
      </ScanProvider>
    </AuthProvider>
  );
}

export default App;
