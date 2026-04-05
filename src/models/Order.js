import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false, // no obligatorio por si el producto se elimina
  },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  imagen: { type: String },
  categoria: { type: String }, // ← añadido
  genero: { type: String }, // ← añadido
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "procesando", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },
    direccion: {
      calle: String,
      ciudad: String,
      codigoPostal: String,
      pais: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
