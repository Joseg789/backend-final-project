export async function extractProducts(page) {
  return await page.evaluate(() => {
    const items = document.querySelectorAll("article");

    return Array.from(items).map((item) => {
      const name = item.querySelector("h3")?.innerText;
      const brand = item.querySelector("h2")?.innerText;
      const price = item.querySelector('[data-testid="price"]')?.innerText;
      const link = item.querySelector("a")?.href;
      const img = item.querySelector("img")?.src;

      return {
        nombre: name,
        marca: brand,
        precio: price,
        url: link,
        imagen: img,
      };
    });
  });
}

export function categorize(products) {
  const categorized = {
    camisetas: [],
    sudaderas: [],
    pantalones: [],
    otros: [],
  };

  products.forEach((p) => {
    const name = (p.nombre || "").toLowerCase();

    if (name.includes("camiseta")) categorized.camisetas.push(p);
    else if (name.includes("sudadera")) categorized.sudaderas.push(p);
    else if (name.includes("pantalón") || name.includes("jeans"))
      categorized.pantalones.push(p);
    else categorized.otros.push(p);
  });

  return categorized;
}
