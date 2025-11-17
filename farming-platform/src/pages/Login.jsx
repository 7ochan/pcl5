import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Login = ({ onNavigate, initialRole = 'Farmer' }) => {
  const { login } = useApp();
  const [role, setRole] = useState(initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake login - accepts any credentials
    const success = login(username || 'demo', password || 'demo', role);
    if (success) {
      onNavigate(role === 'Farmer' ? 'dashboard' : 'vendor-dashboard');
    }
  };

  const handleQuickLogin = (demoRole) => {
    setRole(demoRole);
    const success = login('demo', 'demo', demoRole);
    if (success) {
      onNavigate(demoRole === 'Farmer' ? 'dashboard' : 'vendor-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="mb-4 text-gray-600 hover:text-gray-800 flex items-center"
        >
          ← Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">🔓 Demo Login:</span> This is a prototype. Enter any credentials or use demo/demo. You can also use the quick login buttons below.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Farmer">Farmer</option>
                <option value="Vendor">Vendor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter any username or leave empty"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any password or leave empty"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Sign In
            </button>
          </form>

          {/* Quick Login Buttons */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-3">Or quick demo login as:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('Farmer')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
              >
                👨‍🌾 Farmer
              </button>
              <button
                onClick={() => handleQuickLogin('Vendor')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
              >
                🏪 Vendor
              </button>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 text-xs text-gray-500 border-t pt-4">
            <p className="font-semibold mb-2">Demo Accounts (optional):</p>
            <p><strong>Farmers:</strong> rajesh_farmer, priya_farm, ahmed_crops, lakshmi_agri</p>
            <p><strong>Vendors:</strong> agrisupplies_vendor, farmtech_vendor, organic_vendor</p>
            <p className="mt-2 italic">Password: any or leave empty</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
