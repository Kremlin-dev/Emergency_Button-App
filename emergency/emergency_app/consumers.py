import json
from datetime import datetime
from firebase_admin import db
from .models import employee_collection, emergency_collection, company_collection
import secrets
import logging
from bson import ObjectId

logger = logging.getLogger(__name__)

def generate_secure_id():
    return secrets.randbelow(900000) + 100000

class LocationHandler:
    @staticmethod
    def report_emergency(employee_id, company_code, latitude, longitude, accuracy, category):
        try:  
            logger.info(f"Reporting emergency for {employee_id}, category {category}")

            employee = employee_collection.find_one({"employeeId": employee_id, "companyCode": company_code})
            if not employee:
                logger.error("Employee not found or company mismatch")
                return {"error": "Employee not found or company mismatch"}

            company = company_collection.find_one({"companyCode": company_code})
            phone_number = None
            if company:
                for emp in company.get("employees", []):
                    if emp["employeeId"] == employee_id:
                        phone_number = emp.get("phone", None)
                        break

            existing_emergency = emergency_collection.find_one({
                "employeeId": employee_id,
                "status": "active",
                "category": category
            })

            if existing_emergency:
                existing_emergency["_id"] = str(existing_emergency["_id"])  
                logger.info(f"Existing emergency found: {existing_emergency}")

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
                updated_emergency["_id"] = str(updated_emergency["_id"])  
                updated_emergency.pop("_id", None)

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
                    "phone": phone_number, 
                    "location": {"lat": latitude, "lng": longitude, "accuracy": accuracy},
                    "createdAt": datetime.utcnow().isoformat(),
                    "reqState": True
                }

                insert_result = emergency_collection.insert_one(new_emergency)
                new_emergency["_id"] = str(insert_result.inserted_id)  

                logger.info(f"Inserted into MongoDB with _id: {new_emergency['_id']}")

                firebase_ref = db.reference(f"emergencies/{employee_id}/{emergency_id}")
                firebase_ref.set(new_emergency)

                new_emergency.pop("_id", None)  

                return {"success": "Emergency reported successfully", "emergency": new_emergency}

        except Exception as e:
            logger.error(f"Error in report_emergency: {str(e)}", exc_info=True)
            return {"error": f"Error reporting emergency: {str(e)}", "reqState": False}
