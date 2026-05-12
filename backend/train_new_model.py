import pandas as pd
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.preprocessing import StandardScaler
import joblib
import os

# 1. Define the file name (The one you see in your folder)
file_name = 'final_clean_dataset.csv'

# Check if file exists
if not os.path.exists(file_name):
    print(f"❌ Error: Could not find {file_name}")
    print("   Please ensure this script is in the same folder as the CSV file.")
    exit()

print(f"✅ Found {file_name}! Processing...")

# 2. Load the data
# We use header=None because your file starts with data immediately (no text headers)
df = pd.read_csv(file_name, header=None)

# 3. Manually name the columns so the rest of the code understands them
# (Based on the data pattern: Spend (~30k), Coins (~300), Bookings (~1000))
df.columns = ['Offer Spend', 'Playcoins Used', 'Online Bookings']

print("   Data loaded and columns named successfully.")
print(df.head()) # Shows you the first few rows to confirm

# 4. Select Inputs (X) and Output (y)
X = df[['Offer Spend', 'Playcoins Used']]
y = df['Online Bookings']

# 5. Create and Save the Scaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, 'scaler.pkl') 
print("   -> New scaler.pkl saved.")

# 6. Train the Neural Network
print("   -> Training the model on 2500 records...")
model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=[2]),
    layers.Dense(32, activation='relu'),
    layers.Dense(1)
])

model.compile(optimizer='adam', loss='mean_squared_error')
model.fit(X_scaled, y, epochs=100, batch_size=32, verbose=0)

# 7. Save the Brain
model.save('model.h5')
print("✅ SUCCESS! New 'model.h5' created.")
print("👉 FINAL STEP: Copy 'model.h5' and 'scaler.pkl' to your Django backend folder.")
