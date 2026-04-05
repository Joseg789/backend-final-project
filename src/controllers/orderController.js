import Order from "../models/Order.js";

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

  // crear orden — se llama al hacer checkout
  createOrder: async (req, res) => {
    const { items, total, direccion } = req.body;
    if (!items?.length)
      return res.status(400).json({ message: "El carrito está vacío" });

    try {
      const order = await Order.create({
        user: req.session.user.id,
        items,
        total,
        direccion,
      });
      return res.status(201).json({ success: true, order });
    } catch (error) {
      console.error("Error detallado:", error.message); // ← ver el error real
      return res
        .status(500)
        .json({ message: "Error al crear la orden", detail: error.message });
    }
  },

  // actualizar estado — admin
  updateStatus: async (req, res) => {
    const { estado } = req.body;
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { estado },
        { returnDocument: "after" },
      );
      if (!order)
        return res.status(404).json({ message: "Orden no encontrada" });
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
