import json
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bson import json_util
from firebase_config import db  
from .models import db as mongo_db  

import secrets
def generate_secure_id():
    return secrets.randbelow(900000) + 100000  

def parse_datetime(datetime_str):
    try:
        return datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        return datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%SZ")

def serialize_mongo_document(doc):
    doc["_id"] = str(doc["_id"])  
    return json.loads(json_util.dumps(doc))

class LocationHandler:
    @staticmethod
    def process_location_update(data):
        """
        Handles real-time location updates for active emergencies.
        """
        try:
            employee_id = data.get("employeeId")
            company_code = data.get("companyCode")
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            category = data.get("category")
            created_at = data.get("createdAt")

            if not all([employee_id, company_code, latitude, longitude, category, created_at]):
                return {"error": "Missing required fields"}

            latitude = float(latitude)
            longitude = float(longitude)

            emergency = mongo_db["emergency"].find_one({"employeeId": employee_id, "status": "active"})

            if emergency:
                if emergency["status"] == "resolved":
                    return {"message": "Emergency already resolved"}

                mongo_db["emergency"].update_one(
                    {"_id": emergency["_id"]},
                    {"$push": {"locations": {"lat": latitude, "lng": longitude}}}
                )

                ref = db.reference(f"emergencies/{emergency['emergencyId']}/locations")
                ref.push({
                    "lat": latitude,
                    "lng": longitude,
                    "timestamp": datetime.utcnow().isoformat()
                })

                return {"success": "Location update added to active emergency"}

            else:
                new_emergency_id = generate_secure_id()

                new_emergency = {
                    "emergencyId": str(new_emergency_id),
                    "employeeId": employee_id,
                    "companyCode": company_code,
                    "category": category,
                    "status": "active",
                    "locations": [{"lat": latitude, "lng": longitude}],
                    "createdAt": parse_datetime(created_at).isoformat()
                }

                result = mongo_db["emergency"].insert_one(new_emergency)
                new_emergency["_id"] = str(result.inserted_id)

                ref = db.reference(f"emergencies/{new_emergency_id}")
                ref.set(new_emergency)

                return {"success": "New emergency created"}

        except Exception as e:
            return {"error": f"Error processing location: {str(e)}"}

    @staticmethod
    def update_emergency_status(emergency_id, status):
        """
        Updates the emergency status (resolved or active) for a given emergency ID.
        """
        try:
            emergency = mongo_db["emergency"].find_one({"emergencyId": emergency_id})

            if not emergency:
                return {"error": "Emergency not found"}

            mongo_db["emergency"].update_one(
                {"emergencyId": emergency_id},
                {"$set": {"status": status, "updatedAt": datetime.utcnow().isoformat()}}
            )

            ref = db.reference(f"emergencies/{emergency_id}")
            ref.update({"status": status, "updatedAt": datetime.utcnow().isoformat()})

            return {"success": f"Emergency status updated to {status}"}

        except Exception as e:
            return {"error": f"Error updating emergency status: {str(e)}"}

    @staticmethod
    def resolve_emergency(emergency_id):
        """
        Resolves a specific emergency by its emergencyId.
        """
        try:
            emergency = mongo_db["emergency"].find_one({"emergencyId": emergency_id, "status": "active"})

            if not emergency:
                return {"error": "No active emergency found"}

            mongo_db["emergency"].update_one(
                {"emergencyId": emergency_id},
                {"$set": {"status": "resolved", "resolvedAt": datetime.utcnow().isoformat()}}
            )

            ref = db.reference(f"emergencies/{emergency_id}")
            ref.update({"status": "resolved", "resolvedAt": datetime.utcnow().isoformat()})

            return {"success": "Emergency resolved successfully"}

        except Exception as e:
            return {"error": f"Error resolving emergency: {str(e)}"}