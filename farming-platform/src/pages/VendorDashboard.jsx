import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMarketInsights } from '../utils/aiCalculations';

const VendorDashboard = () => {
  const { user, products, addProduct, updateProduct, deleteProduct, farmers, produce, addToast } =
    useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Seeds',
    description: '',
    price: '',
    unit: 'per kg',
    stock: '',
    region: user?.region || '',
    deliveryOptions: [],
  });

  // Targeted offers
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerFilters, setOfferFilters] = useState({
    region: '',
    crop: '',
  });
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [offerMessage, setOfferMessage] = useState('');

  const userProducts = products.filter((p) => p.vendorId === user?.id);
  const marketInsights = calculateMarketInsights(farmers, produce, user?.region || '');

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      setEditingProduct(null);
    } else {
      addProduct(productForm);
    }
    resetProductForm();
  };

  const resetProductForm = () => {
    setProductForm({
      title: '',
      category: 'Seeds',
      description: '',
      price: '',
      unit: 'per kg',
      stock: '',
      region: user?.region || '',
      deliveryOptions: [],
    });
    setShowProductForm(false);
  };

  const handleEditProduct = (product) => {
    setProductForm(product);
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeliveryOption = (option) => {
    const options = productForm.deliveryOptions || [];
    if (options.includes(option)) {
      setProductForm({
        ...productForm,
        deliveryOptions: options.filter((o) => o !== option),
      });
    } else {
      setProductForm({
        ...productForm,
        deliveryOptions: [...options, option],
      });
    }
  };

  // Filter farmers based on criteria
  const filteredFarmers = farmers.filter((farmer) => {
    if (offerFilters.region && farmer.region !== offerFilters.region) return false;
    if (offerFilters.crop && !farmer.crops.includes(offerFilters.crop)) return false;
    return true;
  });

  const handleSendOffer = () => {
    if (selectedFarmers.length === 0) {
      addToast('Please select at least one farmer', 'error');
      return;
    }
    console.log('Sending offer to farmers:', selectedFarmers, 'Message:', offerMessage);
    addToast(`Offer sent to ${selectedFarmers.length} farmer(s)!`, 'success');
    setShowOfferModal(false);
    setSelectedFarmers([]);
    setOfferMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 md:px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.businessName}!</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-4 md:px-6 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {['overview', 'products', 'market-insights', 'targeted-offers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'overview' && '🏠 Overview'}
              {tab === 'products' && '📦 Products'}
              {tab === 'market-insights' && '📊 Market Insights'}
              {tab === 'targeted-offers' && '🎯 Targeted Offers'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Vendor Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Overview</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-semibold">{user?.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Region</p>
                  <p className="font-semibold">{user?.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{user?.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Years in Business</p>
                  <p className="font-semibold">{user?.yearsInBusiness} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold">⭐ {user?.rating}/5.0</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">📦</div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-xl font-bold text-gray-800">{userProducts.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">👨‍🌾</div>
                <p className="text-sm text-gray-600">Active Farmers</p>
                <p className="text-xl font-bold text-gray-800">{farmers.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🌾</div>
                <p className="text-sm text-gray-600">Produce Listings</p>
                <p className="text-xl font-bold text-gray-800">{produce.length}</p>
              </div>
            </div>

            {/* Recent Insights */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Insights</h3>
              <div className="space-y-2">
                {marketInsights.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">→</span>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">My Products</h3>
              <button
                onClick={() => {
                  if (showProductForm && !editingProduct) {
                    resetProductForm();
                  } else {
                    setShowProductForm(!showProductForm);
                    setEditingProduct(null);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showProductForm && !editingProduct ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {/* Add/Edit Product Form */}
            {showProductForm && (
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h4>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.title}
                        onChange={(e) =>
                          setProductForm({ ...productForm, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm({ ...productForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Pesticide">Pesticide</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Service">Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <input
                        type="text"
                        value={productForm.unit}
                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                        placeholder="e.g., per kg, per bag"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.stock}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stock: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                      <input
                        type="text"
                        value={productForm.region}
                        onChange={(e) =>
                          setProductForm({ ...productForm, region: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({ ...productForm, description: e.target.value })
                      }
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Product description..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Options
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['Home Delivery', 'Store Pickup', 'Installation Service', 'On-site Visit'].map(
                        (option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={productForm.deliveryOptions?.includes(option)}
                              onChange={() => handleDeliveryOption(option)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          resetProductForm();
                        }}
                        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Product List */}
            <div className="space-y-4">
              {userProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">
                    No products yet. Click "Add Product" to create one!
                  </p>
                </div>
              ) : (
                userProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">{product.title}</h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="font-semibold">₹{product.price} {product.unit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Stock</p>
                            <p className="font-semibold">{product.stock} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Region</p>
                            <p className="font-semibold">{product.region}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Delivery</p>
                            <p className="text-xs text-gray-700">
                              {product.deliveryOptions?.join(', ') || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Market Insights Tab */}
        {activeTab === 'market-insights' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Market Insights & Trends</h3>

            {/* Trending Crops */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">🔥 Trending Crops</h4>
              <div className="space-y-3">
                {marketInsights.trendingCrops.map((crop, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-800">{crop.crop}</span>
                        <span
                          className={`text-sm ${
                            crop.trend === 'up' ? 'text-green-600' : 'text-gray-600'
                          }`}
                        >
                          {crop.trend === 'up' ? '📈 Rising' : '➡️ Stable'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${crop.demandScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{crop.farmerCount} farmers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Regions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">📍 Recommended Target Regions</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {marketInsights.recommendedRegions.map((region, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-800">{region.region}</h5>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        Score: {region.score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {region.farmerCount} active farmers
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Top Crops:</strong> {region.topCrops.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Produce Availability */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">📊 Produce Availability</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold text-green-700">
                    {marketInsights.produceStats.totalListings}
                  </p>
                </div>
                {Object.entries(marketInsights.produceStats.byRegion)
                  .slice(0, 2)
                  .map(([region, count]) => (
                    <div key={region} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">{region}</p>
                      <p className="text-2xl font-bold text-gray-800">{count} listings</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Targeted Offers Tab */}
        {activeTab === 'targeted-offers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Send Targeted Offers</h3>
              <button
                onClick={() => setShowOfferModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                🎯 Create New Offer
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-800 mb-4">How Targeted Offers Work</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  1. <strong>Filter Farmers:</strong> Select farmers by region, crop type, or other
                  criteria
                </p>
                <p>
                  2. <strong>Personalize Message:</strong> Create a customized offer message
                </p>
                <p>
                  3. <strong>Send:</strong> Deliver your offer directly to selected farmers
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Note: In this MVP, offers are simulated and logged to console
                </p>
              </div>
            </div>

            {/* Offer Modal */}
            {showOfferModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Create Targeted Offer</h3>
                    <button
                      onClick={() => {
                        setShowOfferModal(false);
                        setSelectedFarmers([]);
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Filter Farmers</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Region
                        </label>
                        <select
                          value={offerFilters.region}
                          onChange={(e) =>
                            setOfferFilters({ ...offerFilters, region: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">All Regions</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                        <select
                          value={offerFilters.crop}
                          onChange={(e) =>
                            setOfferFilters({ ...offerFilters, crop: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">All Crops</option>
                          <option value="Wheat">Wheat</option>
                          <option value="Rice">Rice</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Soybean">Soybean</option>
                          <option value="Sugarcane">Sugarcane</option>
                          <option value="Potato">Potato</option>
                          <option value="Chilli">Chilli</option>
                          <option value="Tomato">Tomato</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Farmers List */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Select Farmers ({filteredFarmers.length} matching)
                    </h4>
                    <div className="max-h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
                      {filteredFarmers.map((farmer) => (
                        <label
                          key={farmer.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFarmers.includes(farmer.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFarmers([...selectedFarmers, farmer.id]);
                              } else {
                                setSelectedFarmers(
                                  selectedFarmers.filter((id) => id !== farmer.id)
                                );
                              }
                            }}
                            className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{farmer.name}</p>
                            <p className="text-xs text-gray-600">
                              {farmer.region} • {farmer.crops.join(', ')}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Offer Message */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Message
                    </label>
                    <textarea
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      rows="4"
                      placeholder="Write your personalized offer message here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    ></textarea>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowOfferModal(false);
                        setSelectedFarmers([]);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendOffer}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Send Offer to {selectedFarmers.length} Farmer(s)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
