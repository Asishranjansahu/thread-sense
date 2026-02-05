# 📱 Mobile Store Publication Guide

This guide details how to build and submit the **ThreadSense Mobile App** to the Google Play Store and Apple App Store.

---

## 🏗 Phase A: Preparation

### 1. Install EAS CLI
EAS (Expo Application Services) is the tool we use to build the app binaries in the cloud.
```bash
npm install -g eas-cli
```

### 2. Login to Expo
Create a free account at [expo.dev](https://expo.dev) and login via terminal:
```bash
eas login
```

### 3. Configure Project
Run this command in the `mobile/` directory to link your project:
```bash
cd mobile
eas build:configure
```

---

## 🤖 Phase B: Android (Google Play Store)

### 1. Build the Bundle (.aab)
Run the build command for Android:
```bash
eas build --platform android --profile production
```
*   This will ask you to generate a **Keystore**. Select "Yes" to let Expo manage it for you.
*   Wait for the build to finish. It will give you a download link for an `.aab` file.

### 2. Submit to Play Console
1.  Go to [Google Play Console](https://play.google.com/console) ($25 one-time fee).
2.  **Create App**: Enter "ThreadSense" as the app name.
3.  **Store Listing**: Upload screenshots, description, and the "Privacy Policy" link (use the same one we created earlier).
4.  **Production Release**: Upload the `.aab` file you downloaded from Expo.
5.  **Review**: Submit for review (takes 2-7 days).

---

## 🍎 Phase C: iOS (Apple App Store)

*Requirement: You must have an Apple Developer Account ($99/year).*

### 1. Build the Binary (.ipa)
Run the build command for iOS:
```bash
eas build --platform ios --profile production
```
*   This will ask you to log in with your Apple ID.
*   It will handle Certificates and Provisioning Profiles automatically.

### 2. Transporter
Once the build is complete, use the **Transporter** app (on Mac) to upload the `.ipa` file to App Store Connect.

### 3. Submit to App Store Connect
1.  Go to [App Store Connect](https://appstoreconnect.apple.com).
2.  **My Apps**: Create a new app "ThreadSense".
3.  **TestFlight**: Your uploaded build will appear here first.
4.  **App Store**: Move the build to the "App Store" tab, fill out the metadata (Screenshots, Description, Keywords).
5.  **Submit for Review**: (Takes 24-48 hours).

---

## 🎨 Asset Checklist before Building
Ensure you replace the placeholder images in `mobile/assets/` with your actual branded assets:
*   `icon.png` (1024x1024) - App Icon
*   `splash.png` (1242x2436) - Loading Screen
*   `adaptive-icon.png` (1024x1024) - Android specific icon

---

## ⚠️ Important Note on Backend
Your mobile app CANNOT connect to `localhost`.
Ensure you have edited `mobile/App.js` and set `const API` to your deployed backend URL (e.g., `https://your-app.onrender.com`).
