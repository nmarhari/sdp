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
 
---

# Use Case: Setting Carb-to-Insulin Ratio

## Use case number: UC-003

### Use case name: Setting or Updating Carb-to-Insulin Ratio

### Description and goal:
Allows users to set or update their carb-to-insulin ratio, which is used to calculate the correct insulin dosage for their meals.

### Actor:
- **User**: A person with diabetes requiring insulin management.

### Primary actor:
- **User**

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

# Use Case: Viewing Meal and Insulin History

## Use case number: UC-004

### Use case name: Viewing Meal and Insulin History

### Description and goal:
Allows users to view a history of their meals, estimated insulin doses, and blood glucose levels for tracking and review purposes.

### Actor:
- **User**: A person with diabetes requiring insulin management.

### Primary actor:
- **User**

### Stakeholders:
- **Users**: Need to track their meals and insulin dosage over time for better diabetes management.
- **Doctors/Healthcare Providers**: May review the logs during checkups to adjust treatment plans.

### Pre-conditions:
- The user has taken previous photos of meals and received insulin dosage estimates.

### Triggers:
- The user selects the option to view their meal and insulin history from the app menu.

### Post-conditions:
- **Success**: The system displays a log of meals, insulin estimates, and blood glucose levels.
- **Failure**: An error message is displayed if there is no data available or a technical issue occurs.

### Basic flow:
1. The user selects the option to view their meal and insulin history.
2. The system retrieves the saved data from previous sessions.
3. The system displays a list of meals, corresponding insulin estimates, and glucose levels.
4. The user can scroll through or filter the history by date.

### Alternative path:
- **No Data Available**:  
  - If there are no previous meals recorded, the system displays a message: "No meal history available."

---

# Use Case: Generating Insulin and Meal Reports for Healthcare Providers

## Use case number: UC-005

### Use case name: Generating Insulin and Meal Reports for Healthcare Providers

### Description and goal:
Allows users to generate a report of their meal and insulin history to share with their healthcare provider for analysis and advice.

### Actor:
- **User**: A person with diabetes requiring insulin management.

### Primary actor:
- **User**

### Stakeholders:
- **Users**: Need to share accurate data with their healthcare providers.
- **Doctors/Healthcare Providers**: Need access to detailed data to adjust treatment plans.

### Pre-conditions:
- The user has recorded meal and insulin data in the app.

### Triggers:
- The user selects the option to generate a report from their history.

### Post-conditions:
- **Success**: The system generates a report and allows the user to share it via email or download it as a PDF.
- **Failure**: The system displays an error if there is no data available or an issue occurs.

### Basic flow:
1. The user selects the option to generate a report.
2. The system retrieves the meal and insulin data from the user’s history.
3. The system formats the data into a readable report.
4. The user selects to either download the report as a PDF or share it via email.
5. The system confirms the report generation and download or sharing.

### Alternative path:
- **No Data Available**:  
  - If there is no data available, the system displays a message: "No data available for report generation."

---

# Use Case: Insulin Reminder Notifications

## Use case number: UC-006

### Use case name: Insulin Reminder Notifications

### Description and goal:
Send reminders to the user to estimate their insulin dosage when the system detects that they haven’t uploaded a meal photo for a while.

### Actor:
- **User**: A person with diabetes requiring insulin management.

### Primary actor:
- **User**

### Stakeholders:
- **Users**: Need reminders to ensure they regularly estimate their insulin doses.
- **Doctors/Healthcare Providers**: May encourage regular insulin management and monitoring.

### Pre-conditions:
- The user has not used the app to estimate insulin for a certain period of time (e.g., several hours or days).

### Triggers:
- The system detects that the user has not uploaded a meal photo in a set timeframe.

### Post-conditions:
- **Success**: The system sends a notification reminding the user to estimate insulin dosage for their next meal.
- **Failure**: The system does not send a reminder if the user has disabled notifications.

### Basic flow:
1. The system tracks the time since the user last uploaded a meal photo.
2. If the user has not uploaded a photo within the set timeframe, the system sends a reminder notification.
3. The user opens the app and uploads a new meal photo for estimation.
4. The system processes the meal as per the insulin estimation use case.

### Alternative path:
- **User Disables Notifications**:  
  - If notifications are disabled, the system does not send a reminder.
