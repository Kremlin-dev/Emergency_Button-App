import json
from channels.generic.websocket import AsyncWebsocketConsumer
from db_connection import db

class LocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.room_name = "location_updates"
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        employee_id = data["employeeId"]
        company_code = data["companyCode"]
        latitude = data["latitude"]
        longitude = data["longitude"]
        category = data["category"]

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
                    "message": json.dumps({
                        "emergencyId": emergency["emergencyId"],
                        "employeeId": employee_id,
                        "latitude": latitude,
                        "longitude": longitude
                    })
                }
            )
        else:
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
                    "message": json.dumps(new_emergency)
                }
            )

    async def send_update(self, event):
        await self.send(text_data=event["message"])
