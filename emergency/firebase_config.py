import firebase_admin
from firebase_admin import credentials, db

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
FIREBASE_CRED_PATH = os.path.join(BASE_DIR, "emergencytrackingapp-firebase-adminsdk-fbsvc-48daf7066c.json")

cred = credentials.Certificate(FIREBASE_CRED_PATH)


# Initialize the Firebase app
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://emergencytrackingapp-default-rtdb.firebaseio.com/'
})
