# Use Case: Dexcom Login

## Use case number: UC-001

### Use case name: Dexcom Login and Setup

### Description and goal:
This use case allows the user to log in with their Dexcom account and grant the app access to their real-time blood glucose data.

### Actor:
- **User**: A person with diabetes using a Dexcom continuous glucose monitor (CGM).

### Primary actor:
- **User**

### Stakeholders:
- **Users**: Want real-time glucose data to help manage their insulin doses.
- **Doctors/Healthcare Providers**: Benefit from patients having access to real-time glucose data.
- **Developers**: Ensure secure and reliable access to Dexcom data.

### Pre-conditions:
- The user has a Dexcom account.
- The user has a working Dexcom CGM device connected to their account.

### Triggers:
- The user selects the option to connect their Dexcom account in the app.

### Post-conditions:
- **Success**: The system successfully retrieves real-time blood glucose data from the user's Dexcom account.
- **Failure**: The system displays an error message if the login or data retrieval fails.

### Basic flow:
1. The user selects the option to connect their Dexcom account.
2. The app redirects the user to the Dexcom login page.
3. The user enters their Dexcom credentials and grants access to the app.
4. The system confirms the connection and starts retrieving real-time blood glucose data.
5. The system stores the user’s Dexcom access token for future data retrieval.

### Alternative path:
- **Login Failed**:  
  - If the user enters incorrect credentials, an error message is displayed: "Login failed. Please check your username and password."
  
- **Connection Failed**:  
  - If the app cannot connect to Dexcom’s API, an error message is displayed: "Unable to connect to Dexcom. Please try again later."

---

# Use Case: Estimating Insulin Dosage from Food Image

## Use case number: UC-002

### Use case name: Estimating Insulin Dosage from Food Image

### Description and goal:
This use case allows the user to upload a photo of a meal, which the system processes to estimate the number of carbohydrates and suggest the appropriate insulin dosage based on the user's carb-to-insulin ratio and real-time blood glucose levels.

### Actor:
- **User**: A person with diabetes requiring insulin management.

### Primary actor:
- **User**

### Stakeholders:
- **Users**: Want an accurate and easy way to calculate insulin dosage for meals.
- **Doctors/Healthcare Providers**: Benefit from accurate insulin management by their patients.
- **Developers**: Ensure the system works reliably and securely.

### Pre-conditions:
- The user has entered a valid carb-to-insulin ratio in the app.
- The system has access to real-time blood glucose levels via Dexcom's API.
- The user has taken a clear photo of a food item.

### Triggers:
- The user uploads a photo of the food item and requests an insulin dosage estimation.

### Post-conditions:
- **Success**: The system returns an estimated insulin dosage to the user based on the carbohydrate content in the food and the user’s real-time blood glucose levels.
- **Failure**: The system provides an error message if the image is unrecognizable or if data from the APIs cannot be retrieved.

### Basic flow:
1. The user takes a photo of the food item.
2. The user uploads the photo through the app.
3. The system sends the photo to OpenAI's API to identify the food and estimate its carbohydrate content.
4. The system retrieves the user's real-time blood glucose levels using the Dexcom API.
5. The system uses the carb-to-insulin ratio provided by the user to calculate the required insulin dosage.
6. The system returns the insulin dosage estimate to the user.

### Alternative path:
- **Unrecognized Image**:  
  - If the system cannot identify the food in the photo, an error message is displayed: "Unable to recognize food. Please try again with a clearer image."
  
- **Missing Blood Glucose Data**:  
  - If the Dexcom API is unavailable or fails to return data, an error message is displayed: "Unable to retrieve blood glucose levels. Please try again later."
  
- **Incorrect Carb-to-Insulin Ratio**:  
  - If the carb-to-insulin ratio is missing or invalid, the system prompts the user to update it before processing the request.
