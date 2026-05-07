from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import numpy as np
import joblib
import os
from django.conf import settings
from tensorflow.keras.models import load_model

# 1. Load the Model and Scaler ONCE when the server starts
# This prevents reloading them for every single request (which is slow)
MODEL_PATH = os.path.join(settings.BASE_DIR, 'predictor/ml_models/arena_ai_model.h5')
SCALER_PATH = os.path.join(settings.BASE_DIR, 'predictor/ml_models/scaler.pkl')

print(f"Loading model from: {MODEL_PATH}")
model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

@api_view(['GET'])
def predict_bookings(request):
    try:
        # 2. Get data from the React frontend
        spend = float(request.GET.get('spend', 0))
        coins = float(request.GET.get('coins', 0))

        # 3. Prepare the input for the AI
        # We must use a 2D array because that's what the model expects: [[spend, coins]]
        input_data = np.array([[spend, coins]])
        
        # 4. Scale the input using the loaded scaler
        scaled_input = scaler.transform(input_data)

        # 5. Get the raw prediction from the Neural Network
        prediction = model.predict(scaled_input)
        predicted_value = float(prediction[0][0])

        # ---------------------------------------------------------
        # 6. CALIBRATION (The Reality Check)
        # We apply a factor of 0.163 to align the synthetic model 
        # with the real Excel data (1416 actual vs ~8686 predicted).
        # ---------------------------------------------------------
        calibration_factor = 0.163
        final_prediction = predicted_value * calibration_factor

        # 7. Ensure we don't predict negative bookings
        final_prediction = max(0, final_prediction)

        return Response({
            "status": "success",
            "input_received": {"spend": spend, "coins": coins},
            "predicted_bookings": round(final_prediction, 2)
        })

    except Exception as e:
        # If something breaks, print the error to the terminal so we can see it
        print("Error:", e)
        return Response({"status": "error", "message": str(e)})