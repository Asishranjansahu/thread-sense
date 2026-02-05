# 🖥️ Desktop Application Publication Guide

This guide details how to build and distribute the **ThreadSense Desktop** application for macOS, Windows, and Linux using Electron and Electron Builder.

---

## 🏗 Phase A: Preparation

### 1. Install Dependencies
Ensure you have the build tools installed (we added them to your `package.json`):
```bash
npm install
```

### 2. Configure Icon
For a professional release, you need an application icon.
*   **Mac**: `build/icon.icns`
*   **Windows**: `build/icon.ico`
*   **Linux**: `build/icon.png`

Create a `build` folder in the root directory and place your icons there.

---

## 📦 Phase B: Building the App

Run the build script we configured:
```bash
npm run electron:build
```

This will:
1.  Compile your React frontend (Vite).
2.  Package the Electron shell.
3.  Output runnable installers to the `dist/` folder.

### Output Files:
*   **macOS**: `dist/ThreadSense-1.0.0.dmg` (Drag-and-drop installer)
*   **Windows**: `dist/ThreadSense Setup 1.0.0.exe`
*   **Linux**: `dist/ThreadSense-1.0.0.AppImage`

---

## 🚀 Phase C: Distribution

### 1. Code Signing (Optional but Recommended)
*   **macOS**: To avoid "Unidentified Developer" warnings, you need an Apple Developer ID ($99/yr) and must sign your app using Xcode utilities.
*   **Windows**: You need a code signing certificate (e.g., from Sectigo) to avoid SmartScreen warnings.

### 2. Auto-Updates
To enable auto-updates, you can use `electron-updater`.
1.  Publish your artifacts to GitHub Releases.
2.  The app will check the GitHub repo for new versions on startup.

---

## ⚠️ Important Note on Backend
Your desktop app handles files locally but still connects to your API.
Ensure `extension/config.js` or your environment variables point to your **Production API URL** (not localhost) before building, just like the mobile app.
