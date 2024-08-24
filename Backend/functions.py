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

