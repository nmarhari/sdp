from flask import Flask, request, jsonify
import requests
import os
from functions import openai_api_call
app = Flask(__name__)

# Set your OpenAI API key as an environment variable for security
openai_api_key = os.getenv('OPENAI_API_KEY')

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files['image']
    prompt = "How many grams of carbs are in the food in this image respond in JSON format with an integer corresponding to the amount of carbs"
    
    # Call OpenAI API
    try:
        response = openai_api_call(image, prompt, openai_api_key)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500







if __name__ == '__main__':
    app.run(debug=True)
