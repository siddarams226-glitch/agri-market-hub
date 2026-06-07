import React, { useState, useEffect } from 'react';

// Hardcoded initial data with realistic image fallbacks, soil technical metrics, and new user ratings
const INITIAL_PRODUCTS = [
  { 
    id: 1, 
    name: 'Premium Basmati Rice', 
    category: 'Grains', 
    price: 4500, 
    unit: 'Quintal',
    quantity: 15, 
    location: 'Gulbarga, Karnataka', 
    farmer: 'Siddaram BN',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    soilPh: '6.5 (Optimal)',
    soilNPK: 'N: 45, P: 30, K: 40 (High Fertility)',
    rating: 4.8
  },
  { 
    id: 2, 
    name: 'Organic Toor Dal (Pigeon Peas)', 
    category: 'Grains', 
    price: 9200, 
    unit: 'Quintal',
    quantity: 25, 
    location: 'Gulbarga, Karnataka', 
    farmer: 'Siddaram BN',
    image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?auto=format&fit=crop&w=600&q=80',
    soilPh: '7.2 (Neutral-Calcareous)',
    soilNPK: 'N: 20, P: 45, K: 35 (Excellent Phosphate)',
    rating: 4.9
  },
  { 
    id: 3, 
    name: 'Premium Sharbati Wheat', 
    category: 'Grains', 
    price: 3100, 
    unit: 'Quintal',
    quantity: 40, 
    location: 'Hubli, Karnataka', 
    farmer: 'Rajesh M.',
    image: 'https://images.unsplash.com/photo-1574325131876-a7999d943b4d?auto=format&fit=crop&w=600&q=80',
    soilPh: '6.8 (Optimal loamy)',
    soilNPK: 'N: 50, P: 35, K: 30 (Rich Nitrogen)',
    rating: 4.6
  },
  { 
    id: 4, 
    name: 'Organic Tomatoes', 
    category: 'Vegetables', 
    price: 2200, 
    unit: 'Quintal',
    quantity: 5, 
    location: 'Sullia, Karnataka', 
    farmer: 'Anand Kumar',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
    soilPh: '6.2 (Slightly Acidic)',
    soilNPK: 'N: 35, P: 40, K: 45 (Good)',
    rating: 4.4
  },
  { 
    id: 5, 
    name: 'Crisp Ooty Carrots', 
    category: 'Vegetables', 
    price: 3500, 
    unit: 'Quintal',
    quantity: 12, 
    location: 'Sullia, Karnataka', 
    farmer: 'Anand Kumar',
    image: 'https://images.unsplash.com/photo-1598170845058-32b996a69427?auto=format&fit=crop&w=600&q=80',
    soilPh: '6.0 (Slightly Acidic)',
    soilNPK: 'N: 30, P: 30, K: 50 (High Potassium)',
    rating: 4.7
  },
  { 
    id: 6, 
    name: 'Kashmiri Apples', 
    category: 'Fruits', 
    price: 12000, 
    unit: 'Box',
    quantity: 50, 
    location: 'Hubli, Karnataka', 
    farmer: 'Rajesh M.',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    soilPh: '5.8 (Moderate)',
    soilNPK: 'N: 20, P: 25, K: 50 (Rich Potassium)',
    rating: 4.9
  },
  { 
    id: 7, 
    name: 'Devgad Alphonso Mangoes', 
    category: 'Fruits', 
    price: 1500, 
    unit: 'Box',
    quantity: 100, 
    location: 'Sullia, Karnataka', 
    farmer: 'Anand Kumar',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    soilPh: '6.5 (Laterite Rich)',
    soilNPK: 'N: 25, P: 20, K: 45 (Optimal)',
    rating: 4.8
  },
  { 
    id: 8, 
    name: 'Bangalore Blue Grapes', 
    category: 'Fruits', 
    price: 6000, 
    unit: 'Quintal',
    quantity: 8, 
    location: 'Gulbarga, Karnataka', 
    farmer: 'Siddaram BN',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
    soilPh: '5.5 (Acidic Red Soil)',
    soilNPK: 'N: 40, P: 20, K: 40 (Balanced)',
    rating: 4.5
  }
];

export default function App() {
  // Authentication Gateway States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '', phone: '' });

  // Navigation & Marketplace States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState('marketplace'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Cart States
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState('review'); 
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [addressData, setAddressData] = useState({ fullName: '', phone: '', fullAddress: '', state: '', pincode: '' });
  const [paymentDetails, setPaymentDetails] = useState({ upiId: '', cardNumber: '', expiry: '', cvv: '' });

  // Custom Toast Popup State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Company Profile Information State
  const [ownerProfile, setOwnerProfile] = useState({
    companyName: 'Agri Market Hub Private Limited',
    founderName: 'Siddaram BN',
    role: 'Managing Director & Founder',
    email: 'contact@agrimarkethub.com',
    phone: '+91 94811 XXXXX',
    headquarters: 'Gulbarga, Karnataka, India',
    vision: 'To empower regional Indian farmers with full tech-driven direct marketing infrastructures, removing exploitation and securing soil health mapping clarity.'
  });

  // Auto-dismiss Toast handler
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Auth Handlers
  const handleAuthInputChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (!authForm.username || !authForm.password) {
        setToast({ show: true, message: '⚠️ Please fill out all login credentials.', type: 'warning' });
        return;
      }
      setIsLoggedIn(true);
      setToast({ show: true, message: `🔓 Welcome back, ${authForm.username}! Session active.`, type: 'success' });
    } else {
      if (!authForm.username || !authForm.email || !authForm.password) {
        setToast({ show: true, message: '⚠️ Please complete all registry blanks.', type: 'warning' });
        return;
      }
      setToast({ show: true, message: '🎉 Registration complete! Logging you in...', type: 'success' });
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCart([]);
    setAuthForm({ username: '', email: '', password: '', phone: '' });
    setToast({ show: true, message: '🔒 Logged out safely from system core.', type: 'info' });
  };

  // Product Creation Handlers
  const [formData, setFormData] = useState({
    name: '', category: 'Grains', price: '', unit: 'Quintal', quantity: '', location: '',
    image: '', soilPh: '6.5', soilNPK: 'N: 40, P: 30, K: 30', rating: '4.5'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: Number(formData.price) || 2000,
      unit: formData.unit,
      quantity: Number(formData.quantity) || 10,
      location: formData.location,
      farmer: ownerProfile.founderName + ' (You)',
      image: formData.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
      soilPh: `${formData.soilPh} (Declared)`,
      soilNPK: formData.soilNPK,
      rating: parseFloat(formData.rating) || 4.5
    };

    setProducts([newProduct, ...products]);
    setFormData({ name: '', category: 'Grains', price: '', unit: 'Quintal', quantity: '', location: '', image: '', soilPh: '6.5', soilNPK: 'N: 40, P: 30, K: 30', rating: '4.5' });
    
    setToast({ show: true, message: `🎉 "${formData.name}" published successfully!`, type: 'success' });
    setActiveTab('marketplace');
  };

  // Cart Actions
  const addToCart = (product) => {
    if (cart.find(item => item.id === product.id)) {
      setToast({ show: true, message: `⚠️ "${product.name}" is already in your basket!`, type: 'warning' });
      return;
    }
    setCart([...cart, product]);
    setToast({ show: true, message: `🛒 Added "${product.name}" to cart!`, type: 'success' });
  };

  const removeFromCart = (id) => {
    const item = cart.find(i => i.id === id);
    setCart(cart.filter(item => item.id !== id));
    setToast({ show: true, message: `🗑️ Removed "${item?.name || 'Item'}" from cart.`, type: 'info' });
  };

  // Calculations & Analytics Math Expressions
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const deliveryCharges = cartSubtotal > 10000 ? 0 : 150;
  const platformFee = 49;
  const totalPayable = cartSubtotal + deliveryCharges + platformFee;

  // Real-time Dashboard Analytics Aggregates
  const totalMarketValuation = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const averageCropPrice = Math.round(products.reduce((acc, item) => acc + item.price, 0) / products.length);
  const totalStockVolume = products.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const submitOrder = (e) => {
    e.preventDefault();
    setCheckoutStep('success');
  };

  const resetOrderWorkflow = () => {
    setCart([]);
    setCheckoutStep('review');
    setActiveTab('marketplace');
  };

  // Filter Combinator logic (Search Box + Category Tabs)
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dynamic maximum value calculation for chart scaling limits
  const maxPriceInCatalog = Math.max(...products.map(p => p.price));

  // ================= RENDER INTERFACES =================

  // LOGIN SCREEN (CREATIVE DARK MESH DESIGN)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans antialiased relative overflow-hidden">
        
        {/* Creative Ambient Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Abstract Fine Geometric Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none"></div>

        {/* Toast Notification Container */}
        {toast.show && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center px-4 py-3 rounded-xl shadow-2xl text-white font-medium text-xs bg-slate-900 border border-slate-700/80 backdrop-blur-md">
            <span>{toast.message}</span>
          </div>
        )}

        {/* Glassmorphic Glowing Login Box Container */}
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-xl overflow-hidden transform transition-all relative z-10">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-center text-white space-y-1 relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px] pointer-events-none"></div>
            <span className="text-3xl filter drop-shadow">🌾</span>
            <h1 className="text-xl font-black tracking-wide">Agri Market Hub</h1>
            <p className="text-[11px] text-emerald-200 uppercase tracking-widest font-semibold">Central Administrative Gate</p>
          </div>

          <div className="p-6">
            <h2 className="text-sm font-bold text-slate-300 mb-4 text-center tracking-wide uppercase">
              {authMode === 'login' ? 'Sign In to Your Workspace' : 'Register Corporate Operator ID'}
            </h2>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Account Identity Name</label>
                <input type="text" name="username" required value={authForm.username} onChange={handleAuthInputChange} placeholder="e.g., Siddaram BN" className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all" />
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Corporate Email Box</label>
                    <input type="email" name="email" required={authMode === 'register'} value={authForm.email} onChange={handleAuthInputChange} placeholder="name@company.com" className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all" />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Mobile Contact String</label>
                    <input type="tel" name="phone" value={authForm.phone} onChange={handleAuthInputChange} placeholder="+91 XXXXX XXXXX" className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Secret Password Key</label>
                <input type="password" name="password" required value={authForm.password} onChange={handleAuthInputChange} placeholder="••••••••" className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg tracking-wider uppercase transition-all transform active:scale-[0.99] mt-2">
                {authMode === 'login' ? 'Authenticate Identity ➔' : 'Finalize Profile Register ➔'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
              {authMode === 'login' ? (
                <p>New operator around here? <button onClick={() => setAuthMode('register')} className="text-emerald-400 font-bold hover:underline">Create an account</button></p>
              ) : (
                <p>Already have an active profile? <button onClick={() => setAuthMode('login')} className="text-emerald-400 font-bold hover:underline">Sign In here</button></p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN SECURE MARKETPLACE SYSTEM (CREATIVE LIGHT TECH BACKDROP)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased relative overflow-hidden">
      
      {/* Creative Floating Background Blobs for Light UI */}
      <div className="absolute top-[15%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-100/40 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[35rem] h-[35rem] bg-amber-50/60 rounded-full blur-[110px] pointer-events-none z-0"></div>
      <div className="absolute top-[50%] left-[25%] w-[25rem] h-[25rem] bg-teal-50/50 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Structural technical graph lines across the application canvas */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30 pointer-events-none z-0"></div>

      {/* REUSABLE ANIMATED POPUP TOAST MESSAGE */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium text-xs border transform transition-all duration-300 translate-y-0 scale-100 animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
          toast.type === 'warning' ? 'bg-amber-600 border-amber-500' : 'bg-slate-700 border-slate-600'
        }`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 font-bold opacity-70 hover:opacity-100 text-sm">&times;</button>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
              <span className="text-2xl">🌾</span>
              <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">Agri Market Hub</span>
            </div>
            <div className="flex space-x-1 items-center">
              <button onClick={() => setActiveTab('marketplace')} className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'marketplace' ? 'bg-emerald-900/60 font-bold shadow-inner border-b-2 border-amber-400 text-white' : 'hover:bg-emerald-700/50 text-emerald-100'}`}>
                Market
              </button>
              <button onClick={() => setActiveTab('analytics')} className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-emerald-900/60 font-bold shadow-inner border-b-2 border-amber-400 text-white' : 'hover:bg-emerald-700/50 text-emerald-100'}`}>
                📈 Analytics
              </button>
              <button onClick={() => setActiveTab('list-crop')} className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list-crop' ? 'bg-emerald-900/60 font-bold shadow-inner border-b-2 border-amber-400 text-white' : 'hover:bg-emerald-700/50 text-emerald-100'}`}>
                👨‍🌾 Farmer Portal
              </button>
              <button onClick={() => setActiveTab('profile')} className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-emerald-900/60 font-bold shadow-inner border-b-2 border-amber-400 text-white' : 'hover:bg-emerald-700/50 text-emerald-100'}`}>
                🏢 Profile
              </button>
              <button onClick={() => { setActiveTab('cart'); setCheckoutStep('review'); }} className={`ml-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black text-xs flex items-center space-x-1 shadow-md transition-transform active:scale-95`}>
                <span>🛒 Cart ({cart.length})</span>
              </button>
              <button onClick={handleLogout} className="ml-3 px-2.5 py-1.5 text-xs font-bold border border-emerald-600 rounded-md hover:bg-emerald-700/40 text-emerald-200">
                Logout 🔒
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* VIEW 1: PRODUCT MARKETPLACE BROWSER WITH SIDEBAR FILTERS */}
        {activeTab === 'marketplace' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Direct Farm Marketplace</h2>
                <p className="text-xs text-slate-500">Welcome, <span className="font-bold text-emerald-700">{authForm.username}</span>. Examine crop pictures, verified ratings, and direct laboratory soil summaries before procurement.</p>
              </div>
              <div className="w-full sm:w-72">
                <input type="text" placeholder="🔍 Search crops or locations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white/80 backdrop-blur shadow-sm transition-all" />
              </div>
            </div>

            {/* Advanced Category Filter Tabs Row */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200/60 pb-4">
              {['All', 'Grains', 'Vegetables', 'Fruits'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10 scale-105' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'All' ? '🌾 All Crop Assortments' : cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transform transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold uppercase bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded shadow">
                          {product.category}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                          ⭐ {product.rating}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">{product.name}</h3>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">📍 {product.location}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2.5">Grower: {product.farmer}</p>
                      
                      {/* Soil Health Segment */}
                      <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/40 border border-amber-200/60 p-2.5 rounded-lg text-[11px] space-y-0.5 mb-3.5 shadow-inner">
                        <div className="text-amber-800 font-bold uppercase tracking-wide text-[9px] flex items-center space-x-1">
                          <span>🔬</span> <span>Soil Quality Index</span>
                        </div>
                        <div><span className="text-slate-500">pH Level:</span> <span className="text-slate-800 font-semibold">{product.soilPh}</span></div>
                        <div><span className="text-slate-500">NPK Balance:</span> <span className="text-slate-800 font-semibold">{product.soilNPK}</span></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-50/80 border border-slate-100 p-2 rounded-lg text-xs">
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Mandi Price</span>
                          <span className="font-black text-emerald-700">₹{product.price.toLocaleString('en-IN')} / {product.unit}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Net Stock</span>
                          <span className="font-bold text-slate-700">{product.quantity} {product.unit}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 pt-0">
                    <button onClick={() => addToCart(product)} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-md transition-all active:scale-[0.97]">
                      🌱 Procure Asset Batch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: FAST-TRACK CUSTOM ANALYTICS DASHBOARD CARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Market Logistics Analytics Dashboard</h2>
              <p className="text-xs text-slate-500">Real-time agricultural asset summary metrics compiled straight from active open-market ledger listings.</p>
            </div>

            {/* High-Level Tracking Counter Indicators Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white p-4 rounded-xl shadow-md border border-emerald-700">
                <span className="text-[10px] uppercase tracking-wider font-bold opacity-75">Gross Local Market Valuation</span>
                <div className="text-2xl font-black mt-1">₹{totalMarketValuation.toLocaleString('en-IN')}</div>
                <p className="text-[9px] text-emerald-200 mt-2">📊 Consolidated pricing asset pool cap</p>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Average Mandi Crop Valuation</span>
                <div className="text-2xl font-black text-slate-800 mt-1">₹{averageCropPrice.toLocaleString('en-IN')}</div>
                <p className="text-[9px] text-slate-400 mt-2">📈 Mean baseline metric per unit volume</p>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Consolidated Active Stock Volume</span>
                <div className="text-2xl font-black text-slate-800 mt-1">{totalStockVolume} Units</div>
                <p className="text-[9px] text-slate-400 mt-2">📦 Cumulative freight weight listed in portal</p>
              </div>
            </div>

            {/* Customized Visual Chart Container Layout */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-1.5">
                <span>📊</span> Pricing Disparity Spectrum (Rate per Unit Volume)
              </h3>

              {/* Graphical Bar Structure */}
              <div className="space-y-4">
                {products.map((p) => {
                  // Calculate percentage width mapping ratio values
                  const barPercentage = Math.round((p.price / maxPriceInCatalog) * 100);
                  return (
                    <div key={p.id} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 text-xs">
                      <div className="font-bold text-slate-700 truncate sm:pr-4">
                        {p.name}
                      </div>
                      <div className="sm:col-span-3 flex items-center space-x-3">
                        <div className="w-full bg-slate-100 h-6 rounded-md overflow-hidden relative border border-slate-100 shadow-inner">
                          <div 
                            style={{ width: `${barPercentage}%` }} 
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full transition-all duration-1000 shadow-md relative"
                          >
                            <span className="absolute right-2 top-1 text-[9px] font-black text-white drop-shadow-sm">
                              {barPercentage}%
                            </span>
                          </div>
                        </div>
                        <div className="font-black text-slate-900 min-w-[70px] text-right">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Min Bound: ₹0</span>
                <span>Max Peak Scale Variant: ₹{maxPriceInCatalog.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: FARMER PORTAL FILE UPLOAD */}
        {activeTab === 'list-crop' && (
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur border border-slate-200/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
            <h2 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">List Harvest Batch Assets</h2>
            <p className="text-xs text-slate-400 mb-5">Provide clear crop showcase photos and verified soil parameters to setup buyer credibility.</p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop / Grain Variety Name</label>
                <input type="text" required name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Premium Sona Masuri" className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white">
                    <option value="Grains">Grains / Pulses</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mandi Harvest Location</label>
                  <input type="text" required name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Gulbarga Mandi" className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Banner Picture Link (URL)</label>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="Paste reference photo link" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Batch Quality Rating (1.0 - 5.0)</label>
                  <input type="number" step="0.1" max="5" min="1" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 grid grid-cols-2 gap-4 shadow-inner">
                <div>
                  <label className="block font-bold text-amber-900 mb-1">Farm Lab Soil pH</label>
                  <input type="text" name="soilPh" value={formData.soilPh} onChange={handleInputChange} placeholder="e.g., 6.4" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-1">NPK Chemical Comp (N:P:K)</label>
                  <input type="text" name="soilNPK" value={formData.soilNPK} onChange={handleInputChange} placeholder="e.g., N: 40, P: 30, K: 42" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Rate Price per Unit (INR)</label>
                  <input type="number" required name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., 4200" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pricing Unit</label>
                  <select name="unit" value={formData.unit} onChange={handleInputChange} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white">
                    <option value="Quintal">Per Quintal</option>
                    <option value="Box">Per Box</option>
                    <option value="Kg">Per Kg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Continuous Load Vol (Units)</label>
                <input type="number" required name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="e.g., 30" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100 text-sm">
                <button type="button" onClick={() => setActiveTab('marketplace')} className="px-4 py-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold rounded-lg shadow-md transition-all">Publish Crop Record</button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 4: COMPANY OWNER PROFILE PAGE */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-2xl border border-slate-200 overflow-hidden shadow-2xl relative">
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 h-32 relative">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px] pointer-events-none"></div>
              <div className="absolute -bottom-10 left-8 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 font-black text-2xl rounded-full h-24 w-24 flex items-center justify-center border-4 border-white shadow-xl">
                SBN
              </div>
            </div>
            <div className="pt-14 px-8 pb-8 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{ownerProfile.founderName}</h2>
                  <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">{ownerProfile.role}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{ownerProfile.companyName}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-inner border border-emerald-100/50">
                  ⭐ Core Administrator
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3 bg-slate-50/80 p-5 rounded-xl border border-slate-200/60 shadow-inner">
                  <div className="font-bold text-slate-900 text-sm border-b border-slate-200/80 pb-1">🏢 Corporate Registry</div>
                  <div><span className="text-slate-400 font-semibold">Headquarters Location:</span> <p className="text-slate-800 font-bold mt-0.5">{ownerProfile.headquarters}</p></div>
                  <div><span className="text-slate-400 font-semibold">Official Mail ID:</span> <p className="text-emerald-700 font-bold mt-0.5 underline">{ownerProfile.email}</p></div>
                  <div><span className="text-slate-400 font-semibold">Support Channels:</span> <p className="text-slate-800 font-bold mt-0.5 tracking-wider">{ownerProfile.phone}</p></div>
                </div>

                <div className="space-y-3 bg-slate-50/80 p-5 rounded-xl border border-slate-200/60 shadow-inner flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm border-b border-slate-200/80 pb-1">🎯 Vision Statement</div>
                    <p className="text-slate-600 leading-relaxed italic mt-2">
                      "{ownerProfile.vision}"
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-200/40">
                    System Handshake Verified ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: FLIPKART STYLE MULTI-STEP CHECKOUT & PAYMENT */}
        {activeTab === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LEFT 2 COLUMNS: MULTI STEP ACCORDION WORKFLOW */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* STEP 1: BASKET CHECK */}
              {checkoutStep !== 'success' && (
                <div className="bg-white/90 backdrop-blur rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className={`p-4 font-bold text-xs uppercase tracking-wider flex justify-between items-center ${checkoutStep === 'review' ? 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}>
                    <span>1. ITEM REVIEW INDEX ({cart.length} items)</span>
                    {checkoutStep !== 'review' && <button onClick={() => setCheckoutStep('review')} className="text-emerald-700 font-bold hover:underline normal-case text-xs">Modify</button>}
                  </div>
                  
                  {checkoutStep === 'review' && (
                    <div className="p-4 divide-y text-xs">
                      {cart.length === 0 ? (
                        <div className="text-center py-8 space-y-2">
                          <p className="text-slate-400 text-sm font-medium">Your procurement log is completely empty.</p>
                          <button onClick={() => setActiveTab('marketplace')} className="text-emerald-700 font-bold underline hover:text-emerald-800">Go browse fresh crops</button>
                        </div>
                      ) : (
                        <>
                          {cart.map(item => (
                            <div key={item.id} className="py-3.5 flex justify-between items-center gap-4 border-slate-100">
                              <div className="flex items-center space-x-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-sm" />
                                <div>
                                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                                  <p className="text-[10px] text-slate-400">Mandi Origin: {item.location} | Grower: {item.farmer}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
                                <button onClick={() => removeFromCart(item.id)} className="block text-[10px] text-rose-500 hover:underline mt-0.5 ml-auto font-medium">Remove</button>
                              </div>
                            </div>
                          ))}
                          <div className="pt-4 flex justify-end">
                            <button onClick={() => setCheckoutStep('address')} className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black px-5 py-2.5 rounded-lg uppercase tracking-wider shadow-md transition-transform active:scale-[0.98]">
                              Proceed to Logistics ➔
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: SHIPPING ADDRESS ENTRY */}
              {checkoutStep !== 'success' && (
                <div className="bg-white/90 backdrop-blur rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className={`p-4 font-bold text-xs uppercase tracking-wider flex justify-between items-center ${checkoutStep === 'address' ? 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}>
                    <span>2. LOGISTICS DELIVERY ADDRESS</span>
                    {checkoutStep === 'payment' && <button onClick={() => setCheckoutStep('address')} className="text-emerald-700 font-bold hover:underline normal-case text-xs">Modify</button>}
                  </div>

                  {checkoutStep === 'address' && (
                    <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep('payment'); }} className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Full Legal Name</label>
                          <input type="text" required name="fullName" value={addressData.fullName} onChange={handleAddressChange} placeholder="e.g., Siddaram BN" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Contact Phone Number</label>
                          <input type="tel" required name="phone" value={addressData.phone} onChange={handleAddressChange} placeholder="e.g., +91 94811 XXXXX" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Warehouse Destination Address</label>
                        <textarea required rows="2" name="fullAddress" value={addressData.fullAddress} onChange={handleAddressChange} placeholder="Plot No, Street, Village Area, Mandi Hub Base" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">State Region</label>
                          <input type="text" required name="state" value={addressData.state} onChange={handleAddressChange} placeholder="e.g., Karnataka" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Postal Pincode</label>
                          <input type="text" required name="pincode" value={addressData.pincode} onChange={handleAddressChange} placeholder="e.g., 585102" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all" />
                        </div>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <button type="submit" className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black px-5 py-2.5 rounded-lg uppercase tracking-wider shadow-md">
                          Save and Deliver Here ➔
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* STEP 3: PAYMENT OPTIONS SECTION */}
              {checkoutStep === 'payment' && (
                <div className="bg-white/90 backdrop-blur rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="p-4 font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md">
                    3. SECURE INTEGRATED PAYMENT OPTIONS
                  </div>

                  <form onSubmit={submitOrder} className="p-4 text-xs grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Payment Side Tabs Selectors */}
                    <div className="space-y-2 border-r border-slate-100 pr-4 flex flex-col justify-start">
                      <label className={`p-3 rounded-lg border flex items-center space-x-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-amber-50/70 border-amber-500 font-bold text-amber-900' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <input type="radio" name="payMethod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-amber-600" />
                        <span>Cash On Delivery (COD)</span>
                      </label>
                      
                      <label className={`p-3 rounded-lg border flex items-center space-x-2 cursor-pointer transition-all ${paymentMethod === 'upi_qr' ? 'bg-emerald-50/70 border-emerald-500 font-bold text-emerald-900' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <input type="radio" name="payMethod" checked={paymentMethod === 'upi_qr'} onChange={() => setPaymentMethod('upi_qr')} className="accent-emerald-700" />
                        <span>UPI Mobile QR Scanner</span>
                      </label>

                      <label className={`p-3 rounded-lg border flex items-center space-x-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-emerald-50/70 border-emerald-500 font-bold text-emerald-900' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <input type="radio" name="payMethod" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-emerald-700" />
                        <span>Credit / Debit Cards</span>
                      </label>
                    </div>

                    {/* Payment Context Body Fields */}
                    <div className="md:col-span-2 flex flex-col justify-between min-h-[180px]">
                      {/* COD SUB-VIEW */}
                      {paymentMethod === 'cod' && (
                        <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/30 p-4 rounded-xl border border-dashed border-amber-300 space-y-2 shadow-inner">
                          <div className="font-bold text-amber-900 text-sm flex items-center space-x-1">
                            <span>📦</span> <span>Cash On Delivery Selected</span>
                          </div>
                          <p className="text-amber-800 leading-relaxed text-[11px]">
                            Note: The transaction ledger stays marked as <span className="font-bold underline">PENDING</span>. You will clear the core funds manually to the logistics freight driver when the truck unloads at your warehouse address.
                          </p>
                        </div>
                      )}

                      {/* UPI QR GATEWAY ENGINE */}
                      {paymentMethod === 'upi_qr' && (
                        <div className="space-y-3 flex flex-col items-center text-center p-2">
                          <div className="text-[11px] font-bold text-slate-500">Scan via PhonePe, GPay, Paytm, or BHIM</div>
                          
                          <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 inline-block space-y-2">
                            <div className="p-2 bg-slate-950 rounded-xl inline-block">
                              <div className="w-28 h-28 bg-white flex flex-wrap p-1 gap-0.5 items-center justify-center relative">
                                <div className="w-7 h-7 border-4 border-slate-900 bg-slate-900 rounded-sm"></div>
                                <div className="w-12 h-7 bg-slate-200"></div>
                                <div className="w-7 h-7 border-4 border-slate-900 bg-slate-900 rounded-sm"></div>
                                <div className="w-28 h-12 bg-gradient-to-tr from-slate-900 via-slate-400 to-slate-900"></div>
                                <div className="w-7 h-7 border-4 border-slate-900 bg-slate-900 rounded-sm"></div>
                                <div className="w-12 h-7 bg-slate-300"></div>
                                <div className="absolute top-11 left-11 bg-amber-500 text-[8px] font-black px-1 rounded text-slate-950">AGRI</div>
                              </div>
                            </div>
                            <div className="text-emerald-700 font-black text-sm tracking-wide">
                              ₹{totalPayable.toLocaleString('en-IN')}
                            </div>
                          </div>

                          <div className="w-full max-w-xs">
                            <input type="text" name="upiId" value={paymentDetails.upiId} onChange={handlePaymentChange} placeholder="Or type VPA Handle (e.g., sbn@oksbi)" className="w-full p-2.5 border border-slate-200 rounded-lg text-center bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all" />
                          </div>
                        </div>
                      )}

                      {/* CARD SUB-VIEW */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-3 max-w-sm">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Cardholder Card Number</label>
                            <input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} placeholder="4532 XXXX XXXX XXXX" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Expiry Date</label>
                              <input type="text" name="expiry" value={paymentDetails.expiry} onChange={handlePaymentChange} placeholder="MM/YY" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all" />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">CVV Security</label>
                              <input type="password" name="cvv" value={paymentDetails.cvv} onChange={handlePaymentChange} placeholder="***" maxLength="3" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs px-8 py-3 rounded-xl uppercase tracking-widest shadow-md active:scale-95 transition-all">
                          🔒 Book Consignment Order
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* SUCCESS VIEW */}
              {checkoutStep === 'success' && (
                <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6 max-w-xl mx-auto relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
                  
                  {paymentMethod === 'cod' ? (
                    <div className="mx-auto h-20 w-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shadow-inner text-4xl border border-amber-200 animate-pulse">
                      ⏳
                    </div>
                  ) : (
                    <div className="mx-auto h-20 w-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner text-4xl border border-emerald-100">
                      ✓
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {paymentMethod === 'cod' ? 'Consignment Order Booked!' : 'Payment Successfully Processed!'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {paymentMethod === 'cod' 
                        ? 'Your freight request is accepted. Payment collection will execute at unloading zones.' 
                        : 'Your transactional funds are securely captured and cleared online.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-left text-xs shadow-inner space-y-3">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex justify-between items-center text-[10px] uppercase tracking-wider">
                      <span>📦 Official Cargo Manifest</span>
                      {paymentMethod === 'cod' ? (
                        <span className="text-amber-700 font-black bg-amber-100 border border-amber-200/50 px-2 py-0.5 rounded uppercase tracking-widest">
                          PENDING ⏳
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-black bg-emerald-100 border border-emerald-200/50 px-2 py-0.5 rounded uppercase tracking-widest">
                          SUCCESSFUL ✅
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 text-slate-700">
                      <div><span className="font-semibold text-slate-400">Consignee Recipient:</span> {addressData.fullName || authForm.username}</div>
                      <div><span className="font-semibold text-slate-400">Contact Number:</span> {addressData.phone || '+91 94811 XXXXX'}</div>
                      <div><span className="font-semibold text-slate-400">Logistics Destination Hub:</span> {addressData.fullAddress || 'Gulbarga Main Warehouse Base'}, {addressData.state || 'Karnataka'} - {addressData.pincode || '585102'}</div>
                      <div><span className="font-semibold text-slate-400">Settlement Handle:</span> <span className="uppercase font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">{paymentMethod}</span></div>
                    </div>
                  </div>

                  <div>
                    <button type="button" onClick={resetOrderWorkflow} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg text-xs uppercase shadow tracking-wider transition-all transform active:scale-95">
                      Return to Marketplace
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR COLUMN: PRICE BREAKDOWN */}
            {checkoutStep !== 'success' && (
              <div className="bg-white/90 backdrop-blur rounded-xl border border-slate-200/80 shadow-sm text-xs overflow-hidden sticky top-24">
                <div className="p-3 bg-slate-50 border-b border-slate-200/60 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Price Summary Details</div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Price ({cart.length} Crop Batches)</span>
                    <span className="font-medium text-slate-900">Core ₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mandi Logistics Freight</span>
                    <span className="text-emerald-700 font-bold">{deliveryCharges === 0 ? 'FREE DELIVERY' : `₹${deliveryCharges}`}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-3">
                    <span className="text-slate-600">Platform Infrastructure Token</span>
                    <span className="font-medium text-slate-900">₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black pt-1">
                    <span className="text-slate-900">Total Payable Value</span>
                    <span className="text-emerald-800 font-black text-base">₹{totalPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}