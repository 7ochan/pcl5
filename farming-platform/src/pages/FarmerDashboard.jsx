import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  calculateSoilRecommendations,
  calculateHarvestPrediction,
  calculatePestRisk,
} from '../utils/aiCalculations';

const FarmerDashboard = () => {
  const { user, updateFarmDetails, addProduce, deleteProduce, produce, weather, baseYield, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingFarm, setIsEditingFarm] = useState(false);
  const [farmData, setFarmData] = useState({});
  const [showProduceForm, setShowProduceForm] = useState(false);
  const [produceForm, setProduceForm] = useState({
    cropName: '',
    quantity: '',
    expectedPrice: '',
    availableDate: '',
    quality: 'Grade A',
    organicCertified: false,
    description: '',
  });

  useEffect(() => {
    if (user) {
      setFarmData({
        farmName: user.farmName || '',
        location: user.location || '',
        farmSize: user.farmSize || 0,
        primaryCrop: user.primaryCrop || '',
        soilType: user.soilType || '',
        soilN: user.soilN || 0,
        soilP: user.soilP || 0,
        soilK: user.soilK || 0,
      });
    }
  }, [user]);

  const userProduce = produce.filter((p) => p.farmerId === user?.id);
  const userWeather = weather[user?.region] || null;

  // AI Calculations
  const soilRecommendations = user
    ? calculateSoilRecommendations(user.primaryCrop, user, baseYield)
    : [];
  const harvestPrediction = user
    ? calculateHarvestPrediction(user.primaryCrop, user, baseYield, userWeather)
    : null;
  const pestRisk = user
    ? calculatePestRisk(user.primaryCrop, user.region, userWeather)
    : null;

  const handleSaveFarm = () => {
    updateFarmDetails(user.id, farmData);
    setIsEditingFarm(false);
  };

  const handleAddProduce = (e) => {
    e.preventDefault();
    addProduce(produceForm);
    setProduceForm({
      cropName: '',
      quantity: '',
      expectedPrice: '',
      availableDate: '',
      quality: 'Grade A',
      organicCertified: false,
      description: '',
    });
    setShowProduceForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 md:px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Farmer Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.name}!</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-4 md:px-6 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {['overview', 'ai-insights', 'my-produce'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'overview' && '🏠 Farm Overview'}
              {tab === 'ai-insights' && '🤖 AI Insights'}
              {tab === 'my-produce' && '🌾 My Produce'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Farm Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Farm Details Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Farm Details</h3>
                <button
                  onClick={() => setIsEditingFarm(!isEditingFarm)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  {isEditingFarm ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {!isEditingFarm ? (
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
                    <p className="text-sm text-gray-600">Farm Size</p>
                    <p className="font-semibold">{user?.farmSize} hectares</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Primary Crop</p>
                    <p className="font-semibold">{user?.primaryCrop}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Soil Type</p>
                    <p className="font-semibold">{user?.soilType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Soil NPK</p>
                    <p className="font-semibold">
                      N: {user?.soilN} | P: {user?.soilP} | K: {user?.soilK}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        value={farmData.farmName}
                        onChange={(e) => setFarmData({ ...farmData, farmName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={farmData.location}
                        onChange={(e) => setFarmData({ ...farmData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Size (hectares)
                      </label>
                      <input
                        type="number"
                        value={farmData.farmSize}
                        onChange={(e) =>
                          setFarmData({ ...farmData, farmSize: parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Crop
                      </label>
                      <select
                        value={farmData.primaryCrop}
                        onChange={(e) =>
                          setFarmData({ ...farmData, primaryCrop: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Crop</option>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soil Type
                      </label>
                      <select
                        value={farmData.soilType}
                        onChange={(e) => setFarmData({ ...farmData, soilType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Soil Type</option>
                        <option value="Loamy">Loamy</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Black Soil">Black Soil</option>
                        <option value="Red Soil">Red Soil</option>
                        <option value="Alluvial">Alluvial</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Soil Nutrient Levels</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nitrogen (N)
                        </label>
                        <input
                          type="number"
                          value={farmData.soilN}
                          onChange={(e) =>
                            setFarmData({ ...farmData, soilN: parseFloat(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phosphorus (P)
                        </label>
                        <input
                          type="number"
                          value={farmData.soilP}
                          onChange={(e) =>
                            setFarmData({ ...farmData, soilP: parseFloat(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Potassium (K)
                        </label>
                        <input
                          type="number"
                          value={farmData.soilK}
                          onChange={(e) =>
                            setFarmData({ ...farmData, soilK: parseFloat(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveFarm}
                    className="w-full md:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🌾</div>
                <p className="text-sm text-gray-600">Primary Crop</p>
                <p className="text-xl font-bold text-gray-800">{user?.primaryCrop}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">📏</div>
                <p className="text-sm text-gray-600">Farm Size</p>
                <p className="text-xl font-bold text-gray-800">{user?.farmSize} ha</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">📦</div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-xl font-bold text-gray-800">{userProduce.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <div className="space-y-6">
            {/* Weather Widget */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">☀️ Weather Forecast</h3>
              {userWeather ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">7-day forecast for {user?.region}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {userWeather.forecast.map((day, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs font-medium text-gray-600">{day.day}</p>
                        <p className="text-2xl my-2">
                          {day.condition === 'Sunny' && '☀️'}
                          {day.condition === 'Partly Cloudy' && '⛅'}
                          {day.condition === 'Cloudy' && '☁️'}
                          {day.condition === 'Light Rain' && '🌦️'}
                          {day.condition === 'Rain' && '🌧️'}
                        </p>
                        <p className="text-lg font-bold">{day.temp}°C</p>
                        <p className="text-xs text-gray-600">{day.condition}</p>
                        {day.rainfall > 0 && (
                          <p className="text-xs text-blue-600 mt-1">💧 {day.rainfall}mm</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Weather data not available</p>
              )}
            </div>

            {/* Soil Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🌱 Soil Recommendations
              </h3>
              <div className="space-y-3">
                {soilRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high'
                        ? 'bg-red-50 border-red-500'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-green-50 border-green-500'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-xl">{rec.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{rec.text}</p>
                        {rec.nutrient && (
                          <p className="text-xs text-gray-600 mt-1">Nutrient: {rec.nutrient}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Harvest Prediction */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Harvest Prediction
              </h3>
              {harvestPrediction && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Expected Yield</p>
                      <p className="text-2xl font-bold text-green-700">
                        {harvestPrediction.expectedYield.toLocaleString()} kg
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        ({harvestPrediction.yieldPerHectare.toLocaleString()} kg/hectare)
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Expected Harvest Date</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {new Date(harvestPrediction.harvestDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        ({harvestPrediction.daysToHarvest} days from planting)
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Confidence Level</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${harvestPrediction.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-purple-700">
                        {harvestPrediction.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{harvestPrediction.message}</p>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                    <p className="font-semibold mb-1">Calculation Factors:</p>
                    <p>Nutrient Factor: {harvestPrediction.nutrientFactor}x</p>
                    <p>Weather Factor: {harvestPrediction.weatherFactor}x</p>
                    <p className="mt-2 italic">
                      Formula: Base Yield × Nutrient Factor × Weather Factor × Farm Size
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pest/Disease Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🐛 Pest & Disease Risk Assessment
              </h3>
              {pestRisk && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${
                      pestRisk.riskLevel === 'High'
                        ? 'bg-red-100 border-l-4 border-red-500'
                        : pestRisk.riskLevel === 'Medium'
                        ? 'bg-yellow-100 border-l-4 border-yellow-500'
                        : 'bg-green-100 border-l-4 border-green-500'
                    }`}
                  >
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className="text-2xl font-bold">{pestRisk.riskLevel}</p>
                    <p className="text-sm mt-1">{pestRisk.recommendation}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Potential Threats:</h4>
                    <div className="space-y-3">
                      {pestRisk.threats.map((threat, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium text-gray-800">{threat.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Reason:</strong> {threat.reason}
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            <strong>Prevention:</strong> {threat.prevention}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Produce Tab */}
        {activeTab === 'my-produce' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">My Produce Listings</h3>
              <button
                onClick={() => setShowProduceForm(!showProduceForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {showProduceForm ? 'Cancel' : '+ Add Listing'}
              </button>
            </div>

            {/* Add Produce Form */}
            {showProduceForm && (
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Create New Produce Listing</h4>
                <form onSubmit={handleAddProduce} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crop Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={produceForm.cropName}
                        onChange={(e) =>
                          setProduceForm({ ...produceForm, cropName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity (kg) *
                      </label>
                      <input
                        type="number"
                        required
                        value={produceForm.quantity}
                        onChange={(e) =>
                          setProduceForm({ ...produceForm, quantity: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Price (₹/kg) *
                      </label>
                      <input
                        type="number"
                        required
                        value={produceForm.expectedPrice}
                        onChange={(e) =>
                          setProduceForm({ ...produceForm, expectedPrice: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={produceForm.availableDate}
                        onChange={(e) =>
                          setProduceForm({ ...produceForm, availableDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quality
                      </label>
                      <select
                        value={produceForm.quality}
                        onChange={(e) =>
                          setProduceForm({ ...produceForm, quality: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Grade A">Grade A</option>
                        <option value="Grade B">Grade B</option>
                        <option value="Premium">Premium</option>
                        <option value="Standard">Standard</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={produceForm.organicCertified}
                          onChange={(e) =>
                            setProduceForm({
                              ...produceForm,
                              organicCertified: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Organic Certified
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={produceForm.description}
                      onChange={(e) =>
                        setProduceForm({ ...produceForm, description: e.target.value })
                      }
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Additional details about your produce..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                  >
                    Create Listing
                  </button>
                </form>
              </div>
            )}

            {/* Produce Listings */}
            <div className="space-y-4">
              {userProduce.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">
                    No produce listings yet. Click "Add Listing" to create one!
                  </p>
                </div>
              ) : (
                userProduce.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">{item.cropName}</h4>
                          {item.organicCertified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              🌿 Organic
                            </span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {item.quality}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-600">Quantity</p>
                            <p className="font-semibold">
                              {item.quantity.toLocaleString()} {item.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="font-semibold">₹{item.expectedPrice} {item.priceUnit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Available Date</p>
                            <p className="font-semibold">
                              {new Date(item.availableDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-3">{item.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Listed on: {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteProduce(item.id)}
                        className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
