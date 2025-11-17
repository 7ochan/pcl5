import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Navigation = ({ currentPage, onNavigate }) => {
  const { user, logout, cart } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const farmerLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
    { id: 'community', label: 'Community', icon: '💬' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const vendorLinks = [
    { id: 'vendor-dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
    { id: 'community', label: 'Community', icon: '💬' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const links = user?.role === 'Farmer' ? farmerLinks : vendorLinks;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white shadow-md px-6 py-4 items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-green-600 cursor-pointer" onClick={() => onNavigate('home')}>
            🌾 FarmConnect
          </h1>
          <div className="flex space-x-4">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === link.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {cart.length > 0 && (
            <div className="relative">
              <button
                onClick={() => onNavigate('cart')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                🛒 Cart
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              </button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {user?.name || user?.businessName}
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {user?.role}
              </span>
            </span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-green-600" onClick={() => onNavigate('home')}>
            🌾 FarmConnect
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="px-4 pb-4 space-y-2">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg text-left transition ${
                  currentPage === link.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </button>
            ))}
            {cart.length > 0 && (
              <button
                onClick={() => {
                  onNavigate('cart');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-between"
              >
                <span>🛒 Cart</span>
                <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              </button>
            )}
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
        <div className="flex justify-around py-2">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`flex flex-col items-center px-4 py-2 ${
                currentPage === link.id ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-xs mt-1">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
