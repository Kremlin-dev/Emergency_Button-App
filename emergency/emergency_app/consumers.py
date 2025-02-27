import json
from datetime import datetime
from firebase_admin import db
from .models import employee_collection, emergency_collection, company_collection
import secrets
from .firebase_config import firebase_db

def generate_secure_id():
    return secrets.randbelow(900000) + 100000 

class LocationHandler:
    @staticmethod
    def report_emergency(employee_id, company_code, latitude, longitude, accuracy, category):
       
        try:
           
            employee = employee_collection.find_one({"employeeId": employee_id, "companyCode": company_code})
            if not employee:
                return {"error": "Employee not found or company mismatch"}

            existing_emergency = emergency_collection.find_one({
                "employeeId": employee_id,
                "status": "active",
                "category": category
            })

            print(existing_emergency)

            if existing_emergency:
                emergency_id = existing_emergency["emergencyId"]
                update_data = {
                    "location": {"lat": latitude, "lng": longitude, "accuracy": accuracy},
                    "updatedAt": datetime.utcnow().isoformat()
                }
                emergency_collection.update_one(
                    {"emergencyId": emergency_id},
                    {"$set": update_data}
                )

                firebase_ref = db.reference(f"emergencies/{employee_id}/{emergency_id}")
                firebase_ref.update(update_data)

                updated_emergency = emergency_collection.find_one({"emergencyId": emergency_id})
                updated_emergency.pop("_id")  
                return {
                    "success": f"Updated existing {category} emergency",
                    "emergency": updated_emergency
                }
            else:
                emergency_id = str(generate_secure_id())
                new_emergency = {
                    "emergencyId": emergency_id,
                    "employeeId": employee_id,
                    "companyCode": company_code,
                    "category": category,
                    "status": "active",
                    "location": {"lat": latitude, "lng": longitude, "accuracy": accuracy},
                    "createdAt": datetime.utcnow().isoformat()
                }

                emergency_collection.insert_one(new_emergency)

                firebase_ref = db.reference(f"emergencies/{employee_id}/{emergency_id}")
                firebase_ref.set(new_emergency)

                new_emergency.pop("_id", None)
                return {"success": "Emergency reported successfully", "emergency": new_emergency}

        except Exception as e:
            return {"error": f"Error reporting emergency: {str(e)}"}

    @staticmethod
    def update_emergency_status(emergency_id, status):
      
        try:
            emergency = emergency_collection.find_one({"emergencyId": emergency_id})
            print(emergency)
            if not emergency:
                return {"error": "Emergency not found"}

            if emergency["status"] == status:
                return {"error": f"Emergency is already {status}"}

            update_data = {"status": status, "updatedAt": datetime.utcnow().isoformat()}
            if status == "resolved":
                update_data["resolvedAt"] = datetime.utcnow().isoformat()

            emergency_collection.update_one(
                {"emergencyId": emergency_id},
                {"$set": update_data}
            )

            employee_id = emergency["employeeId"]
            firebase_ref = db.reference(f"emergencies/{employee_id}/{emergency_id}")
            firebase_ref.update(update_data)

            updated_emergency = emergency_collection.find_one({"emergencyId": emergency_id})
            updated_emergency.pop("_id")
            return {"success": f"Emergency status updated to {status}", "emergency": updated_emergency}

        except Exception as e:
            return {"error": f"Error updating emergency status: {str(e)}"}