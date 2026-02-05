# 🚀 ThreadSense: Installation & Run Guide

## 🖥️ 1. Desktop App (macOS)
**Status:** ✅ Built successfully.

1.  Open the `dist` folder in your project root.
2.  Double-click **`thread-sense-1.0.0-arm64.dmg`**.
3.  Drag "ThreadSense" into your **Applications** folder.
4.  Run it like any other Mac app!

---

## 📱 2. Mobile App (iOS / Android)
**Status:** ⚙️ Dependencies installing...

### Option A: Run locally on your Phone (Quickest)
1.  Download the **Expo Go** app from the App Store / Play Store on your physical phone.
2.  Run this command in your terminal:
    ```bash
    cd mobile
    npx expo start
    ```
3.  Scan the **QR Code** that appears in the terminal with your phone's camera (iOS) or Expo app (Android).
    *   *Note: Ensure your phone and computer are on the same Wi-Fi.*

### Option B: Build Standalone App (.apk / .ipa)
To create a real app file to upload to stores:
```bash
cd mobile
npm install -g eas-cli
eas build --profile production --platform android  # For Android
eas build --profile production --platform ios      # For iOS
```

---

## 🌐 3. Web App
**Status:** 🟢 Running locally.

### Local Development
```bash
npm run dev
```
*   Access at: `http://localhost:5173`

### Cloud Deployment (Public Internet)
Since you pushed your code to GitHub, simply:
1.  Login to **Vercel.com**.
2.  Import your `thread-sense` repo.
3.  Click **Deploy**.
