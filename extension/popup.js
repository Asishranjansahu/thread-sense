const summarizeBtn = document.getElementById("summarize");
const resultDiv = document.getElementById("result");

summarizeBtn.onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;

    if (!url.includes("reddit.com")) {
        resultDiv.innerText = "Error: Please open a Reddit thread to begin analysis.";
        return;
    }

    summarizeBtn.innerText = "Interrogating AI...";
    summarizeBtn.disabled = true;
    resultDiv.innerText = "Establishing link to neural network...";

    try {
        const res = await fetch(`${CONFIG.API_URL}/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        if (!res.ok) throw new Error("Connection failed");

        const data = await res.json();
        resultDiv.innerText = data.summary;
    } catch (e) {
        resultDiv.innerText = "Transmission Interrupted: Backend offline or Reddit blocked.";
    } finally {
        summarizeBtn.innerText = "Analyze Current Thread";
        summarizeBtn.disabled = false;
    }
};