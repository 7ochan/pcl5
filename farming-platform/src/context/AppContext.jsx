import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Data states
  const [farmers, setFarmers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [produce, setProduce] = useState([]);
  const [weather, setWeather] = useState({});
  const [baseYield, setBaseYield] = useState({});

  // Cart state
  const [cart, setCart] = useState([]);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Load mock data on mount
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    try {
      const [farmersRes, vendorsRes, productsRes, produceRes, weatherRes, yieldRes] = await Promise.all([
        fetch('/data/mock-farmers.json'),
        fetch('/data/mock-vendors.json'),
        fetch('/data/mock-products.json'),
        fetch('/data/mock-produce.json'),
        fetch('/data/mock-weather.json'),
        fetch('/data/baseYield.json'),
      ]);

      setFarmers(await farmersRes.json());
      setVendors(await vendorsRes.json());
      setProducts(await productsRes.json());
      setProduce(await produceRes.json());
      setWeather(await weatherRes.json());
      setBaseYield(await yieldRes.json());
    } catch (error) {
      console.error('Error loading mock data:', error);
    }
  };

  // Auth functions
  const login = (username, password, role) => {
    // Fake login - accepts any credentials
    let userData;
    if (role === 'Farmer') {
      userData = farmers.find(f => f.username === username) || farmers[0];
    } else {
      userData = vendors.find(v => v.username === username) || vendors[0];
    }

    setUser({ ...userData, role });
    setIsAuthenticated(true);
    addToast('Login successful!', 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCart([]);
    addToast('Logged out successfully', 'info');
  };

  // Farmer functions
  const updateFarmDetails = (farmId, updates) => {
    setFarmers(prev =>
      prev.map(f => f.id === farmId ? { ...f, ...updates } : f)
    );
    if (user && user.id === farmId) {
      setUser({ ...user, ...updates });
    }
    addToast('Farm details updated successfully', 'success');
  };

  const addProduce = (produceData) => {
    const newProduce = {
      ...produceData,
      id: `pr${Date.now()}`,
      farmerId: user.id,
      farmerName: user.name,
      farmName: user.farmName,
      location: user.location,
      region: user.region,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProduce(prev => [...prev, newProduce]);
    addToast('Produce listing created successfully', 'success');
  };

  const updateProduce = (produceId, updates) => {
    setProduce(prev =>
      prev.map(p => p.id === produceId ? { ...p, ...updates } : p)
    );
    addToast('Produce listing updated', 'success');
  };

  const deleteProduce = (produceId) => {
    setProduce(prev => prev.filter(p => p.id !== produceId));
    addToast('Produce listing deleted', 'info');
  };

  // Vendor functions
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: `p${Date.now()}`,
      vendorId: user.id,
      vendorName: user.businessName,
      rating: 0,
    };
    setProducts(prev => [...prev, newProduct]);
    addToast('Product added successfully', 'success');
  };

  const updateProduct = (productId, updates) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
    addToast('Product updated', 'success');
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addToast('Product deleted', 'info');
  };

  // Cart functions
  const addToCart = (item) => {
    const existingItem = cart.find(c => c.id === item.id);
    if (existingItem) {
      setCart(prev =>
        prev.map(c =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart(prev => [...prev, { ...item, quantity: 1 }]);
    }
    addToast('Added to cart', 'success');
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(c => c.id !== itemId));
    addToast('Removed from cart', 'info');
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(c => c.id === itemId ? { ...c, quantity } : c)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = () => {
    // Simulate checkout
    addToast(`Order placed successfully! Total items: ${cart.length}`, 'success');
    clearCart();
  };

  // Toast functions
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Reset demo data
  const resetDemoData = () => {
    loadMockData();
    setCart([]);
    addToast('Demo data reset successfully', 'info');
  };

  const value = {
    // State
    user,
    isAuthenticated,
    farmers,
    vendors,
    products,
    produce,
    weather,
    baseYield,
    cart,
    toasts,
    // Auth
    login,
    logout,
    // Farmer
    updateFarmDetails,
    addProduce,
    updateProduce,
    deleteProduce,
    // Vendor
    addProduct,
    updateProduct,
    deleteProduct,
    // Cart
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    checkout,
    // Utils
    addToast,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
