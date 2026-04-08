// controllers/subscriptionController.js
import { sendSubscriptionEmail } from "../services/emailService.js";

const subscriptionController = {
  subscribe: async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requerido" });

    try {
      await sendSubscriptionEmail({ email });
      return res.json({ success: true, message: "Suscripción correcta" });
    } catch (error) {
      console.error("Error enviando email de suscripción:", error);
      return res.status(500).json({ message: "Error al suscribirse" });
    }
  },
};

export default subscriptionController;
