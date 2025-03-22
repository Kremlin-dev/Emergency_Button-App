# emergency_app/firebase_config.py
import firebase_admin
from firebase_admin import credentials, db
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_CRED_PATH = os.path.join(BASE_DIR, "emergencytrackingapp-firebase-adminsdk-fbsvc-48daf7066c.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://emergencytrackingapp-default-rtdb.firebaseio.com/'
    })

# Export the initialized db service
firebase_db = firebase_admin.db