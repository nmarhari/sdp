# Use case number: UC-001

## Use case name: User Login

Description and goal: Allow registered users to securely log in to the app to access their personalized dashboard and content. The goal is to authenticate users based on their credentials.

Actor: User (registered app user)

Primary actor: User

Stakeholders:

Users: Want secure and easy access to their accounts.
Developers: Want the system to be reliable and secure.
Company: Wants to ensure that only authorized users access the platform.
Pre-conditions:

User has a registered account.
The login system is online and operational.
User has access to valid login credentials (username/password).
Triggers:

The user navigates to the login page and attempts to log in.
Post-conditions:

Success: User is authenticated and redirected to their dashboard.
Failure: User receives an error message and remains on the login page.
Basic flow:

User navigates to the login page.
User enters valid credentials (username and password).
System validates the credentials.
System redirects the user to their dashboard.
Alternative path:

Invalid Credentials:
The user enters invalid credentials.
The system displays an error message: "Invalid username or password."
The user remains on the login page and can attempt to log in again.
Forgotten Password:
The user clicks "Forgot Password."
The system prompts the user to enter their email for password recovery.
The system sends a password reset email.
