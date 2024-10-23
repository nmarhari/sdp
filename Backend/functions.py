import datetime
from datetime import timedelta
import json

def openai_api_call(image, prompt, openai_api_key):
    # Define the endpoint
    endpoint = 'https://api.openai.com/v1/images/generations'

    # Define headers
    headers = {
        'Authorization': f'Bearer {openai_api_key}'
    }

    # Define the data to be sent
    files = {
        'file': (image.filename, image, 'image/png'),
        'prompt': (None, prompt)
    }

    # Make the request
    response = requests.post(endpoint, headers=headers, files=files)
    
    # Check for errors
    response.raise_for_status()

    return response

def dexcom_api_request(dexcom_token):
    endpoint = "https://api.dexcom.com/v3/users/self/egvs"

    endDate = datetime.datetime.now()
    startDate = endDate -timedelta(days=7)

    query = {
        "startDate": startDate.strftime("%Y-%m-%dT%H:%M:%S"),
        "endDate": endDate.strftime("%Y-%m-%dT%H:%M:%S")
    }
    headers = {"Authorization": f"Bearer {dexcom_token}"}
    response = requests.get(endpoint, headers=headers, params=query)
    data = response.status_code
    print(data)
    return data