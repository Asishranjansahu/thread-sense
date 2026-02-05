console.log("ThreadSense: Content Script Loaded");

// 1. Create Floating Button
function createFloatingButton() {
    const btn = document.createElement("div");
    btn.className = "threadsense-float-btn";
    btn.title = "Summarize Thread";
    btn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  `;

    btn.onclick = openModal;
    document.body.appendChild(btn);
}

// 2. Create Modal Iframe
let modalOverlay;

function createModal() {
    modalOverlay = document.createElement("div");
    modalOverlay.className = "threadsense-overlay";

    const modal = document.createElement("div");
    modal.className = "threadsense-modal";

    const closeBtn = document.createElement("div");
    closeBtn.className = "threadsense-close";
    closeBtn.innerHTML = "×";
    closeBtn.onclick = closeModal;

    // We use the localhost app as the source for the modal
    const iframe = document.createElement("iframe");
    iframe.className = "threadsense-iframe";
    // Point to your running local web app
    iframe.src = "http://localhost:5173";

    modal.appendChild(closeBtn);
    modal.appendChild(iframe);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Close on outside click
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) closeModal();
    };
}

function openModal() {
    if (!modalOverlay) createModal();
    modalOverlay.classList.add("active");

    // Optional: Send the current URL to the iframe via postMessage
    const iframe = modalOverlay.querySelector("iframe");
    setTimeout(() => {
        iframe.contentWindow.postMessage({ type: "ANALYZE_URL", url: window.location.href }, "*");
    }, 1000); // Wait for load
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove("active");
}

// 3. Listen for Messages (from Background or Iframe)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "OPEN_SUMMARY") {
        openModal();
    }
});

// Run
if (window.location.href.includes("reddit.com")) {
    createFloatingButton();

    // Auto-Summarize on Thread Pages
    if (window.location.href.includes("/comments/")) {
        console.log("ThreadSense: Post detected. Auto-summarizing...");
        // Delay slightly to ensure page and iframe are ready
        setTimeout(openModal, 1500);
    }
}
