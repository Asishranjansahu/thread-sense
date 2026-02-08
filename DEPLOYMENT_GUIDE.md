# ThreadSense Deployment Guide

## 1. Backend Deployment (Render)

We have configured the project for automated deployment on Render.

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Create Service on Render**:
    *   Log in to [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Blueprints**.
    *   Connect your GitHub repository.
    *   Render will automatically detect the `render.yaml` file in the root directory.
    *   Click **Apply**.
3.  **Environment Variables**:
    *   The `render.yaml` file defines the necessary environment variables.
    *   You will need to manually enter the values for sensitive keys (like `MONGO_URI`, `GOOGLE_API_KEY`, etc.) in the Render dashboard after the service is created.
4.  **Get URL**:
    *   Once deployed, note down your backend URL (e.g., `https://thread-sense-api.onrender.com`).

## 2. Frontend Deployment (Vercel)

1.  **Create Project**:
    *   Log in to [Vercel](https://vercel.com/).
    *   Click **Add New...** -> **Project**.
    *   Import your `thread-sense` repository.
2.  **Configure Build**:
    *   Framework Preset: `Vite` (usually detected automatically).
    *   Root Directory: `./` (default).
3.  **Environment Variables**:
    *   Add the following variables in the Vercel dashboard:
        *   `VITE_API_URL`: Your Render Backend URL (e.g., `https://thread-sense-api.onrender.com`).
        *   `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
4.  **Deploy**: Click **Deploy**.

## 3. Mobile App (Android APK)

The Android APK has been built locally.

*   **Location**: `android/app/build/outputs/apk/debug/app-debug.apk`
*   **Installation**:
    1.  Transfer this `.apk` file to your Android device (via USB, Google Drive, etc.).
    2.  Tap the file to install.
    3.  You may need to allow "Install from Unknown Sources" in your phone settings.

### Rebuilding the APK
If you make changes to the frontend code:

1.  **Rebuild Web Assets**:
    ```bash
    npm run build
    ```
2.  **Sync with Capacitor**:
    ```bash
    npx cap sync
    ```
3.  **Build APK**:
    ```bash
    cd android
    ./gradlew assembleDebug
    ```

## 4. Google OAuth Configuration

To make Google Sign-In work in production:

1.  Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2.  Edit your OAuth 2.0 Client ID.
3.  **Authorized JavaScript origins**:
    *   Add your Vercel domain (e.g., `https://thread-sense.vercel.app`).
4.  **Authorized redirect URIs**:
    *   Add your Vercel domain (e.g., `https://thread-sense.vercel.app`).
