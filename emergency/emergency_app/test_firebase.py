from emergency.emergency_app.firebase_config import db  # Import the db instance from firebase_config

# Reference the root of the database
ref = db.reference("/test")  

# Write test data
ref.set({
    "message": "Hello, Firebase!",
    "status": "Connected"
})

# Read the data back
data = ref.get()
print("Data from Firebase:", data)
