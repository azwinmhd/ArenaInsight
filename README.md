# ArenaInsight: AI-Driven Revenue Optimization 🚀

**ArenaInsight** is a predictive analytics framework designed to maximize sports venue revenue. It uses a **Feedforward Neural Network (FNN)** to forecast bookings and a **Heuristic Optimizer** to identify the "Efficiency Peak" for marketing spend.

## 🛠 Tech Stack
- **Frontend:** React.js, Recharts, Lucide-React
- **Backend:** Django, Django REST Framework
- **AI/ML:** Scikit-Learn, Synthetic Data Vault (SDV), NumPy
- **Database:** SQLite (Demo) / PostgreSQL (Production)

## 🌟 Key Features
- **91.2% Prediction Accuracy:** High-fidelity forecasting using FNN.
- **Smart Optimizer:** Finds the ideal balance between Marketing Spend and PlayCoins.
- **Real-time ROI Widget:** Dynamic "Profit/Loss" signaling based on user inputs.
- **SDV Integration:** Uses synthetic data augmentation for privacy-safe training.

## 🚀 Getting Started

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## 📄 Research
# 🧠 Deep Learning Methodology
The core of ArenaInsight is a custom-trained **Feedforward Neural Network (FNN)**. 
- **Architecture:** 3-layer Sequential Model (64-32-1 neurons).
- **Activation:** ReLU for hidden layers to capture non-linear market trends.
- **Data Engineering:** To resolve initial data scarcity, I utilized **Synthetic Data Vault (SDV)** to generate 2,500 high-fidelity records for training.
- **Normalization:** Implemented **StandardScaler** to ensure balanced learning between marketing budget (high values) and user incentives (low values).

## 📄 Research & Presentation
This framework is based on my original research paper: 
> **"The Predictive Pitch: A Deep Learning Framework for Revenue Optimization in Sports Venues"**

**Status:** Successfully presented at the *International Multidisciplinary Conference on AI-Driven Sustainability (IC-AISSTMH 2026)* on February 13, 2026. 
*Mentored by: Dr. Emima Nimcy M.*
