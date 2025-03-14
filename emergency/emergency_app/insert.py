import pandas as pd
from datetime import datetime, timezone
from pymongo import MongoClient

# Load CSV file with dtype to enforce string for Employee ID
file_path = "AGADBCSVo.csv"
df = pd.read_csv(file_path, dtype={"Employee ID": str})

# MongoDB connection setup
client = MongoClient("mongodb+srv://Kremlin:ch5BDbt8xwWLL59f@kremlin.cx70k.mongodb.net/?retryWrites=true&w=majority&appName=Kremlin")
db = client["emergency_app"]
company_collection = db["companies"]

# Define default company details
company_data = {
    "companyCode": "AFGHOB",
    "admin_code": "admin",
    "password": "admin",
    "companyName": "Afghan Hope",
    "created_at": datetime.now(timezone.utc).isoformat(),  # Changed to timezone.utc
    "employees": []
}

# Process employee data from CSV
for _, row in df.iterrows():
    employee = {
        "employeeId": str(row["Employee ID"]).strip(),
        "name": row["Name"],
        "email": row["Email"],
        "department": row["Department"],
        "jobTitle": row["Job Title"],
        "phone": row["Phone"]
    }
    company_data["employees"].append(employee)

# Debug: Print a few employee IDs to verify
print("Sample employee IDs before insertion:")
for emp in company_data["employees"][:3]:
    print(emp["employeeId"])

# Insert into MongoDB
insert_result = company_collection.insert_one(company_data)
print(f"Inserted company with ID: {insert_result.inserted_id}")