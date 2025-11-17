import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Marketplace = ({ onNavigate }) => {
  const { products, produce, addToCart, cart, removeFromCart, updateCartQuantity, checkout, user } =
    useApp();
  const [activeTab, setActiveTab] = useState('inputs');
  const [showCart, setShowCart] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [interestMessage, setInterestMessage] = useState('');

  // Filters for Inputs
  const [inputFilters, setInputFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    region: '',
    search: '',
  });

  // Filters for Produce
  const [produceFilters, setProduceFilters] = useState({
    crop: '',
    region: '',
    organic: false,
    search: '',
  });

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (inputFilters.category && product.category !== inputFilters.category) return false;
    if (inputFilters.priceMin && product.price < parseFloat(inputFilters.priceMin)) return false;
    if (inputFilters.priceMax && product.price > parseFloat(inputFilters.priceMax)) return false;
    if (inputFilters.region && !product.region.includes(inputFilters.region)) return false;
    if (
      inputFilters.search &&
      !product.title.toLowerCase().includes(inputFilters.search.toLowerCase()) &&
      !product.description.toLowerCase().includes(inputFilters.search.toLowerCase())
    )
      return false;
    return true;
  });

  // Filter produce
  const filteredProduce = produce.filter((item) => {
    if (produceFilters.crop && item.cropName !== produceFilters.crop) return false;
    if (produceFilters.region && item.region !== produceFilters.region) return false;
    if (produceFilters.organic && !item.organicCertified) return false;
    if (
      produceFilters.search &&
      !item.cropName.toLowerCase().includes(produceFilters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleExpressInterest = (produceItem) => {
    setSelectedProduce(produceItem);
    setShowInterestModal(true);
  };

  const handleSendInterest = () => {
    console.log('Interest sent for:', selectedProduce, 'Message:', interestMessage);
    setShowInterestModal(false);
    setInterestMessage('');
    setSelectedProduce(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 md:px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Marketplace</h2>
        <p className="text-sm text-gray-600 mt-1">Buy and sell farming inputs and produce</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-4 md:px-6 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`py-3 px-4 font-medium border-b-2 transition ${
              activeTab === 'inputs'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            🛒 Inputs (Buy Supplies)
          </button>
          <button
            onClick={() => setActiveTab('produce')}
            className={`py-3 px-4 font-medium border-b-2 transition ${
              activeTab === 'produce'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            🌾 Produce (Buy from Farmers)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Inputs Tab */}
        {activeTab === 'inputs' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Filters</h3>
              <div className="grid md:grid-cols-5 gap-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={inputFilters.search}
                  onChange={(e) => setInputFilters({ ...inputFilters, search: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={inputFilters.category}
                  onChange={(e) => setInputFilters({ ...inputFilters, category: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Service">Service</option>
                </select>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={inputFilters.priceMin}
                  onChange={(e) => setInputFilters({ ...inputFilters, priceMin: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={inputFilters.priceMax}
                  onChange={(e) => setInputFilters({ ...inputFilters, priceMax: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Region"
                  value={inputFilters.region}
                  onChange={(e) => setInputFilters({ ...inputFilters, region: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    {product.rating && (
                      <span className="text-xs text-gray-600">⭐ {product.rating}</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{product.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-green-600">
                        ₹{product.price} {product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-semibold">{product.stock} available</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Vendor:</span>
                      <span className="text-xs">{product.vendorName}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No products match your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Produce Tab */}
        {activeTab === 'produce' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Filters</h3>
              <div className="grid md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={produceFilters.search}
                  onChange={(e) => setProduceFilters({ ...produceFilters, search: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Crop name"
                  value={produceFilters.crop}
                  onChange={(e) => setProduceFilters({ ...produceFilters, crop: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Region"
                  value={produceFilters.region}
                  onChange={(e) => setProduceFilters({ ...produceFilters, region: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={produceFilters.organic}
                    onChange={(e) =>
                      setProduceFilters({ ...produceFilters, organic: e.target.checked })
                    }
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Organic Only</span>
                </label>
              </div>
            </div>

            {/* Produce Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredProduce.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-800">{item.cropName}</h4>
                      {item.organicCertified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          🌿 Organic
                        </span>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {item.quality}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Farmer:</p>
                        <p className="font-medium">{item.farmerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Farm:</p>
                        <p className="font-medium">{item.farmName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Quantity:</p>
                        <p className="font-medium">
                          {item.quantity.toLocaleString()} {item.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price:</p>
                        <p className="font-semibold text-green-600">
                          ₹{item.expectedPrice} {item.priceUnit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Available:</p>
                        <p className="font-medium">
                          {new Date(item.availableDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location:</p>
                        <p className="text-xs">{item.location}</p>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleExpressInterest(item)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Express Interest
                  </button>
                </div>
              ))}
            </div>

            {filteredProduce.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No produce listings match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Button (Fixed) */}
      {cart.length > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-24 md:bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition flex items-center space-x-2"
        >
          <span>🛒</span>
          <span>View Cart ({cart.length})</span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Your Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} {item.unit}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border rounded">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        checkout();
                        setShowCart(false);
                      }}
                      className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                    >
                      Checkout
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      * This is a simulated checkout for MVP demonstration
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Express Interest Modal */}
      {showInterestModal && selectedProduce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Express Interest</h3>
              <button
                onClick={() => setShowInterestModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4 bg-gray-50 rounded p-4">
              <h4 className="font-semibold text-gray-800">{selectedProduce.cropName}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Farmer: {selectedProduce.farmerName} ({selectedProduce.farmName})
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {selectedProduce.quantity.toLocaleString()} {selectedProduce.unit}
              </p>
              <p className="text-sm text-gray-600">
                Price: ₹{selectedProduce.expectedPrice} {selectedProduce.priceUnit}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                rows="4"
                placeholder="Write a message to the farmer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowInterestModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInterest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Interest
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-3">
              * This is a simulated message for MVP demonstration
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
