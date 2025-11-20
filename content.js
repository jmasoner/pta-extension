(function() {
  // Utility: retry loop for price capture
  async function getAmazonPrice() {
    const selectors = [
      "#corePriceDisplay_desktop_feature_div .a-price .a-offscreen",
      "#priceblock_ourprice",
      "#priceblock_dealprice",
      "#priceblock_saleprice",
      "#snsPrice"
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.textContent) {
        return el.textContent.replace(/[^0-9.,]/g, "").replace(",", ".");
      }
    }
    return "";
  }

  // Utility: derive keywords from bullet points
  function getKeywords() {
    const bullets = document.querySelectorAll("#feature-bullets li");
    return Array.from(bullets)
      .map(li => li.innerText.trim())
      .filter(Boolean)
      .join(", ");
  }

  // Utility: scrape social tags
  function getSocialTags() {
    return {
      ogTitle: document.querySelector("meta[property='og:title']")?.content || "",
      ogDesc: document.querySelector("meta[property='og:description']")?.content || "",
      ogImage: document.querySelector("meta[property='og:image']")?.content || ""
    };
  }

  // Find product title
  const titleEl = document.getElementById("productTitle");
  if (!titleEl) return;

  // Create Import button
  const btn = document.createElement("button");
  btn.textContent = "Import to PTAMesh";
  btn.style.margin = "10px";
  btn.style.padding = "8px 12px";
  btn.style.background = "#0073e6";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.cursor = "pointer";

  titleEl.parentNode.insertBefore(btn, titleEl.nextSibling);

  btn.addEventListener("click", async () => {
    const title = titleEl.innerText.trim();
    const description = document.querySelector("#feature-bullets")?.innerText.trim() || "";
    const shortDesc = description;

    // Retry loop for price
    let price = "";
    for (let i = 0; i < 5; i++) {
      price = await getAmazonPrice();
      if (price) break;
      await new Promise(r => setTimeout(r, 500)); // wait half a second
    }

    const imgEl = document.querySelector("#landingImage");
    const image = imgEl ? imgEl.src : "";
    const asinMatch = window.location.href.match(/\/dp\/([A-Z0-9]{10})/);
    const asin = asinMatch ? asinMatch[1] : "";

    // Meta tags
    const metaTitle = document.querySelector("title")?.innerText || "";
    const metaDesc = document.querySelector("meta[name='description']")?.content || "";
    const keywords = getKeywords();
    const socialTags = getSocialTags();

    const payload = {
      title,
      description,
      short_description: shortDesc,
      price,
      image,
      asin,
      sku: asin,
      keywords,
      meta_title: metaTitle,
      meta_description: metaDesc,
      social_tags: JSON.stringify(socialTags)
    };

    // Load endpoint from extension storage
    chrome.storage.sync.get(["ptaEndpoint"], async (items) => {
      const endpoint = items.ptaEndpoint || "https://protraxer.com/wp-json/protraxer/v1/import-amazon";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        alert("Import success: Product ID " + data.product_id);
      } catch (err) {
        alert("Import failed: " + err);
      }
    });
  });
})();