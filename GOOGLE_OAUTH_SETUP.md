# Google OAuth Setup Guide

This guide covers the steps required to set up Google OAuth for your application. Follow the instructions below to configure Google OAuth properly.

## Prerequisites
- A Google account.
- Access to the project in Google Cloud Console.

## Step 1: Create a New Project in Google Cloud Console
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown and select "New Project."
3. Enter the project name and click on "Create."

## Step 2: Enable Google OAuth API
1. In the Google Cloud Console, navigate to the **APIs & Services** > **Library**.
2. Search for "Google People API" or "Google OAuth API."
3. Select the API and click on the "Enable" button.

## Step 3: Configure OAuth Consent Screen
1. In the Google Cloud Console, navigate to **APIs & Services** > **OAuth consent screen**.
2. Choose a User Type (Internal or External) and click on "Create."
3. Fill in the required fields (App name, User support email, etc.).
4. Click on "Save and Continue." You may skip Scopes configuration for now.
5. Click on "Back to Dashboard" once the configuration is complete.

## Step 4: Create Credentials
1. Go to **APIs & Services** > **Credentials.**
2. Click on the `+ CREATE CREDENTIALS` button and select `OAuth client ID`.
3. Choose the application type (Web Application, iOS, Android, etc.).
4. Enter the required details (Name, Authorized redirect URIs, etc.).
5. Click on "Create."
6. Note down the Client ID and Client Secret.

## Step 5: Implement OAuth 2.0 in Your Application
1. Install any required libraries for OAuth (e.g., Passport.js for Node.js applications).
2. Use the Client ID and Client Secret in the configuration.
3. Set up routes to handle authentication and callback.
4. Ensure to handle tokens securely.

## Step 6: Testing the Setup
1. Run your application.
2. Navigate to the login route you set up.
3. Ensure you can log in using the Google account and that information is retrieved correctly.

## Troubleshooting
- If you encounter errors, check the logs for detailed error messages.
- Ensure all URIs are correctly configured in the Google Cloud Console.

## Conclusion
You have successfully set up Google OAuth for your application. Always make sure to follow best practices for security and token management.