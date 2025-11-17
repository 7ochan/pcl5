import React from 'react';

const Landing = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-2xl font-bold text-green-600">🌾 FarmConnect</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Smart AI-Driven Farming & Vendor Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connecting farmers and vendors through intelligent insights, marketplace solutions, and community collaboration
            </p>
          </div>

          {/* Demo Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">📌 MVP Prototype Notice:</span> This is a demonstration interface with mock data. No real authentication, database, or image uploads are implemented.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
            {/* Farmer Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4">👨‍🌾</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Farmer Portal</h3>
              <ul className="text-left space-y-2 mb-6 text-gray-600">
                <li>✓ AI-powered crop insights</li>
                <li>✓ Weather & soil recommendations</li>
                <li>✓ Harvest predictions</li>
                <li>✓ Sell your produce</li>
                <li>✓ Buy farming supplies</li>
              </ul>
              <button
                onClick={() => onNavigate('login', { role: 'Farmer' })}
                className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Enter as Farmer
              </button>
            </div>

            {/* Vendor Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Vendor Portal</h3>
              <ul className="text-left space-y-2 mb-6 text-gray-600">
                <li>✓ Manage product listings</li>
                <li>✓ Market insights & trends</li>
                <li>✓ Target farmers by region</li>
                <li>✓ Send personalized offers</li>
                <li>✓ Connect with buyers</li>
              </ul>
              <button
                onClick={() => onNavigate('login', { role: 'Vendor' })}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Enter as Vendor
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold text-gray-800 mb-2">AI Insights</h4>
              <p className="text-sm text-gray-600">
                Get intelligent recommendations for soil, weather, and harvest predictions
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-3">🛒</div>
              <h4 className="font-semibold text-gray-800 mb-2">Marketplace</h4>
              <p className="text-sm text-gray-600">
                Buy and sell farming inputs and produce in one unified platform
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-semibold text-gray-800 mb-2">Community</h4>
              <p className="text-sm text-gray-600">
                Connect with other farmers and vendors, share knowledge and experiences
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 px-6 text-center text-sm text-gray-600">
        <p>Smart AI-Driven Farming & Vendor Platform - MVP Prototype</p>
        <p className="text-xs mt-1">All data is simulated for demonstration purposes</p>
      </footer>
    </div>
  );
};

export default Landing;
