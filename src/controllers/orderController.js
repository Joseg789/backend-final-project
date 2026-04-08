import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendOrderEmail, sendStatusEmail } from "../services/emailService.js";

const orderController = {
  // todas las órdenes — admin
  getAll: async (req, res) => {
    try {
      const orders = await Order.find().populate("user", "email");
      return res.json(orders);
    } catch {
      return res.status(500).json({ message: "Error al obtener órdenes" });
    }
  },

  // órdenes del usuario logueado
  getMyOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.session.user.id });
      return res.json(orders);
    } catch {
      return res.status(500).json({ message: "Error al obtener tus órdenes" });
    }
  },

  // crear orden la llamo al hacer checkout

  createOrder: async (req, res) => {
    const { items, total, direccion } = req.body;
    if (!items?.length)
      return res.status(400).json({ message: "El carrito está vacío" });

    try {
      const order = await Order.create({
        user: req.user.id,
        items,
        total,
        direccion,
      });

      //  obtener email del usuario para el email
      const user = await User.findById(req.user.id).select("email");

      //  no bloqueamos la respuesta si falla el email
      if (user?.email) {
        sendOrderEmail({ email: user.email, order }).catch((err) =>
          console.error("Error enviando email de pedido:", err),
        );
      }

      return res.status(201).json({ success: true, order });
    } catch (error) {
      console.error("Error detallado:", error.message);
      return res
        .status(500)
        .json({ message: "Error al crear la orden", detail: error.message });
    }
  },
  // mis órdenes
  getMyOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }); //  mismo cambio
      return res.json(orders);
    } catch {
      return res.status(500).json({ message: "Error al obtener tus órdenes" });
    }
  },

  // actualizar estado — admin
  updateStatus: async (req, res) => {
    const { estado, total, direccion } = req.body;
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { estado, total, direccion },
        { returnDocument: "after" },
      ).populate("user", "email"); // ← populate para obtener el email

      if (!order)
        return res.status(404).json({ message: "Orden no encontrada" });

      //  envía email si el estado cambió
      if (estado && order.user?.email) {
        sendStatusEmail({
          email: order.user.email,
          order,
          estado,
        }).catch((err) =>
          console.error("Error enviando email de estado:", err),
        );
      }

      return res.json({ success: true, order });
    } catch {
      return res.status(500).json({ message: "Error al actualizar estado" });
    }
  },
  // eliminar — admin
  deleteOrder: async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ message: "Error al eliminar orden" });
    }
  },
};

export default orderController;
