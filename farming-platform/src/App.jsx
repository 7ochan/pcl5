import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Marketplace from './pages/Marketplace';
import Community from './pages/Community';
import Profile from './pages/Profile';

function AppContent() {
  const { isAuthenticated, user } = useApp();
  const [currentPage, setCurrentPage] = useState('home');
  const [loginRole, setLoginRole] = useState('Farmer');

  const navigate = (page, params = {}) => {
    if (params.role) {
      setLoginRole(params.role);
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      if (currentPage === 'login') {
        return <Login onNavigate={navigate} initialRole={loginRole} />;
      }
      return <Landing onNavigate={navigate} />;
    }

    // Authenticated pages
    switch (currentPage) {
      case 'dashboard':
        return <FarmerDashboard />;
      case 'vendor-dashboard':
        return <VendorDashboard />;
      case 'marketplace':
        return <Marketplace onNavigate={navigate} />;
      case 'community':
        return <Community />;
      case 'profile':
        return <Profile onNavigate={navigate} />;
      default:
        // Redirect to appropriate dashboard based on role
        if (user?.role === 'Farmer') {
          setCurrentPage('dashboard');
          return <FarmerDashboard />;
        } else {
          setCurrentPage('vendor-dashboard');
          return <VendorDashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navigation currentPage={currentPage} onNavigate={navigate} />}
      {renderPage()}
      <Toast />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
