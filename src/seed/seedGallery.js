import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";

dotenv.config();

const data = [
  {
    title: "Diseño indomable",
    text: "Estructura atrevida sin límites",
    img: "https://images.unsplash.com/photo-1610129303358-277a688b6417?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Modelado por la luz",
    text: "Diseñados para moverse",
    img: "https://images.unsplash.com/photo-1611336521720-4a565bef4ab9?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Movimiento urbano",
    text: "Comodidad en cada paso",
    img: "https://images.unsplash.com/photo-1653303515724-93d9186151ce?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Descubre tu esencia",
    text: "La comodidad que te define",
    img: "https://images.unsplash.com/photo-1496360600513-52e9febabbcd?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Comparte tu estilo",
    text: "Tu estilo, tu historia",
    img: "https://images.unsplash.com/photo-1648564101688-2f9b16c4098a?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Disfruta el camino",
    text: "Tu ritmo es único",
    img: "https://images.unsplash.com/photo-1725532605447-71287c35f380?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Exprésate sin límites",
    text: "Tu estilo, tu voz",
    img: "https://images.unsplash.com/photo-1729023386944-ee27ead91b83?w=500&auto=format&fit=crop&q=60",
  },
];

const seedGallery = async (data) => {
  console.log(`Subiendo ${data.length} imágenes a Cloudinary...\n`);
  const results = [];

  for (const [i, img] of data.entries()) {
    // ✅ Bug 2: use index for id
    try {
      const result = await cloudinary.uploader.upload(img.img, {
        folder: "carouselMin",
        public_id: `gallery_${i}`, // ✅ Bug 2
        overwrite: true,
      });

      results.push({
        id: img.id,
        title: img.title, // ✅ Bug 1: was img.tittle
        text: img.text,
        img: result.secure_url,
      });
      console.log(` OK → ${result.secure_url}`);
    } catch (err) {
      console.error(`[${img.title}] ERROR → ${err.message}`); // ✅ Bug 2
      results.push({
        title: img.title,
        text: img.text,
        img: null,
        error: err.message,
      });
    }
  }

  console.log("\n--- Copia esto en Gallery.jsx (imágenes subidas) ---\n");
  const uploaded = results.filter((r) => r.img); // ✅ Bug 3: was r.url
  const output = uploaded
    .map((r) => `  { src: "${r.img}", title: "${r.title}" },`) // ✅ Bug 3
    .join("\n");
  console.log(output);
  console.log("\n----------------------------------------------------");
  console.log(
    `\nResumen: ${uploaded.length} subidas, ${results.length - uploaded.length} fallidas.`,
  );

  process.exit(0);
};

seedGallery(data);
