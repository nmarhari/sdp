## Use Case 1: Dexcom Login and Setup

### Description:
This use case allows the user to log in with their Dexcom account and grant the app access to their real-time blood glucose data.

### Actor:
- **Primary User**: A person with diabetes using a Dexcom continuous glucose monitor (CGM).

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

## Use Case 02: Estimating Insulin Dosage from Food Image

### Description:
This use case allows the user to upload a photo of a meal, which the system processes to estimate the number of carbohydrates and suggest the appropriate insulin dosage based on the user's carb-to-insulin ratio and real-time blood glucose levels.

### Actor:
- **User**: A person with diabetes requiring insulin management.

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
  - If the Dexcom API is unavailable or fails to return data, an error message is displayed: "Unable to retrieve blood glucose levels. Please try login to Dexcom, and redirects them to [Use Case 1](https://github.com/nmarhari/sdp/blob/lab4/documentation/usecase.md#use-case-1-dexcom-login-and-setup)

- **Incorrect Carb-to-Insulin Ratio**:  
  - If the carb-to-insulin ratio is missing or invalid, the system prompts the user to update it and redirects them to [Use Case 3](https://github.com/nmarhari/sdp/blob/lab4/documentation/usecase.md) before processing the request.

---

## Use Case 03: Setting or Updating Carb-to-Insulin Ratio

### Description:
Allows users to set or update their carb-to-insulin ratio, which is used to calculate the correct insulin dosage for their meals.

### Actor:
- **Primary User**: A person with diabetes requiring insulin management.

### Stakeholders:
- **Users**: Need an accurate ratio for insulin dosage calculations.
- **Doctors/Healthcare Providers**: May provide updated ratios based on medical advice.

### Pre-conditions:
- The user has an understanding of their correct carb-to-insulin ratio from their healthcare provider.

### Triggers:
- The user navigates to the settings or preferences page and selects the option to set or update their carb-to-insulin ratio.

### Post-conditions:
- **Success**: The system stores the updated ratio for use in future calculations.
- **Failure**: The system displays an error if the input is invalid.

### Basic flow:
1. The user selects the option to update the carb-to-insulin ratio.
2. The user enters the new ratio as a decimal or integer.
3. The system validates the input.
4. The system stores the updated ratio for future use.
5. The system confirms the successful update.

### Alternative path:
- **Invalid Input**:  
  - If the input is not a valid decimal or integer, the system displays an error message: "Invalid ratio. Please enter a valid number."

---
