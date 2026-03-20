const mongoose = require("mongoose");

const validCategorias = ["Camisetas", "Pantalones", "Zapatos", "Accesorios"]; // enum de categorias
const validTallas = ["XS", "S", "M", "L", "XL"]; // enum de tallas

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: validCategorias,
  },
  talla: {
    type: String,
    enum: validTallas,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
});
module.exports = mongoose.model("Product", productSchema);
module.exports.validTallas = validTallas; // exportado solo si lo necesitas en otros archivos
module.exports.validCategorias = validCategorias; // exportado solo si lo necesitas en otros archivos
