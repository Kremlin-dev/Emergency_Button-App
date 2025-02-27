import pymongo
import pymongo.mongo_client
url = 'mongodb+srv://Kremlin:ch5BDbt8xwWLL59f@kremlin.cx70k.mongodb.net/?retryWrites=true&w=majority&appName=Kremlin'
client = pymongo.MongoClient(url)
db  = client['emergency_app']
