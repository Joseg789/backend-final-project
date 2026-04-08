import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//  email que te llega A TI con la consulta
export const sendContactEmail = async ({ nombre, email, tema, mensaje }) => {
  await transporter.sendMail({
    from: `"Tienda" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // ← tu propio correo
    subject: `Nueva consulta: ${tema} — ${nombre}`,
    replyTo: email, // ← si respondes el email, va al usuario directamente
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2c2c2a; margin: 0 0 24px;">Nueva consulta recibida</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="background: #f9f9f7;">
            <td style="padding: 10px 14px; font-weight: 600; color: #888; font-size: 11px; text-transform: uppercase; width: 120px;">Nombre</td>
            <td style="padding: 10px 14px; color: #111;">${nombre}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: 600; color: #888; font-size: 11px; text-transform: uppercase;">Email</td>
            <td style="padding: 10px 14px; color: #111;">
              <a href="mailto:${email}" style="color: #2c2c2a;">${email}</a>
            </td>
          </tr>
          <tr style="background: #f9f9f7;">
            <td style="padding: 10px 14px; font-weight: 600; color: #888; font-size: 11px; text-transform: uppercase;">Tema</td>
            <td style="padding: 10px 14px; color: #111;">${tema}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: 600; color: #888; font-size: 11px; text-transform: uppercase; vertical-align: top;">Mensaje</td>
            <td style="padding: 10px 14px; color: #111; line-height: 1.7;">${mensaje}</td>
          </tr>
        </table>
        <p style="font-size: 12px; color: #aaa; margin-top: 24px;">
          Puedes responder directamente a este email para contactar con ${nombre}.
        </p>
      </div>
    `,
  });
};

// email que le llega AL USUARIO confirmando su consulta
export const sendConfirmationEmail = async ({
  nombre,
  email,
  tema,
  mensaje,
}) => {
  await transporter.sendMail({
    from: `"Tienda" <${process.env.EMAIL_USER}>`,
    to: email, //  correo del usuario que escribió
    subject: "Hemos recibido tu mensaje — Te responderemos pronto",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2c2c2a; margin: 0 0 8px;">Hola ${nombre},</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 16px;">
          Hemos recibido tu mensaje correctamente y te responderemos en un plazo
          máximo de <strong>24 horas</strong>.
        </p>

        <div style="background: #f9f9f7; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">
            Tu consulta
          </p>
          <p style="font-size: 13px; color: #888; margin: 0 0 4px;">
            <strong style="color: #555;">Tema:</strong> ${tema}
          </p>
          <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 8px 0 0;">
            ${mensaje}
          </p>
        </div>

        <p style="color: #555; line-height: 1.7; margin: 0 0 8px;">
          Si tienes alguna consulta urgente puedes contactarnos en:
        </p>
        <p style="color: #555; margin: 0 0 4px;">
          📧 <a href="mailto:${process.env.EMAIL_USER}" style="color: #2c2c2a;">${process.env.EMAIL_USER}</a>
        </p>
        <p style="color: #555; margin: 0 0 24px;">
          📞 +34 900 123 456
        </p>

        <p style="font-size: 13px; color: #888; border-top: 0.5px solid #e0e0e0; padding-top: 16px; margin: 0;">
          Un saludo,<br />
          <strong style="color: #2c2c2a;">El equipo de Tienda</strong>
        </p>
      </div>
    `,
  });
};
