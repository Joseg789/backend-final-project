import { chromium } from "playwright";
import fs from "fs";
import { autoScroll } from "../utils/scroll.js";
import { extractProducts, categorize } from "../services/extractor.js";

const URL = "https://www.zalando.es/ropa-hombre-rebajas/";

async function scrapeZalando() {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  });

  const page = await context.newPage();

  console.log("🌍 Cargando...");
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  // Cookies
  try {
    await page.click('button:has-text("Aceptar")', { timeout: 5000 });
  } catch {}

  // Scroll múltiple
  for (let i = 0; i < 6; i++) {
    console.log(`🔄 Scroll ${i + 1}`);
    await autoScroll(page);
    await page.waitForTimeout(2000);
  }

  console.log("📦 Extrayendo...");
  const products = await extractProducts(page);

  console.log(`✅ ${products.length} productos`);

  const categorized = categorize(products);

  fs.writeFileSync(
    "./output/zalando.json",
    JSON.stringify(categorized, null, 2),
  );

  console.log("💾 Guardado en output/zalando.json");

  await browser.close();
}

scrapeZalando();
