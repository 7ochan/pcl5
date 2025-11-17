import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Profile = ({ onNavigate }) => {
  const { user, resetDemoData, logout, produce, products } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  const userProduce = produce.filter((p) => p.farmerId === user?.id);
  const userProducts = products.filter((p) => p.vendorId === user?.id);

  const handleExportData = (type) => {
    let data, filename;
    if (type === 'produce') {
      data = userProduce;
      filename = 'my_produce_listings.csv';
    } else {
      data = userProducts;
      filename = 'my_products.csv';
    }

    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    // Convert to CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((item) => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleSwitchRole = () => {
    logout();
    onNavigate('login', { role: user?.role === 'Farmer' ? 'Vendor' : 'Farmer' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 md:px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Profile & Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-4 md:px-6 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 font-medium border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 font-medium border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                  {user?.role === 'Farmer' ? '👨‍🌾' : '🏪'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {user?.name || user?.businessName}
                  </h3>
                  <p className="text-gray-600">{user?.role}</p>
                  <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded">
                    {user?.username}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  {user?.role === 'Farmer' ? 'Farm Information' : 'Business Information'}
                </h4>
                {user?.role === 'Farmer' ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Farm Name</p>
                      <p className="font-semibold">{user?.farmName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">{user?.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Region</p>
                      <p className="font-semibold">{user?.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Farm Size</p>
                      <p className="font-semibold">{user?.farmSize} hectares</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Primary Crop</p>
                      <p className="font-semibold">{user?.primaryCrop}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">All Crops</p>
                      <p className="font-semibold">{user?.crops?.join(', ')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Business Name</p>
                      <p className="font-semibold">{user?.businessName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">{user?.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Region</p>
                      <p className="font-semibold">{user?.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-semibold">⭐ {user?.rating}/5.0</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Years in Business</p>
                      <p className="font-semibold">{user?.yearsInBusiness} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="font-semibold">{userProducts.length}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Activity Summary</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {user?.role === 'Farmer' ? (
                  <>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Active Produce Listings</p>
                      <p className="text-2xl font-bold text-green-700">{userProduce.length}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="text-lg font-semibold text-blue-700">
                        {user?.lastUpdated
                          ? new Date(user.lastUpdated).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Soil Type</p>
                      <p className="text-lg font-semibold text-purple-700">{user?.soilType}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-green-700">{userProducts.length}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-2xl font-bold text-blue-700">⭐ {user?.rating}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Service Region</p>
                      <p className="text-lg font-semibold text-purple-700">{user?.region}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Export Data */}
            {user?.role === 'Farmer' && userProduce.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Export My Data</h4>
                <button
                  onClick={() => handleExportData('produce')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  📥 Export Produce Listings (CSV)
                </button>
              </div>
            )}

            {user?.role === 'Vendor' && userProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Export My Data</h4>
                <button
                  onClick={() => handleExportData('products')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  📥 Export Product Listings (CSV)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Demo Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Demo Settings</h4>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-3">
                    <strong>Switch Role:</strong> Try the platform from a different perspective
                  </p>
                  <button
                    onClick={handleSwitchRole}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Switch to {user?.role === 'Farmer' ? 'Vendor' : 'Farmer'} Account
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 mb-3">
                    <strong>Reset Demo Data:</strong> This will reload all mock data from JSON
                    files and clear your cart
                  </p>
                  <button
                    onClick={resetDemoData}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Reset Demo Data
                  </button>
                </div>
              </div>
            </div>

            {/* About This MVP */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">About This MVP</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  This is a <strong>Minimum Viable Product (MVP)</strong> prototype of the Smart
                  AI-Driven Farming & Vendor Platform.
                </p>
                <div className="bg-gray-50 rounded p-4">
                  <p className="font-semibold mb-2">Features Implemented:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Fake authentication (any credentials accepted)</li>
                    <li>Mock data stored in browser memory</li>
                    <li>AI insights using deterministic calculations</li>
                    <li>Marketplace with cart functionality</li>
                    <li>Community forum with posts and comments</li>
                    <li>Farmer and Vendor dashboards</li>
                    <li>Responsive mobile-first design</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded p-4">
                  <p className="font-semibold mb-2">NOT Implemented (by design):</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Real user authentication or authorization</li>
                    <li>Backend database or API</li>
                    <li>Image uploads or CNN-based AI</li>
                    <li>Real payment processing</li>
                    <li>Admin panel</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500 italic mt-4">
                  All AI calculations are rule-based and deterministic. See the developer notes in
                  README.md for implementation details.
                </p>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Account Actions</h4>
              <button
                onClick={() => {
                  logout();
                  onNavigate('home');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
