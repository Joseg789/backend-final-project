import mongoose from "mongoose";

const validCategorias = ["Camisetas", "Pantalones", "Zapatos", "Accesorios"]; // enum de categorias
const validTallas = ["XS", "S", "M", "L", "XL"]; // enum de tallas

const productsSchema = new mongoose.Schema({
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
export default mongoose.model("Products", productsSchema);
