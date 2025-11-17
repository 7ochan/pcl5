/**
 * AI Calculations Module
 * This file contains deterministic functions that simulate AI outputs
 * All calculations are rule-based and reproducible for demonstration purposes
 */

/**
 * Calculate soil recommendations based on NPK values
 * Logic: Compare actual values with ideal values for the crop
 * @param {string} crop - The crop type
 * @param {object} soilData - Current soil NPK values
 * @param {object} baseYieldData - Base yield data for crops
 * @returns {array} - Array of recommendation objects
 */
export const calculateSoilRecommendations = (crop, soilData, baseYieldData) => {
  if (!baseYieldData[crop]) {
    return [{ text: 'No data available for this crop', priority: 'low', icon: '❓' }];
  }

  const { idealSoilN, idealSoilP, idealSoilK } = baseYieldData[crop];
  const recommendations = [];

  // Nitrogen recommendations
  const nDiff = soilData.soilN - idealSoilN;
  if (nDiff < -10) {
    recommendations.push({
      text: `Nitrogen is critically low (${soilData.soilN} vs ideal ${idealSoilN}). Apply urea or ammonium sulfate immediately.`,
      priority: 'high',
      icon: '🔴',
      nutrient: 'N'
    });
  } else if (nDiff < 0) {
    recommendations.push({
      text: `Nitrogen is slightly low (${soilData.soilN} vs ideal ${idealSoilN}). Consider adding nitrogen-rich fertilizer.`,
      priority: 'medium',
      icon: '🟡',
      nutrient: 'N'
    });
  } else if (nDiff > 15) {
    recommendations.push({
      text: `Nitrogen is high (${soilData.soilN} vs ideal ${idealSoilN}). Reduce nitrogen fertilizer to avoid crop damage.`,
      priority: 'medium',
      icon: '🟡',
      nutrient: 'N'
    });
  } else {
    recommendations.push({
      text: `Nitrogen levels are optimal (${soilData.soilN}).`,
      priority: 'low',
      icon: '🟢',
      nutrient: 'N'
    });
  }

  // Phosphorus recommendations
  const pDiff = soilData.soilP - idealSoilP;
  if (pDiff < -8) {
    recommendations.push({
      text: `Phosphorus is low (${soilData.soilP} vs ideal ${idealSoilP}). Apply DAP or super phosphate.`,
      priority: 'high',
      icon: '🔴',
      nutrient: 'P'
    });
  } else if (pDiff < 0) {
    recommendations.push({
      text: `Phosphorus is slightly low (${soilData.soilP} vs ideal ${idealSoilP}). Monitor and supplement if needed.`,
      priority: 'medium',
      icon: '🟡',
      nutrient: 'P'
    });
  } else {
    recommendations.push({
      text: `Phosphorus levels are good (${soilData.soilP}).`,
      priority: 'low',
      icon: '🟢',
      nutrient: 'P'
    });
  }

  // Potassium recommendations
  const kDiff = soilData.soilK - idealSoilK;
  if (kDiff < -8) {
    recommendations.push({
      text: `Potassium is low (${soilData.soilK} vs ideal ${idealSoilK}). Apply muriate of potash.`,
      priority: 'high',
      icon: '🔴',
      nutrient: 'K'
    });
  } else if (kDiff < 0) {
    recommendations.push({
      text: `Potassium is slightly low (${soilData.soilK} vs ideal ${idealSoilK}). Consider adding potash fertilizer.`,
      priority: 'medium',
      icon: '🟡',
      nutrient: 'K'
    });
  } else {
    recommendations.push({
      text: `Potassium levels are adequate (${soilData.soilK}).`,
      priority: 'low',
      icon: '🟢',
      nutrient: 'K'
    });
  }

  return recommendations;
};

/**
 * Calculate harvest prediction based on crop, soil, and weather
 * Formula: baseYield * nutrientFactor * weatherFactor
 * @param {string} crop - The crop type
 * @param {object} farmData - Farm data including soil values and size
 * @param {object} baseYieldData - Base yield data for crops
 * @param {object} weatherData - Weather forecast data
 * @returns {object} - Prediction object with yield, date, confidence
 */
export const calculateHarvestPrediction = (crop, farmData, baseYieldData, weatherData) => {
  if (!baseYieldData[crop]) {
    return {
      expectedYield: 0,
      harvestDate: null,
      confidence: 0,
      message: 'No data available for this crop'
    };
  }

  const cropData = baseYieldData[crop];
  const { baseYield, growthDays, idealSoilN, idealSoilP, idealSoilK, optimalTemp } = cropData;

  // Calculate nutrient factor (0.7 to 1.3 multiplier)
  const nFactor = 1 + (farmData.soilN - idealSoilN) / 100;
  const pFactor = 1 + (farmData.soilP - idealSoilP) / 100;
  const kFactor = 1 + (farmData.soilK - idealSoilK) / 100;
  const nutrientFactor = Math.max(0.7, Math.min(1.3, (nFactor + pFactor + kFactor) / 3));

  // Calculate weather factor based on average temperature
  let weatherFactor = 1.0;
  if (weatherData && weatherData.forecast) {
    const avgTemp = weatherData.forecast.reduce((sum, day) => sum + day.temp, 0) / weatherData.forecast.length;
    const avgRainfall = weatherData.forecast.reduce((sum, day) => sum + day.rainfall, 0) / weatherData.forecast.length;

    const tempDiff = Math.abs(avgTemp - optimalTemp);
    weatherFactor = 1.0 - (tempDiff * 0.01); // Reduce by 1% per degree difference

    // Adjust for rainfall
    if (cropData.waterRequirement === 'high' && avgRainfall < 5) {
      weatherFactor *= 0.95; // Reduce 5% for low rainfall on high water crops
    } else if (cropData.waterRequirement === 'low' && avgRainfall > 15) {
      weatherFactor *= 0.95; // Reduce 5% for high rainfall on low water crops
    }

    weatherFactor = Math.max(0.7, Math.min(1.2, weatherFactor));
  }

  // Calculate expected yield per hectare
  const yieldPerHectare = baseYield * nutrientFactor * weatherFactor;
  const totalYield = Math.round(yieldPerHectare * farmData.farmSize);

  // Calculate harvest date (assuming planting was recent)
  const today = new Date();
  const harvestDate = new Date(today.getTime() + (growthDays * 24 * 60 * 60 * 1000));

  // Calculate confidence (based on how close to ideal conditions)
  const nutrientConfidence = Math.max(0, 100 - (Math.abs(nFactor - 1) + Math.abs(pFactor - 1) + Math.abs(kFactor - 1)) * 30);
  const weatherConfidence = weatherFactor * 100;
  const confidence = Math.round((nutrientConfidence + weatherConfidence) / 2);

  return {
    expectedYield: totalYield,
    yieldPerHectare: Math.round(yieldPerHectare),
    harvestDate: harvestDate.toISOString().split('T')[0],
    daysToHarvest: growthDays,
    confidence: Math.min(95, Math.max(60, confidence)),
    nutrientFactor: nutrientFactor.toFixed(2),
    weatherFactor: weatherFactor.toFixed(2),
    message: confidence > 80 ? 'Excellent conditions for high yield' : confidence > 70 ? 'Good growing conditions' : 'Moderate conditions, monitor closely'
  };
};

/**
 * Calculate pest/disease risk based on crop, region, and weather
 * @param {string} crop - The crop type
 * @param {string} region - The region
 * @param {object} weatherData - Weather forecast data
 * @returns {object} - Risk assessment object
 */
export const calculatePestRisk = (crop, region, weatherData) => {
  // Rule-based pest risk calculation
  let riskLevel = 'Low';
  let riskScore = 20;
  const threats = [];

  // Check weather conditions
  if (weatherData && weatherData.forecast) {
    const avgHumidity = weatherData.forecast.reduce((sum, day) => sum + day.humidity, 0) / weatherData.forecast.length;
    const avgTemp = weatherData.forecast.reduce((sum, day) => sum + day.temp, 0) / weatherData.forecast.length;
    const rainyDays = weatherData.forecast.filter(day => day.rainfall > 5).length;

    // High humidity increases fungal disease risk
    if (avgHumidity > 65) {
      riskScore += 20;
      threats.push({ name: 'Fungal Diseases', reason: 'High humidity detected', prevention: 'Apply fungicide preventively' });
    }

    // Rainy conditions increase disease risk
    if (rainyDays >= 3) {
      riskScore += 15;
      threats.push({ name: 'Bacterial Blight', reason: 'Prolonged wet conditions', prevention: 'Ensure proper drainage' });
    }

    // Temperature-based pest risks
    if (avgTemp > 28 && crop === 'Cotton') {
      riskScore += 25;
      threats.push({ name: 'Bollworm', reason: 'High temperatures favor pest activity', prevention: 'Scout fields regularly, use pheromone traps' });
    }

    if (avgTemp > 30 && ['Tomato', 'Chilli'].includes(crop)) {
      riskScore += 20;
      threats.push({ name: 'Whitefly & Thrips', reason: 'Hot weather increases pest population', prevention: 'Use neem oil or yellow sticky traps' });
    }
  }

  // Crop-specific risks
  if (crop === 'Wheat' && region.includes('Punjab')) {
    riskScore += 15;
    threats.push({ name: 'Aphids', reason: 'Common in wheat during this season', prevention: 'Monitor and spray if threshold exceeded' });
  }

  if (crop === 'Rice') {
    riskScore += 10;
    threats.push({ name: 'Brown Plant Hopper', reason: 'Common rice pest', prevention: 'Maintain proper water levels, use resistant varieties' });
  }

  // Determine risk level
  if (riskScore > 60) {
    riskLevel = 'High';
  } else if (riskScore > 35) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
  }

  return {
    riskLevel,
    riskScore: Math.min(100, riskScore),
    threats: threats.length > 0 ? threats : [{ name: 'No immediate threats', reason: 'Conditions are favorable', prevention: 'Continue regular monitoring' }],
    recommendation: riskLevel === 'High' ? 'Take immediate preventive action' : riskLevel === 'Medium' ? 'Monitor closely and prepare preventive measures' : 'Continue routine monitoring'
  };
};

/**
 * Calculate market insights for vendors
 * @param {array} farmers - Array of farmer data
 * @param {array} produce - Array of produce listings
 * @param {string} vendorRegion - Vendor's region
 * @returns {object} - Market insights object
 */
export const calculateMarketInsights = (farmers, produce, vendorRegion) => {
  // Count crops by region
  const cropDemand = {};
  const regionalDemand = {};

  farmers.forEach(farmer => {
    farmer.crops.forEach(crop => {
      cropDemand[crop] = (cropDemand[crop] || 0) + 1;

      if (!regionalDemand[farmer.region]) {
        regionalDemand[farmer.region] = {};
      }
      regionalDemand[farmer.region][crop] = (regionalDemand[farmer.region][crop] || 0) + 1;
    });
  });

  // Calculate trending crops (top 5)
  const trendingCrops = Object.entries(cropDemand)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([crop, count], index) => ({
      crop,
      demandScore: Math.min(100, count * 20),
      trend: index === 0 ? 'up' : 'stable',
      farmerCount: count
    }));

  // Calculate recommended regions to target
  const regionScores = Object.entries(regionalDemand).map(([region, crops]) => {
    const farmerCount = farmers.filter(f => f.region === region).length;
    const cropVariety = Object.keys(crops).length;
    const score = farmerCount * 10 + cropVariety * 5;

    return {
      region,
      score,
      farmerCount,
      topCrops: Object.entries(crops)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([crop]) => crop)
    };
  }).sort((a, b) => b.score - a.score);

  // Produce availability
  const produceStats = {
    totalListings: produce.length,
    byRegion: produce.reduce((acc, p) => {
      acc[p.region] = (acc[p.region] || 0) + 1;
      return acc;
    }, {})
  };

  return {
    trendingCrops,
    recommendedRegions: regionScores.slice(0, 4),
    produceStats,
    insights: [
      `${trendingCrops[0]?.crop || 'Wheat'} is in high demand with ${trendingCrops[0]?.farmerCount || 0} farmers growing it.`,
      `${regionScores[0]?.region || vendorRegion} region has the most active farmers (${regionScores[0]?.farmerCount || 0}).`,
      `${produce.length} produce listings available across all regions.`
    ]
  };
};
