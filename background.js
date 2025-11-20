// PTA-Extension background.js v0.2.0
// Handles product import requests and validates responses

chrome.runtime.onInstalled.addListener(() => {
  console.log("PTA-Extension installed.");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "IMPORT_PRODUCT") {
    chrome.storage.sync.get(["endpoint"], (data) => {
      const endpoint =
        data.endpoint ||
        "http://localhost/wp-json/protraxer/v1/import-amazon";

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      })
        .then(async (res) => {
          const text = await res.text();
          let json;
          try {
            json = JSON.parse(text);
          } catch (e) {
            console.error("Import failed: Response not JSON", text);
            sendResponse({
              success: false,
              error: "Response not JSON",
              raw: text.slice(0, 200),
            });
            return;
          }

          if (!res.ok) {
            console.error("Import failed:", json);
            sendResponse({
              success: false,
              error: json.message || "Server error",
              raw: json,
            });
            return;
          }

          const pid = json?.product_id;
          if (typeof pid !== "number" || pid <= 0) {
            console.error("Import failed: Invalid product_id", json);
            sendResponse({
              success: false,
              error: "Invalid product_id",
              raw: json,
            });
            return;
          }

          console.log("Product imported:", json);
          sendResponse({ success: true, result: json });
        })
        .catch((err) => {
          console.error("Import failed:", err);
          sendResponse({ success: false, error: err.toString() });
        });
    });
    return true; // keep channel open for async response
  }
});