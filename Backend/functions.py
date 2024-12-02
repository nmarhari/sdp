import datetime
from datetime import timedelta
import json
import requests


def openai_api_call(image_base64, prompt, api_key):
    # OpenAI endpoint
    endpoint = 'https://api.openai.com/v1/chat/completions'
    # Define headers for OpenAI API
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    # Define payload to send to OpenAI
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a food nutrition assistant. Only respond with JSON plaintext, following the format '{ 'carbs': CARBS_AS_INTEGER }'. \
                             Do NOT use markdown or any non-alphanumeric characters other than {, }, :, and ' "
                    }
                ]
            },

            {"role": "user", "content": [
                    {"type": "image_url", "image_url": {
                            "url": image_base64
                        }
                    },
                    {"type": "text", "text": prompt}
                ]
            }
        ],
        "temperature": 0.5,
        "max_tokens": 300
    }
    # Make the request to OpenAI API
    response = requests.post(endpoint, headers=headers, json=payload)
    # print(response.json())
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