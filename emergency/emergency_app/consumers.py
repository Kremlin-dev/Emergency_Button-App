import json
from datetime import datetime
from .firebase_config import firebase_db
from .models import employee_collection, emergency_collection, company_collection
import secrets
import logging
from bson import ObjectId
import threading
import time

logger = logging.getLogger(__name__)

def generate_secure_id():
    return secrets.randbelow(900000) + 100000

class LocationHandler:
    @staticmethod
    def report_emergency(employee_id, company_code, latitude, longitude, accuracy, category, status=None):
        try:
            logger.info(f"Reporting emergency for {employee_id}, category {category}")

            employee = employee_collection.find_one({"employeeId": employee_id, "companyCode": company_code})
            if not employee:
                logger.error("Employee not found or company mismatch")
                return {"error": "Employee not found or company mismatch", "reqState": False}

            company = company_collection.find_one({"companyCode": company_code})
            phone_number = None
            company_name = None

            if company:
                company_name = company.get("companyName", "Unknown Company")
                for emp in company.get("employees", []):
                    if emp["employeeId"] == employee_id:
                        phone_number = emp.get("phone", None)
                        break

            existing_emergency = emergency_collection.find_one({
                "employeeId": employee_id,
                "category": category
            })

            if existing_emergency:
                existing_emergency["_id"] = str(existing_emergency["_id"])
                logger.info(f"Existing emergency found: {existing_emergency}")

                emergency_id = existing_emergency["emergencyId"]
                current_status = existing_emergency.get("status", "")

                if current_status in ["", "active"]:
                    update_data = {
                        "location": {"lat": latitude, "lng": longitude, "accuracy": accuracy},
                        "updatedAt": datetime.utcnow().isoformat()
                    }
                    if status:
                        update_data["status"] = status

                    emergency_collection.update_one(
                        {"emergencyId": emergency_id},
                        {"$set": update_data}
                    )

                    firebase_ref = firebase_db.reference(f"emergencies/{emergency_id}")
                    firebase_ref.update(update_data)

                    updated_emergency = emergency_collection.find_one({"emergencyId": emergency_id})
                    updated_emergency["_id"] = str(updated_emergency["_id"])
                    updated_emergency.pop("_id", None)
                    updated_emergency["companyName"] = company_name
                    updated_emergency.setdefault("workNotes", existing_emergency.get("workNotes", []))
                    updated_emergency["status"] = updated_emergency.get("status", "")

                    logger.info(f"Location updated for emergency {emergency_id} (status: {current_status})")
                    return {
                        "success": f"Updated location for existing {category} emergency",
                        "emergency": updated_emergency,
                        "reqState": True
                    }
                else:
                    logger.info(f"Existing emergency status is {current_status} (closed), creating new one")
            else:
                logger.info("No existing emergency found, creating new one")

            emergency_id = str(generate_secure_id())
            new_emergency = {
                "emergencyId": emergency_id,
                "employeeId": employee_id,
                "companyName": company_name,
                "category": category,
                "phone": phone_number,
                "location": {"lat": latitude, "lng": longitude, "accuracy": accuracy},
                "createdAt": datetime.utcnow().isoformat(),
                "updatedAt": datetime.utcnow().isoformat(),
                "workNotes": [f"Work notes for emergency ID: {emergency_id}"],
                "status": ""
            }

            insert_result = emergency_collection.insert_one(new_emergency)
            new_emergency["_id"] = str(insert_result.inserted_id)

            logger.info(f"Inserted into MongoDB with _id: {new_emergency['_id']}")

            firebase_ref = firebase_db.reference(f"emergencies/{emergency_id}")
            logger.info(f"Attempting to write to Firebase: {json.dumps(new_emergency, indent=2)}")
            try:
                firebase_ref.set(new_emergency)
                logger.info(f"Successfully wrote emergency {emergency_id} to Firebase")
                firebase_data = firebase_ref.get()
                logger.info(f"Firebase data after write: {json.dumps(firebase_data, indent=2)}")
            except Exception as firebase_error:
                logger.error(f"Failed to write to Firebase: {str(firebase_error)}", exc_info=True)
                return {"error": f"Failed to sync with Firebase: {str(firebase_error)}", "reqState": False}

            new_emergency.pop("_id", None)

            logger.info(f"New emergency created: {emergency_id}. Frontend will set status.")
            return {
                "success": "Emergency reported successfully",
                "emergency": new_emergency,
                "reqState": True
            }

        except Exception as e:
            logger.error(f"Error in report_emergency: {str(e)}", exc_info=True)
            return {"error": f"Error reporting emergency: {str(e)}", "reqState": False}

def poll_firebase_to_mongo():
    print("Starting Firebase polling thread...")
    ref = firebase_db.reference("emergencies")
    while True:
        try:
            firebase_data = ref.get()
            if not firebase_data:
                print("No data in Firebase emergencies")
                time.sleep(5)
                continue

            for emergency_id, fb_data in firebase_data.items():
                if not isinstance(fb_data, dict):
                    print(f"Invalid data for {emergency_id}: {fb_data}")
                    continue

                mongo_doc = emergency_collection.find_one({"emergencyId": emergency_id})
                if not mongo_doc:
                    print(f"No MongoDB document for {emergency_id}, skipping sync")
                    continue

                update_data = {}
                if "status" in fb_data and fb_data["status"] != mongo_doc.get("status", ""):
                    valid_statuses = {"active", "resolved", "cancelled", ""}
                    if fb_data["status"] not in valid_statuses:
                        print(f"⚠ Invalid status for {emergency_id}: {fb_data['status']}")
                        continue
                    update_data["status"] = fb_data["status"]
                if "workNotes" in fb_data:
                    fb_notes = fb_data["workNotes"]
                    mongo_notes = mongo_doc.get("workNotes", [])
                    if fb_notes != mongo_notes:
                        if len(fb_notes) == 1 and fb_notes[0] == f"Work notes for emergency ID: {emergency_id}":
                            update_data["workNotes"] = []
                        else:
                            update_data["workNotes"] = fb_notes
                if "updatedAt" in fb_data and fb_data["updatedAt"] != mongo_doc.get("updatedAt", ""):
                    update_data["updatedAt"] = fb_data["updatedAt"]

                if update_data:
                    result = emergency_collection.update_one(
                        {"emergencyId": emergency_id},
                        {"$set": update_data},
                        upsert=False
                    )
                    if result.modified_count > 0:
                        print(f"Synced {emergency_id} to MongoDB: {update_data}")
                    elif result.matched_count > 0:
                        print(f"ℹ {emergency_id} matched but no changes needed")
                    else:
                        print(f"Sync failed for {emergency_id}: no document matched")

            time.sleep(5)  

        except Exception as e:
            print(f"Polling error: {e}")
            time.sleep(5)

thread = threading.Thread(target=poll_firebase_to_mongo, daemon=True)
thread.start()
print("Polling thread initiated")