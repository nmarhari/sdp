from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
from functions import openai_api_call, dexcom_api_request

# Set your OpenAI API key as an environment variable for security
# Configuration for Dexcom API (replace with your values)
# DEXCOM_CLIENT_ID = 'Exc6hrFQoZtwuSwD5i3OWHt1LuGLuQ47'
# DEXCOM_CLIENT_SECRET = 'KQBZBWTBkxVvE9qp'
DEXCOM_CLIENT_ID = os.getenv('DEXCOM_CLIENT_ID')
DEXCOM_CLIENT_SECRET = os.getenv('DEXCOM_CLIENT_SECRET')
DEXCOM_TOKEN_URL = 'https://api.dexcom.com/v2/oauth2/token'
DEXCOM_REDIRECT_URI = 'carbcounter://redirect'  # Must match the redirect URI in your React Native app
openai_api_key = os.getenv('OPENAI_API_KEY')
dexcom_token = os.getenv('DEXCOM_TOKEN')

app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files['image']
    prompt = "How many grams of carbs are in the food in this image respond in only JSON format with an integer corresponding to the amount of carbs"
    
    # Call OpenAI API
    try:
        response = openai_api_call(image, prompt, openai_api_key)
        return jsonify(response.json())
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

# Route to get glucose data from the Dexcom API
@app.route('/fetch-glucose-data', methods=['GET'])
def fetch_glucose_data():
    # Extract the access token from the request headers
    access_token = request.headers.get('Authorization').split(' ')[1]

    # Request glucose data from the Dexcom API
    try:
        response = fetch_glucose_data(dexcom_token)
        
        # if response.status_code == 200:
        if response == 200:
            print(response, "200 response code ")

        else: print('did not get 200. ', response)
            # glucose_data = response.json()
        #     return jsonify(glucose_data), 200
        # else:
        #     return jsonify({'error': 'Failed to fetch glucose data'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)