// Built-in fetch (Node 18+)

const validUrl = "https://www.reddit.com/r/javascript/.json";
const userUrl = "https://www.reddit.com/r/SecretsofMollywood/comments/1qvkuec/any_on_ms_kusruti/.json?raw_json=1";

async function fetchUrl(u) {
    console.log("🔥 Fetching:", u);
    try {
        const res = await fetch(u, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5"
            }
        });

        console.log("Status:", res.status);

        const text = await res.text();
        if (res.status === 200) {
            console.log("✅ Success! Body Preview:", text.slice(0, 100));
        } else {
            console.log("❌ Failed/Blocked. Body Preview:", text.slice(0, 500));
        }

    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

async function run() {
    console.log("--- TEST 1: Common Subreddit ---");
    await fetchUrl(validUrl);

    console.log("\n--- TEST 2: User URL ---");
    await fetchUrl(userUrl);
}

run();
