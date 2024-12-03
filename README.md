# sdp
GitHub reporsitory for the Software Development Project team CarbCounter.

## Requirements:
- Python 3.0+
- Expo
- Node Package Manager
- Expo Go on a mobile device OR a device simulator (XCode iOS simulator recommended)
- A Dexcom Client ID and Client Secret from the Dexcom API
- An OpenAI API Key

## To run:
Note: Commands may vary based on operating system or version of software.
Use two terminals for running this project, one for the frontend, one for the backend.
- Run command `python -m venv <path_of_your_choosing>` (can optionally use conda) in both terminals to create environments for the fronend and backend.
- Create a file named `.env` in Backend, and populate it with:
`DEXCOM_CLIENT_ID='<id>'`
`DEXCOM_CLIENT_SECRET='<secret>`
`OPENAI_API_KEY='<key>'`

### In terminal one (backend):
- Run command `cd Backend`
- Run command `python -m pip install -r requirements.txt`
- Run command `python app.py`

### In terminal two (frontend):
- Run command `cd CarbCounter`
- Run command `npm install`
- Run command `npm fund`
- Run command `npx expo start`
- Press `SHIFT + I` and select the device you would like to emulate.
- Enter info and go!