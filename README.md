# Emergency_Button-App
For Emergency response 



import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .db_connection import db

class LocationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        """Connects client and adds to the Redis group."""
        self.room_name = "location_updates"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """Removes client from Redis group on disconnect."""
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive_json(self, data):
        """Processes incoming WebSocket messages."""
        employee_id = data.get("employeeId")
        company_code = data.get("companyCode")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        category = data.get("category")

        if not all([employee_id, company_code, latitude, longitude, category]):
            return  

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
            # Create a new emergency entry
            new_emergency = {
                "emergencyId": str(db["emergency"].count_documents({}) + 1).zfill(6),
                "employeeId": employee_id,
                "companyCode": company_code,
                "category": category,
                "status": "active",
                "locations": [{"lat": latitude, "lng": longitude}],
                "createdAt": data["createdAt"]
            }
            db["emergency"].insert_one(new_emergency)

            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "send_update",
                    **new_emergency
                }
            )

    async def send_update(self, event):
        """Sends updated location to frontend via WebSocket."""
        await self.send_json(event)
