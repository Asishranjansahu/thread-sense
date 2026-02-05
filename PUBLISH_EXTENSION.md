# 🌐 Chrome Web Store: Publisher's Guide

This guide walks you through packaging and publishing the **ThreadSense Operative Extension** to the Chrome Web Store.

---

## 📦 Phase A: Final Configuration

### 1. Set Production URLs
Open `extension/config.js` and update the URLs to your deployed backend/frontend:
```javascript
const CONFIG = {
    API_URL: "https://thread-sense-api.onrender.com", // Your Backend URL
    FRONTEND_URL: "https://thread-sense.vercel.app"   // Your Vercel URL
};
```

### 2. Generate Brand Assets
You need 3 icon files in the `extension/` folder. You can use any 1:1 image (e.g., your logo).
*   `icon16.png` (16x16px)
*   `icon48.png` (48x48px)
*   `icon128.png` (128x128px)

> **Tip:** You can use an online resizer tool to generate these from your main logo.

---

## 🤐 Phase B: Packaging

### 1. Create the Zip File
You need to zip the **contents** of the extension folder (not the folder itself).

**Mac/Linux Terminal:**
```bash
cd extension
zip -r ../threadsense-extension-v1.zip .
```

---

## 🚀 Phase C: Store Submission

1.  **Register as a Developer**: Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard) and pay the one-time $5 fee.
2.  **Create New Item**: Click "Add new item" and upload the `threadsense-extension-v1.zip` file.
3.  **Store Listing Details**:
    *   **Description**: "ThreadSense: AI-Powered Reddit Intelligence. Instantly summarize and analyze Reddit threads using local neural networks."
    *   **Category**: "Productivity" or "Search Tools".
    *   **Privacy Policy**: Link to your privacy policy. We have created a `PRIVACY_POLICY.md` file in your project root. You can host this text on [GitHub Gist](https://gist.github.com) or a simple Vercel page and paste the link here.
4.  **Permissions Justification**:
    *   `activeTab`: "To read the current page URL and content when the user clicks the extension."
    *   `scripting`: "To inject the summarization modal into Reddit pages."
    *   `contextMenus`: "To allow right-click summarization."
    *   `storage`: "To save the user's authentication token."
    *   `host_permissions`: "To communicate with the ThreadSense API for AI processing."

### 5. Publish!
Click "Submit for Review". Compliance review usually takes 24-48 hours.

---

## 🛠 Troubleshooting

*   **"Manifest is not valid"**: Ensure you didn't include comments in `manifest.json`.
*   **"Icon missing"**: Verify all 3 icon files exist in the zip.
*   **"Violates policy"**: Ensure your Privacy Policy clearly states what data you collect (User inputs, Reddit public data).
