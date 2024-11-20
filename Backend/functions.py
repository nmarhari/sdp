import datetime
from datetime import timedelta
import json
import requests


def openai_api_call(image_base64, prompt, api_key):
    # OpenAI endpoint
    endpoint = 'https://api.openai.com/v1/chat/completions'

    # Define headers for OpenAI API
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }

    # Define payload to send to OpenAI
    payload = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": "You are a food nutrition assistant."},
            {"role": "user", "content": f"Image Data (Base64): {image_base64}"},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5
    }

    # Make the request to OpenAI API
    response = requests.post(endpoint, headers=headers, json=payload)
    response.raise_for_status()  # Raise exception for HTTP errors
    return response.json()

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