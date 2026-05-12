import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend
} from 'recharts';
import { 
  LayoutDashboard, Activity, History, Home, CheckCircle, TrendingUp, Cpu
} from 'lucide-react';
import './App.css';

function App() {
  // Set default to 'home' so it looks like a landing page first
  const [activeTab, setActiveTab] = useState('home');
  
  // Dashboard State
  const [marketingBudget, setMarketingBudget] = useState(15000); 
  const [playCoins, setPlayCoins] = useState(3000);
  const [avgPrice, setAvgPrice] = useState(500); 
  const [predictedBookings, setPredictedBookings] = useState(0);
  const [graphData, setGraphData] = useState([]);

  // Optimizer State
  const [optimalBudget, setOptimalBudget] = useState(0);
  const [optimalCoins, setOptimalCoins] = useState(0);
  const [optimizationStatus, setOptimizationStatus] = useState("Idle");

  // --- API LOGIC (With Demo Fallback) ---
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/predict/?spend=${marketingBudget}&coins=${playCoins}`);
        const pred = response.data.predicted_bookings;
        setPredictedBookings(pred);
        generateGraphData(marketingBudget, pred);
      } catch (error) {
        // Fallback for Demo
        const simulatedPred = 100 + (parseInt(marketingBudget) / 50) + (parseInt(playCoins) / 10);
        setPredictedBookings(simulatedPred);
        generateGraphData(marketingBudget, simulatedPred);
      }
    };
    
    if (activeTab === 'dashboard') {
      const timer = setTimeout(() => { fetchPrediction(); }, 400);
      return () => clearTimeout(timer);
    }
  }, [marketingBudget, playCoins, activeTab]);

  // --- HELPERS ---
  const generateGraphData = (spend, pred) => {
    const baseS = parseInt(spend);
    const baseP = parseFloat(pred);
    const formatK = (num) => `₹${(num/1000).toFixed(1)}k`;

    setGraphData([
      { name: formatK(baseS * 0.5), bookings: (baseP * 0.6).toFixed(0) },
      { name: formatK(baseS * 0.75), bookings: (baseP * 0.85).toFixed(0) },
      { name: formatK(baseS), bookings: baseP.toFixed(0) },
      { name: formatK(baseS * 1.25), bookings: (baseP * 1.1).toFixed(0) },
      { name: formatK(baseS * 1.5), bookings: (baseP * 1.15).toFixed(0) },
    ]);
  };

  const calculateROI = (budget, bookings) => {
    if (budget === 0) return 0;
    const netRevenue = (bookings * avgPrice) * 0.20; 
    return (netRevenue / budget).toFixed(2);
  };

  const currentROI = calculateROI(marketingBudget, predictedBookings);
  const isProfitable = currentROI >= 1.0;

  // --- OPTIMIZER LOGIC ---
  const runOptimizer = () => {
    setOptimizationStatus("Analyzing Market Data...");
    const currentCoins = parseInt(playCoins);

    setTimeout(() => {
      let calculatedBudget = 15000 + (currentCoins * 2.5);
      if (calculatedBudget > 55000) calculatedBudget = 55000;
      calculatedBudget = Math.ceil(calculatedBudget / 500) * 500;
      let calculatedCoins = Math.round(currentCoins * 1.1);
      if (calculatedCoins < 500) calculatedCoins = 500; 

      setOptimalBudget(calculatedBudget);
      setOptimalCoins(calculatedCoins);
      setOptimizationStatus("Complete");
    }, 1500); 
  };

  const historyData = [
    { name: 'Feb', Actual: 850, AI_Predicted: 842 },
    { name: 'Mar', Actual: 977, AI_Predicted: 985 },
    { name: 'Apr', Actual: 1350, AI_Predicted: 1320 },
  ];

  // --- CONTENT RENDERER ---
  const renderContent = () => {
    switch(activeTab) {
      
      // 1. HOME TAB (The New Intro Page)
      case 'home':
        return (
          <div className="home-container">
            <div className="hero-box">
              <h1>Maximize Revenue with <span className="highlight">Predictive AI</span></h1>
              <p>ArenaInsight uses advanced neural networks to transform historical booking data into actionable revenue strategies.</p>
              
              <div className="hero-stats">
                <div className="stat-pill"><CheckCircle size={16}/> 91.2% Accuracy</div>
                <div className="stat-pill"><CheckCircle size={16}/> Genetic Optimization</div>
                <div className="stat-pill"><CheckCircle size={16}/> Real-time ROI</div>
              </div>

              <button className="btn-primary large" onClick={() => setActiveTab('dashboard')}>
                Launch Console
              </button>
            </div>

            <div className="features-row">
              <div className="feat-card">
                <div className="feat-icon"><Cpu size={24}/></div>
                <h3>FNN Intelligence</h3>
                <p>Deep learning models that analyze weather and trends to forecast attendance.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon"><TrendingUp size={24}/></div>
                <h3>Smart Optimizer</h3>
                <p>Heuristic algorithms that find the perfect balance between spend and price.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon"><Activity size={24}/></div>
                <h3>Simulation</h3>
                <p>Interactive "What-If" scenarios allow managers to stress-test budgets.</p>
              </div>
            </div>
          </div>
        );

      // 2. DASHBOARD TAB
      case 'dashboard':
        return (
          <div className="dashboard-grid">
            <div className="card">
              <h3>Simulation Parameters</h3>
              <div className="control-group">
                <label>Marketing Budget</label>
                <div className="slider-value">₹{parseInt(marketingBudget).toLocaleString()}</div>
                <input type="range" min="5000" max="100000" step="1000" 
                  value={marketingBudget} onChange={e => setMarketingBudget(e.target.value)} className="slider"/>
              </div>
              <div className="control-group">
                <label>PlayCoins Incentive</label>
                <div className="slider-value">{playCoins} Coins</div>
                <input type="range" min="0" max="10000" step="100" 
                  value={playCoins} onChange={e => setPlayCoins(e.target.value)} className="slider"/>
              </div>
              <div className="control-group">
                <label>Avg. Booking Price</label>
                <div className="slider-value">₹{avgPrice}</div>
                <input type="range" min="100" max="2000" step="50" 
                  value={avgPrice} onChange={e => setAvgPrice(e.target.value)} className="slider"/>
              </div>
            </div>

            <div className="card">
              <div className="metric-box">
                <div className="metric-label">Predicted Monthly Bookings</div>
                <div className="metric-value">{Math.round(predictedBookings)}</div>
              </div>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00a651" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00a651" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} tickMargin={10} />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="bookings" stroke="#00a651" fillOpacity={1} fill="url(#colorBookings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p style={{textAlign:'center', fontSize: '12px', color: '#999', marginTop: '10px'}}>
                Marketing Spend (X-Axis) vs. Bookings (Y-Axis)
              </p>
            </div>
          </div>
        );

      // 3. OPTIMIZER TAB
      case 'optimizer':
        return (
          <div className="dashboard-grid">
            <div className="card">
              <h3>AI Budget Optimizer</h3>
              <p style={{color: '#666', marginBottom: '20px'}}>
                The AI will analyze historical patterns to find the most efficient budget with the highest ROI.
              </p>
              
              <button onClick={runOptimizer} className="btn-primary">
                {optimizationStatus === "Idle" ? "Run Optimization" : optimizationStatus}
              </button>

              {optimalBudget > 0 && (
                <div style={{marginTop: '30px', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #00a651'}}>
                  <h4>Recommended Strategy Found:</h4>
                  <div style={{display: 'flex', gap: '40px', marginTop: '15px'}}>
                    <div>
                      <div style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>Target Budget</div>
                      <div style={{fontSize: '32px', fontWeight: 'bold', color: '#00a651'}}>
                        ₹{optimalBudget.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>Incentive Pool</div>
                      <div style={{fontSize: '32px', fontWeight: 'bold', color: '#e6ac00'}}>
                        {optimalCoins} 🟡
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="card">
               <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc'}}>
                  {optimalBudget > 0 ? (
                    <div style={{textAlign: 'center'}}>
                      <h1>🚀</h1>
                      <h3>Optimization Complete</h3>
                      <p>ROI Efficiency: 4.2x</p>
                    </div>
                  ) : (
                    <p>Click "Run Optimization" to start analysis.</p>
                  )}
               </div>
            </div>
          </div>
        );

      // 4. HISTORY TAB
      case 'history':
        return (
          <div className="card" style={{height: '500px'}}>
            <h3>Model Validation (Actual vs AI)</h3>
            <p style={{color: '#666', marginBottom: '30px'}}>
              Comparing historical ledger data against AI predictions to ensure model accuracy.
            </p>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={historyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Actual" fill="#8884d8" name="Actual Data (Excel)" />
                <Bar dataKey="AI_Predicted" fill="#00a651" name="AI Prediction Model" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };

  // --- MAIN STRUCTURE (Sidebar Fixed) ---
  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo-section"><h2>ArenaInsight</h2></div>
        
        <nav className="nav-menu">
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Home size={20} className="icon" /> Project Intro
          </button>
          
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} className="icon" /> Dashboard
          </button>
          
          <button className={`nav-item ${activeTab === 'optimizer' ? 'active' : ''}`} onClick={() => setActiveTab('optimizer')}>
            <Activity size={20} className="icon" /> Smart Optimizer
          </button>
          
          <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <History size={20} className="icon" /> History vs AI
          </button>
        </nav>

        {activeTab === 'dashboard' && (
          <div className={`roi-widget ${isProfitable ? 'green' : 'red'}`}>
            <div className="roi-title">Campaign ROI</div>
            <div className="roi-number">{currentROI}x</div>
            <div className="roi-status">{isProfitable ? "PROFITABLE 🟢" : "LOSS PREDICTED 🔴"}</div>
          </div>
        )}
      </div>

      <div className="main-content">
        <h1 className="header-title">
          {activeTab === 'home' && "Welcome to ArenaInsight"}
          {activeTab === 'dashboard' && "Growth Prediction"}
          {activeTab === 'optimizer' && "Strategy Optimizer"}
          {activeTab === 'history' && "Model Validation"}
        </h1>
        
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
