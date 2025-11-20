# PTA-Extension

**Author:** John Masoner  
**Company:** AI Kinetic Business Response for Protraxer.com  
**Phone:** (360) 513-4238 
**Address:** 2760 Country Mill Rd. Milton, FL. 32570, USA  
**Email:** john@protraxer.com  |  john@masoner.us  |  john@AIKBR.com
**Go Live Date:** 11/20/2025

---

## 📌 Purpose

PTA-Extension was created to solve a critical gap in e-commerce workflows:  
Amazon product data is notoriously difficult to capture and import into WooCommerce.  
This extension provides a **browser-side companion** to the **PTA-Bridge WordPress plugin**, enabling one-click import of Amazon product listings directly into WooCommerce.

---

## 🚀 What It Does

- Injects an **"Import to PTAMesh"** button into Amazon product pages.  
- Scrapes product data including:
  - Title  
  - Description & short description  
  - Price (with retry logic, fallback to `0`)  
  - ASIN (stored as SKU and ISBN)  
  - Product image  
  - Keywords (derived from bullet points)  
  - Meta title & description  
  - Social tags (`og:title`, `og:description`, `og:image`)  
- Sends the payload via REST API to WooCommerce through the PTA-Bridge plugin.  
- Displays success/failure messages in the browser and logs details in DevTools.

---

## 🛠 Why It Was Created

Enterprise teams need **repeatable, contributor-safe workflows** for product onboarding.  
Manual copy/paste from Amazon into WooCommerce is error-prone, slow, and brittle.  
PTA-Extension automates this process, ensuring:
- Faster onboarding of catalog items.  
- Consistent metadata capture for SEO and social sharing.  
- Reduced contributor errors and training overhead.  

---

## 🧩 Current Limitations / Future Fixes

- **Price scraping**: Amazon often hides or dynamically loads prices. Current logic retries 5 times, then falls back to `0`. Future versions will integrate dynamic DOM observers for higher reliability.  
- **Keywords**: Derived from bullet points only. Future roadmap includes NLP keyword extraction for richer SEO.  
- **Social tags**: Not all Amazon pages expose `og:` tags. Future versions will add fallbacks to structured data (`ld+json`).  
- **Bulk import**: Currently supports single product pages. Roadmap includes wishlist and search results import.  
- **Logging**: Needs a dedicated extension popup panel for viewing import history.  
- **Mobile | Phone Support**: Currently there is no Mobile, or phone support for PTA-Extension

---

## 🌐 Supported Browsers

- Microsoft Edge (latest)  
- Google Chrome (latest)  

> Firefox support is planned for v0.3.0 once manifest v3 compatibility is validated.

---

## 📂 Project Structure
