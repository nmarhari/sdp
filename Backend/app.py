from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    if image:
        # Save the file to the uploads directory
        image_path = os.path.join(UPLOAD_FOLDER, image.filename)
        try:
            image.save(image_path)
            return jsonify({"message": "Image uploaded successfully", "path": image_path}), 200
        except Exception as e:
            return jsonify({"error": f"Error handling image: {str(e)}"}), 500

    return jsonify({"error": "Invalid file"}), 400


if __name__ == '__main__':
    app.run(debug=True)
