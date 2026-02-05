chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarize-thread",
        title: "Summarize this thread",
        contexts: ["page", "link"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarize-thread") {
        // Send message to content script to open modal
        chrome.tabs.sendMessage(tab.id, { action: "OPEN_SUMMARY" });
    }
});

// Listen for login sync from Web App (localhost)
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if (request.type === "LOGIN_SYNC" && request.token) {
        chrome.storage.local.set({ token: request.token }, () => {
            console.log("Token synced to extension!");
            sendResponse({ success: true });
        });
        return true; // Keep channel open for async response
    }
});
