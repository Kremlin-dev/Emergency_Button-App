from datetime import datetime
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import db
import secrets

def generate_secure_id():
    return secrets.randbelow(900000) + 100000  

def parse_datetime(datetime_str):
    try:
        return datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        return datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%SZ")

class LocationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = "location_updates"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive_json(self, data):
        try:
            employee_id = data.get("employeeId")
            company_code = data.get("companyCode")
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            category = data.get("category")
            created_at = data.get("createdAt")

            if not all([employee_id, company_code, latitude, longitude, category, created_at]):
                return  

            latitude = float(latitude)
            longitude = float(longitude)

            emergency = db["emergency"].find_one({"employeeId": employee_id, "status": "active"})

            if emergency:
                if emergency["status"] == "resolved":
                    return  

                db["emergency"].update_one(
                    {"_id": emergency["_id"]},
                    {"$push": {"locations": {"lat": latitude, "lng": longitude}}}
                )

                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        "type": "send_update",
                        "emergencyId": emergency["emergencyId"],  
                        "employeeId": employee_id,
                        "latitude": latitude,
                        "longitude": longitude
                    }
                )

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
                db["emergency"].insert_one(new_emergency)

                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        "type": "send_update",
                        "emergencyId": new_emergency["emergencyId"],
                        "employeeId": new_emergency["employeeId"],
                        "latitude": new_emergency["locations"][-1]["lat"],  
                        "longitude": new_emergency["locations"][-1]["lng"] 
                    }
                )

        except Exception as e:
            print(f"Error in receive_json: {e}")

    async def send_update(self, event):
        await self.send_json({
            "emergencyId": event.get("emergencyId", "N/A"),
            "employeeId": event.get("employeeId", "N/A"),
            "latitude": event.get("latitude", 0.0),  
            "longitude": event.get("longitude", 0.0)
        })
