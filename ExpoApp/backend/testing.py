import requests
import datetime
from datetime import timedelta
import os
from dotenv import load_dotenv
import json

load_dotenv()
dexcom_token = os.getenv('DEXCOM_TOKEN')
print(dexcom_token)

endpoint = "https://api.dexcom.com/v3/users/self/egvs"

endDate = datetime.datetime.now()
startDate = endDate -timedelta(days=7)

query = {
    "startDate": startDate.strftime("%Y-%m-%dT%H:%M:%S"),
    "endDate": endDate.strftime("%Y-%m-%dT%H:%M:%S")
}

headers = {"Authorization": f"Bearer {dexcom_token}"}
print(headers)
print(query)

print('\n\n\n')

response = requests.get(endpoint, headers=headers, params=query)

data = response.status_code
print(data)