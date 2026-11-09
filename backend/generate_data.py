import pandas as pd
from sdv.single_table import GaussianCopulaSynthesizer
from sdv.metadata import Metadata

# 1. Your real 3 rows of data
data = {
    'Offer_Spend': [13969, 24498, 31220],
    'Cashback_Used': [150, 450, 300],
    'Online_Bookings': [637, 977, 1416]
}
real_df = pd.DataFrame(data)

# 2. Creating Metadata (Telling SDV what the columns are)
metadata = Metadata.detect_from_dataframe(data=real_df)

# 3. Using the Synthesizer (The "AI Generator")
synthesizer = GaussianCopulaSynthesizer(metadata)
synthesizer.fit(real_df)

# 4. Generate 200 rows of synthetic data
synthetic_data = synthesizer.sample(num_rows=2500)

# 5. Save it for the Neural Network to learn
synthetic_data.to_csv('synthetic_stadium_data.csv', index=False)
print("✅ Success! Created synthetic_stadium_data.csv with 2500 rows.")