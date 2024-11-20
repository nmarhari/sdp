from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
from functions import openai_api_call, dexcom_api_request
from datetime import datetime, timedelta
from dotenv import load_dotenv
import requests
import base64
load_dotenv()
# Set your OpenAI API key as an environment variable for security
# Configuration for Dexcom API (replace with your values)
# DEXCOM_CLIENT_ID = 'Exc6hrFQoZtwuSwD5i3OWHt1LuGLuQ47'
# DEXCOM_CLIENT_SECRET = 'KQBZBWTBkxVvE9qp'
DEXCOM_CLIENT_ID = os.getenv('DEXCOM_CLIENT_ID')
DEXCOM_CLIENT_SECRET = os.getenv('DEXCOM_CLIENT_SECRET')
DEXCOM_TOKEN_URL = 'https://sandbox-api.dexcom.com/v2/oauth2/token'
DEXCOM_REDIRECT_URI = 'https://auth.expo.io/@cpavlic/carbcounter'  # Must match the redirect URI in your React Native app
openai_api_key = os.getenv('OPENAI_API_KEY')
dexcom_token = os.getenv('DEXCOM_TOKEN')

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:8081"}})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello, World!"})



@app.route('/upload-image', methods=['POST'])
def upload_image():
    # Check if an image file is present in the request
    print("Hey I got the image")
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    # Get the uploaded image file from the request
    image = request.files['image']
    # Read the image as binary data
    image_data = image.read()
    # Encode the image as Base64 (if required by OpenAI or downstream services)
    image_base64 = base64.b64encode(image_data).decode('utf-8')
    # Define the prompt
    prompt = (
        "How many grams of carbs are in the food in this image? "
        "Respond in only JSON format with an integer corresponding to the amount of carbs."
    )
    # Call OpenAI API
    try:
        response = openai_api_call(image_base64, prompt, openai_api_key)
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to handle the exchange of authorization code for access and refresh tokens
@app.route('/exchange-code', methods=['POST'])
def exchange_code():
    print("this is working")
    # Get the authorization code from the client request
    data = request.get_json()
    code = data.get('code')
    redirect_uri = data.get('redirectUri')
    print(code, redirect_uri, DEXCOM_CLIENT_ID, DEXCOM_CLIENT_SECRET)
    # Request the access token from Dexcom
    try:
        token_response = requests.post(
            DEXCOM_TOKEN_URL,
            data={
                'client_id': DEXCOM_CLIENT_ID,
                'client_secret': DEXCOM_CLIENT_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        # Check if the request was successful
        if token_response.status_code == 200:
            # Parse the JSON response
            tokens = token_response.json()
            return jsonify(tokens), 200
        else:
            return jsonify({'error': 'Failed to exchange authorization code'}), token_response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to refresh the access token using the refresh token
@app.route('/refresh-token', methods=['POST'])
def refresh_token():
    # Get the refresh token from the client request
    data = request.get_json()
    refresh_token = data.get('refresh_token')

    # Request a new access token using the refresh token
    try:
        token_response = requests.post(
            DEXCOM_TOKEN_URL,
            data={
                'client_id': DEXCOM_CLIENT_ID,
                'client_secret': DEXCOM_CLIENT_SECRET,
                'refresh_token': refresh_token,
                'grant_type': 'refresh_token'
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        # Check if the request was successful
        if token_response.status_code == 200:
            tokens = token_response.json()
            return jsonify(tokens), 200
        else:
            return jsonify({'error': 'Failed to refresh token'}), token_response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/fetch-glucose-data', methods=['POST'])
def fetch_glucose_data():
    # Extract the access token from the request headers
    access_token = request.headers.get('Authorization').split(' ')[1]

    # Extract lastSyncTime from the request body
    data = request.get_json()

    # Get current date and time (UTC)

    current_date = datetime.utcnow()

        # Parse the cleaned last_sync_time
    start_date = current_date - timedelta(days=7)

    # The end date will always be the current time
    end_date = current_date

    # Format start_date and end_date to the format expected by the Dexcom API (YYYY-MM-DDTHH:mm:ss)
    start_date_str = start_date.strftime('%Y-%m-%dT%H:%M:%S')
    end_date_str = end_date.strftime('%Y-%m-%dT%H:%M:%S')
    # Request glucose data from the Dexcom API
    try:
        response = requests.get(
            'https://sandbox-api.dexcom.com/v2/users/self/egvs',
            headers={'Authorization': f'Bearer {access_token}'},
            params={
                'startDate': start_date_str,
                'endDate': end_date_str
            }
        )
        
        if response.status_code == 200:
            glucose_data = response.json()
            return jsonify(glucose_data), 200
        else:
            print(f"Error from Dexcom API: {response.status_code}, {response.text}")
            return jsonify({'error': 'Failed to fetch glucose data'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)