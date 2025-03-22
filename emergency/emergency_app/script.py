import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase Admin (reuse your existing setup)
cred = credentials.Certificate('C:\github\Emergency_Button-App\emergency\emergency_app\emergencytrackingapp-firebase-adminsdk-fbsvc-48daf7066c.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://emergencytrackingapp-default-rtdb.firebaseio.com/'
})

# Reference to the emergency
emergency_id = "402856"  # Replace with your emergencyId from Postman
ref = db.reference(f"emergencies/{emergency_id}")

# Update status
update_data = {
    "status": "active",
    "updatedAt": "2025-03-22T14:05:00.000000"
}
ref.update(update_data)

print(f"Updated status for emergency {emergency_id}")