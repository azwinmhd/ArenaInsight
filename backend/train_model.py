import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# 1. Load your NEW big dataset
# Make sure this matches the file name you just created
df = pd.read_csv('synthetic_stadium_data.csv')

print(f"Loading dataset... Found {len(df)} records.")

# 2. Select the Features (Inputs) and Target (Output)
# We use the same columns as before, but now with more data
X = df[['Offer Spend', 'Cashback Used']]  # The "Knobs" you turn
y = df['Online Bookings']                  # The result you want

# 3. Scale the Data (Crucial for Deep Learning)
# Neural networks work best with small numbers (0-1), not big rupees
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# SAVE the scaler! You need this for the website to understand the inputs later
joblib.dump(scaler, 'scaler.pkl') 

# 4. Split into Training and Testing sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 5. Build the Deep Learning Model (The Neural Network)
model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=[2]), # Layer 1: 64 Neurons
    layers.Dense(32, activation='relu'),                  # Layer 2: 32 Neurons
    layers.Dense(1)                                       # Output Layer: Prediction
])

model.compile(optimizer='adam', loss='mean_squared_error')

# 6. Train the Model (The Learning Phase)
print("Training the model on 2500 records...")
model.fit(X_train, y_train, epochs=100, batch_size=32, verbose=0)

# 7. Save the Brain
model.save('model.h5')

print("✅ Success! New 'model.h5' and 'scaler.pkl' generated.")
print("👉 Next Step: Copy these two files into your Django project folder.")