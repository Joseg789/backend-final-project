import {
  sendContactEmail,
  sendConfirmationEmail,
} from "../services/emailService.js";

const contactController = {
  sendMessage: async (req, res) => {
    const { nombre, email, tema, mensaje } = req.body;

    if (!nombre || !email || !tema || !mensaje) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    try {
      //  los dos emails en paralelo para mayor velocidad
      await Promise.all([
        sendContactEmail({ nombre, email, tema, mensaje }),
        sendConfirmationEmail({ nombre, email, tema, mensaje }),
      ]);

      return res.json({
        success: true,
        message: "Mensaje enviado correctamente",
      });
    } catch (error) {
      console.error("Error enviando email:", error);
      return res.status(500).json({ message: "Error al enviar el mensaje" });
    }
  },
};

export default contactController;
