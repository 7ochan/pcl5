# Smart AI-Driven Farming & Vendor Platform - MVP

## Project Overview

This is a **Minimum Viable Product (MVP)** prototype of the Smart AI-Driven Farming & Vendor Platform, built as a fully interactive client-side application. It demonstrates the complete user interface and user experience flows for both farmers and vendors, using mock data and simulated AI calculations.

**🚀 Live Demo:** Simply open the application and use demo/demo to login (or any credentials).

## ⚠️ Important Notes

This is a **prototype/MVP** with the following intentional limitations:

### ✅ What IS Implemented:
- ✓ Fake authentication (accepts any credentials)
- ✓ Client-side routing and navigation
- ✓ Mock data stored in browser memory
- ✓ Deterministic AI calculations (soil recommendations, harvest predictions, pest risk)
- ✓ Full farmer dashboard with farm management
- ✓ Full vendor dashboard with product management
- ✓ Marketplace (buy inputs & produce)
- ✓ Shopping cart functionality
- ✓ Community forum with posts and comments
- ✓ Fully responsive mobile-first design
- ✓ Toast notifications

### ❌ What is NOT Implemented (by design):
- ✗ Real user authentication/authorization
- ✗ Backend database or API
- ✗ Image uploads or CNN-based AI features
- ✗ Real payment processing
- ✗ Admin panel
- ✗ Data persistence (refreshing the page reloads mock data)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Running

1. **Navigate to the project directory:**
   ```bash
   cd farming-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will typically run at `http://localhost:5173`
   - You'll see the URL in your terminal

5. **Login:**
   - Click either "Farmer Demo" or "Vendor Demo" on the landing page
   - Use any credentials (or demo/demo)
   - Or use the quick login buttons

---

## 📁 Project Structure

```
farming-platform/
├── public/
│   └── data/                    # Mock JSON data files
│       ├── mock-farmers.json
│       ├── mock-vendors.json
│       ├── mock-products.json
│       ├── mock-produce.json
│       ├── mock-weather.json
│       └── baseYield.json
├── src/
│   ├── components/              # Reusable components
│   │   ├── Navigation.jsx
│   │   └── Toast.jsx
│   ├── pages/                   # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── FarmerDashboard.jsx
│   │   ├── VendorDashboard.jsx
│   │   ├── Marketplace.jsx
│   │   ├── Community.jsx
│   │   └── Profile.jsx
│   ├── context/
│   │   └── AppContext.jsx      # Global state management
│   ├── utils/
│   │   └── aiCalculations.js   # AI simulation functions
│   ├── App.jsx                  # Main app component
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 📊 Mock Data Files

All mock data is stored in `public/data/` and loaded on app startup.

### mock-farmers.json
Contains 4 demo farmer profiles with:
- Farm details (name, location, size, crops)
- Soil nutrient values (N, P, K)
- Region information

### mock-vendors.json
Contains 3 demo vendor profiles with:
- Business information
- Region and rating
- Years in business

### mock-products.json
Contains 8 vendor products across categories:
- Seeds
- Fertilizers
- Pesticides
- Equipment
- Services

### mock-produce.json
Contains 2 initial produce listings from farmers.

### mock-weather.json
7-day weather forecasts for 4 regions (Punjab, Maharashtra, Uttar Pradesh, Andhra Pradesh).

### baseYield.json
Base yield data for 8 crops used in harvest prediction calculations.

---

## 🤖 AI Calculations (Deterministic Logic)

All "AI" features are implemented as **deterministic, rule-based calculations** for demonstration purposes. The actual logic is transparent and reproducible.

### 1. Soil Recommendations (`calculateSoilRecommendations`)

**Location:** `src/utils/aiCalculations.js:11-82`

**Logic:**
```javascript
// Compare actual NPK values with ideal values for the crop
if (actualN < idealN - 10) → Critical deficiency
if (actualN < idealN) → Slight deficiency
if (actualN > idealN + 15) → Excess warning
else → Optimal level
```

**Inputs:**
- Crop type
- Current soil N, P, K values
- Base yield data (ideal N, P, K for each crop)

**Outputs:**
- Array of recommendations with priority levels (high/medium/low)
- Specific fertilizer suggestions
- Visual indicators (🔴🟡🟢)

### 2. Harvest Prediction (`calculateHarvestPrediction`)

**Location:** `src/utils/aiCalculations.js:93-173`

**Formula:**
```
Expected Yield = baseYield × nutrientFactor × weatherFactor × farmSize

Where:
- nutrientFactor = average((N/idealN), (P/idealP), (K/idealK))
- weatherFactor = based on temp deviation from optimal and rainfall
- Range clamped between 0.7 and 1.3
```

**Inputs:**
- Crop type
- Farm size (hectares)
- Soil NPK values
- Weather data (temperature, rainfall)

**Outputs:**
- Expected total yield (kg)
- Yield per hectare
- Harvest date (current date + growth days)
- Confidence percentage (60-95%)
- Calculation factors shown transparently

**Example Calculation:**
```
Crop: Wheat
Base Yield: 3500 kg/ha
Farm Size: 25 ha
Nutrient Factor: 1.05 (5% above ideal)
Weather Factor: 0.98 (temp slightly off optimal)

Expected Yield = 3500 × 1.05 × 0.98 × 25 = 90,563 kg
```

### 3. Pest Risk Assessment (`calculatePestRisk`)

**Location:** `src/utils/aiCalculations.js:181-253`

**Logic:**
```javascript
Base risk = 20
+ High humidity (>65%) → +20 risk
+ Rainy days (>3 days) → +15 risk
+ High temp for specific crops → +20-25 risk
+ Crop-region specific threats → +10-15 risk

Risk Level:
- Score > 60 → High Risk
- Score > 35 → Medium Risk
- Score ≤ 35 → Low Risk
```

**Inputs:**
- Crop type
- Region
- Weather forecast (humidity, temp, rainfall)

**Outputs:**
- Risk level (High/Medium/Low)
- Risk score (0-100)
- List of potential threats with prevention methods
- Actionable recommendations

### 4. Market Insights (`calculateMarketInsights`)

**Location:** `src/utils/aiCalculations.js:262-318`

**Logic:**
```javascript
// Count crop frequency across farmers
Demand Score = (farmer count × 20), capped at 100

// Regional scoring
Score = (farmerCount × 10) + (cropVariety × 5)
```

**Inputs:**
- All farmers data
- All produce listings
- Vendor region

**Outputs:**
- Top 5 trending crops with demand scores
- Recommended target regions
- Produce availability statistics
- Market insights summary

---

## 🎨 Features Guide

### Farmer Features

#### Dashboard
- **Farm Overview:** View and edit farm details, soil data
- **AI Insights:**
  - 7-day weather forecast
  - Soil NPK recommendations
  - Harvest prediction with confidence
  - Pest/disease risk assessment
- **My Produce:** Create, view, and delete produce listings

#### Marketplace
- Browse and purchase farming inputs (seeds, fertilizers, equipment)
- Add items to cart and checkout
- View produce from other farmers

#### Community
- Create posts in different categories
- Upvote posts and comments
- Mark helpful comments
- Engage in discussions

### Vendor Features

#### Dashboard
- **Overview:** Business stats and quick insights
- **Products:** Add, edit, and delete product listings
- **Market Insights:**
  - Trending crops by demand
  - Recommended target regions
  - Produce availability stats
- **Targeted Offers:** Filter and send offers to specific farmers

#### Marketplace
- Same as farmers (buy and sell)

#### Community
- Same forum access as farmers

---

## 📱 Mobile Responsiveness

The application is built with a **mobile-first** approach:

- **Breakpoint:** `md:` (768px)
- **Mobile Navigation:** Bottom navigation bar + hamburger menu
- **Desktop Navigation:** Top horizontal navigation bar
- **Responsive Grids:** Automatically adjust columns based on screen size
- **Touch-Friendly:** All interactive elements are sized for mobile use

---

## 🔧 Developer Notes

### State Management
- Uses React Context API (`AppContext.jsx`)
- State stored in browser memory (not persistent)
- Centralized actions for all CRUD operations

### Routing
- Client-side routing using state (`currentPage`)
- No external router library (lightweight approach)
- Navigation via `navigate()` function passed as props

### Styling
- **Tailwind CSS** for all styling
- Custom animations defined in `index.css`
- Consistent color scheme (green for farmers, blue for vendors)

### Data Flow
```
Mock JSON Files → AppContext (on mount)
                       ↓
                  Components consume via useApp() hook
                       ↓
                  User actions update state
                       ↓
                  Re-renders with new data
```

### Toast Notifications
- Auto-dismiss after 3 seconds
- Slide-in animation from right
- Types: success, error, info

### Adding New Features

**To add a new crop:**
1. Add entry to `public/data/baseYield.json`
2. Update dropdown options in `FarmerDashboard.jsx`

**To add a new region:**
1. Add forecast to `public/data/mock-weather.json`
2. Update region filters throughout the app

**To add a new product category:**
1. Update category dropdowns in `VendorDashboard.jsx` and `Marketplace.jsx`

---

## 🔄 Switching to Real Backend

To convert this MVP to use a real backend:

1. **Replace Context API** with proper state management (Redux/Zustand)
2. **Replace mock data loads** in `AppContext.jsx` with API calls
3. **Replace AI calculations** with actual API endpoints
4. **Add authentication** - replace `login()` with JWT/OAuth flow
5. **Add image handling** - implement file uploads for profile/product images
6. **Add persistence** - all CRUD operations should call backend APIs

**Suggested API Structure:**
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/farmers
POST   /api/farmers/:id/produce
GET    /api/products
POST   /api/products
GET    /api/ai/soil-recommendations
GET    /api/ai/harvest-prediction
GET    /api/ai/pest-risk
```

---

## 🐛 Known Limitations

1. **No Data Persistence:** Refreshing the page resets all data to initial mock state
2. **Single User Session:** No support for multiple concurrent user sessions
3. **No Real Messaging:** "Express Interest" and "Send Offer" only log to console
4. **No Image Support:** All product/produce listings are text-only
5. **Simplified Cart:** No proper order management or history

---

## 📝 Testing the App

### Test Scenarios

**As a Farmer:**
1. Login as farmer (quick login or demo/demo)
2. Edit farm details and soil values
3. View AI insights - notice how changing soil values affects recommendations
4. Create a produce listing
5. Go to marketplace and buy some inputs
6. Visit community and create a post
7. Export your produce listings as CSV

**As a Vendor:**
1. Login as vendor (quick login)
2. Add a new product
3. View market insights - see trending crops
4. Create a targeted offer by filtering farmers
5. Visit marketplace and express interest in produce
6. Export your product listings

**Cross-Testing:**
1. Switch roles using Profile > Settings > Switch Role
2. Verify listings created in one role appear in marketplace for other role

---

## 📄 License

This is an MVP/prototype project for demonstration purposes.

---

## 🙋 Support

For questions or issues with this MVP:
- Check the code comments in `src/utils/aiCalculations.js` for AI logic
- Review `src/context/AppContext.jsx` for state management
- All UI components are documented with comments

---

## 🎯 Acceptance Criteria Checklist

- ✅ Fake login screen (accepts any credentials)
- ✅ No real database (uses browser memory)
- ✅ No image uploads or CNN AI
- ✅ Fully responsive mobile-first UI
- ✅ React + Tailwind CSS SPA
- ✅ Landing page with role selection
- ✅ Farmer dashboard with all sections
- ✅ Vendor dashboard with all sections
- ✅ Marketplace with tabs and cart
- ✅ Community hub with forum
- ✅ Profile/settings page
- ✅ All AI insights simulated deterministically
- ✅ Mock data in JSON files
- ✅ README with instructions
- ✅ CSV export functionality

---

**Built with ❤️ for demonstration purposes**
