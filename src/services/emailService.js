import { config } from "dotenv";
config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendSubscriptionEmail = async ({ email }) => {
  await transporter.sendMail({
    from: `"Tienda" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "¡Bienvenido! Aquí tienes tu cupón de descuento 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">

        <h2 style="color: #2c2c2a; margin: 0 0 8px;">¡Gracias por suscribirte!</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 24px;">
          Como bienvenida te regalamos un cupón de <strong>10% de descuento</strong>
          en tu próxima compra. Úsalo en el checkout.
        </p>

        <div style="border: 2px dashed #2c2c2a; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
          <p style="font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">
            Tu cupón de descuento
          </p>
          <p style="font-size: 36px; font-weight: 700; color: #2c2c2a; letter-spacing: 4px; margin: 0 0 8px;">
            SAVE10
          </p>
          <p style="font-size: 14px; color: #888; margin: 0;">
            10% de descuento en tu próxima compra
          </p>
        </div>

        <div style="background: #f9f9f7; border-radius: 8px; padding: 16px 20px; margin: 0 0 24px;">
          <p style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px;">
            Cómo usarlo
          </p>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-size: 13px; color: #555;">1. Añade productos al carrito</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-size: 13px; color: #555;">2. Ve al checkout</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 13px; color: #555;">3. Introduce el código <strong>SAVE10</strong> y ahorra un 10%</span>
          </div>
        </div>

        <div style="background: #EAF3DE; border-radius: 8px; padding: 12px 16px; margin: 0 0 24px;">
          <p style="font-size: 13px; color: #3B6D11; margin: 0;">
            ✅ Válido para cualquier producto · Sin mínimo de compra · Un solo uso
          </p>
        </div>

        <a href="${process.env.FRONTEND_URL}/productos"
          style="display: inline-block; padding: 12px 28px; background: #2c2c2a; color: #fff; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; margin: 0 0 24px;">
          Ir a la tienda
        </a>

        <p style="font-size: 13px; color: #888; border-top: 0.5px solid #e0e0e0; padding-top: 16px; margin: 0;">
          Si no te has suscrito ignora este mensaje.<br/>
          El equipo de <strong style="color: #2c2c2a;">Tienda</strong>
        </p>

      </div>
    `,
  });
};

export const sendStatusEmail = async ({ email, order, estado }) => {
  const estadoInfo = {
    pendiente: {
      emoji: "🕐",
      texto: "Tu pedido está pendiente de procesarse.",
      color: "#854F0B",
      bg: "#FAEEDA",
    },
    procesando: {
      emoji: "⚙️",
      texto: "Tu pedido está siendo procesado.",
      color: "#185FA5",
      bg: "#E6F1FB",
    },
    enviado: {
      emoji: "🚚",
      texto: "Tu pedido está en camino. ¡Ya casi está!",
      color: "#534AB7",
      bg: "#EEEDFE",
    },
    entregado: {
      emoji: "✅",
      texto: "Tu pedido ha sido entregado. ¡Esperamos que lo disfrutes!",
      color: "#3B6D11",
      bg: "#EAF3DE",
    },
    cancelado: {
      emoji: "❌",
      texto: "Tu pedido ha sido cancelado.",
      color: "#a32d2d",
      bg: "#FCEBEB",
    },
  };

  const info = estadoInfo[estado] || estadoInfo.pendiente;
  const orderId = order._id?.toString().slice(-6).toUpperCase();

  await transporter.sendMail({
    from: `"Tienda" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${info.emoji} Actualización de tu pedido #${orderId} — ${estado.charAt(0).toUpperCase() + estado.slice(1)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">

        <h2 style="color: #2c2c2a; margin: 0 0 8px;">Actualización de tu pedido</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 20px;">
          El estado de tu pedido ha sido actualizado.
        </p>

        <div style="background: ${info.bg}; border-radius: 8px; padding: 16px 20px; margin: 0 0 20px; display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 28px;">${info.emoji}</span>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: ${info.color}; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">
              Estado actual
            </p>
            <p style="font-size: 18px; font-weight: 500; color: ${info.color}; margin: 0;">
              ${estado.charAt(0).toUpperCase() + estado.slice(1)}
            </p>
          </div>
        </div>

        <div style="background: #f9f9f7; border-radius: 8px; padding: 14px 20px; margin: 0 0 20px;">
          <p style="font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">
            Número de pedido
          </p>
          <p style="font-size: 16px; font-weight: 500; color: #2c2c2a; margin: 0;">
            #${orderId}
          </p>
        </div>

        <p style="color: #555; line-height: 1.7; margin: 0 0 20px;">
          ${info.texto}
        </p>

        ${
          order.items?.length > 0
            ? `
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 0 0 20px;">
            <thead>
              <tr style="background: #f9f9f7;">
                <th style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase;">Producto</th>
                <th style="padding: 10px 14px; text-align: center; font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase;">Cant.</th>
                <th style="padding: 10px 14px; text-align: right; font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase;">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 10px 14px; color: #111; border-bottom: 0.5px solid #f0f0f0;">${item.nombre}</td>
                  <td style="padding: 10px 14px; color: #888; text-align: center; border-bottom: 0.5px solid #f0f0f0;">x${item.quantity}</td>
                  <td style="padding: 10px 14px; color: #111; text-align: right; border-bottom: 0.5px solid #f0f0f0; font-weight: 500;">${(item.precio * item.quantity).toFixed(2)}€</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `
            : ""
        }

        <a href="${process.env.FRONTEND_URL}/profile"
          style="display: inline-block; padding: 12px 28px; background: #2c2c2a; color: #fff; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; margin: 0 0 24px;">
          Ver mis pedidos
        </a>

        <p style="font-size: 13px; color: #888; border-top: 0.5px solid #e0e0e0; padding-top: 16px; margin: 0;">
          Si tienes alguna duda escríbenos a
          <a href="mailto:${process.env.EMAIL_USER}" style="color: #2c2c2a;">${process.env.EMAIL_USER}</a><br/>
          El equipo de <strong style="color: #2c2c2a;">Tienda</strong>
        </p>

      </div>
    `,
  });
};

// — Email de consulta a la tienda —
export const sendContactEmail = async ({ nombre, email, tema, mensaje }) => {
  await transporter.sendMail({
    from: `"Tienda: MyShop" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `Nueva consulta: ${tema} — ${nombre}`,
    replyTo: email,
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

// — Confirmación al usuario —
export const sendConfirmationEmail = async ({
  nombre,
  email,
  tema,
  mensaje,
}) => {
  await transporter.sendMail({
    from: `"Tienda: Myshop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Hemos recibido tu mensaje — Te responderemos pronto",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2c2c2a; margin: 0 0 8px;">Hola ${nombre},</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 16px;">
          Hemos recibido tu mensaje correctamente y te responderemos en un plazo
          máximo de <strong>24 horas</strong>.
        </p>
        <div style="background: #f9f9f7; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">Tu consulta</p>
          <p style="font-size: 13px; color: #888; margin: 0 0 4px;"><strong style="color: #555;">Tema:</strong> ${tema}</p>
          <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 8px 0 0;">${mensaje}</p>
        </div>
        <p style="color: #555; line-height: 1.7; margin: 0 0 8px;">Si tienes alguna consulta urgente puedes contactarnos en:</p>
        <p style="color: #555; margin: 0 0 4px;">📧 <a href="mailto:${process.env.EMAIL_USER}" style="color: #2c2c2a;">${process.env.EMAIL_USER}</a></p>
        <p style="color: #555; margin: 0 0 24px;">📞 +34 900 123 456</p>
        <p style="font-size: 13px; color: #888; border-top: 0.5px solid #e0e0e0; padding-top: 16px; margin: 0;">
          Un saludo,<br/>
          <strong style="color: #2c2c2a;">El equipo de Tienda</strong>
        </p>
      </div>
    `,
  });
};

// — Bienvenida al registrarse —
export const sendWelcomeEmail = async ({ email }) => {
  await transporter.sendMail({
    from: `"Tienda" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "¡Bienvenido MyShop!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2c2c2a; margin: 0 0 8px;">¡Bienvenido!</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 20px;">
          Tu cuenta ha sido creada correctamente. Ya puedes acceder a todos
          nuestros productos y realizar pedidos.
        </p>
        <div style="background: #f9f9f7; border-radius: 8px; padding: 16px 20px; margin: 0 0 20px;">
          <p style="font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">Tu cuenta</p>
          <p style="font-size: 14px; color: #111; margin: 0;">📧 ${email}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/productos"
          style="display: inline-block; padding: 12px 28px; background: #2c2c2a; color: #fff; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none;">
          Ver productos
        </a>
        <p style="font-size: 13px; color: #888; border-top: 0.5px solid #e0e0e0; padding-top: 16px; margin-top: 24px;">
          Si no has creado esta cuenta ignora este mensaje.<br/>
          El equipo de <strong style="color: #2c2c2a;">Tienda</strong>
        </p>
      </div>
    `,
  });
};

// — Confirmación de pedido —
export const sendOrderEmail = async ({ email, order }) => {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 14px; color: #111; border-bottom: 0.5px solid #f0f0f0;">${item.nombre}</td>
      <td style="padding: 10px 14px; color: #888; text-align: center; border-bottom: 0.5px solid #f0f0f0;">x${item.quantity}</td>
      <td style="padding: 10px 14px; color: #111; text-align: right; border-bottom: 0.5px solid #f0f0f0; font-weight: 500;">${(item.precio * item.quantity).toFixed(2)}€</td>
    </tr>
  `,
    )
    .join("");

  const shipping = (order.total || 0) >= 50 ? 0 : 4.99;
  const finalTotal = ((order.total || 0) + shipping).toFixed(2);
  const orderId = order._id?.toString().slice(-6).toUpperCase();

  // email al usuario
  await transporter.sendMail({
    from: `"Tienda" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Pedido confirmado #${orderId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2c2c2a; margin: 0 0 8px;">¡Pedido confirmado!</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 20px;">
          Hemos recibido tu pedido correctamente. Te avisaremos cuando esté en camino.
        </p>
        <div style="background: #f9f9f7; border-radius: 8px; padding: 14px 20px; margin: 0 0 20px;">
          <p style="font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">Número de pedido</p>
          <p style="font-size: 18px; font-weight: 500; color: #2c2c2a; margin: 0;">#${orderId}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 0 0 16px;">
          <thead>
            <tr style="background: #f9f9f7;">
              <th style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase;">Producto</th>
              <th style="padding: 10px 14px; text-align: center; font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase;">Cant.</th>
              <th style="padding: 10px 14px; text-align: right; font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase;">Precio</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 0 0 20px;">
          <tr>
            <td style="padding: 8px 14px; color: #888;">Subtotal</td>
            <td style="padding: 8px 14px; text-align: right; color: #111;">${(order.total || 0).toFixed(2)}€</td>
          </tr>
          <tr>
            <td style="padding: 8px 14px; color: #888;">Envío</td>
            <td style="padding: 8px 14px; text-align: right; color: ${shipping === 0 ? "#3B6D11" : "#111"};">${shipping === 0 ? "Gratis" : "4,99€"}</td>
          </tr>
          <tr style="border-top: 0.5px solid #e0e0e0;">
            <td style="padding: 12px 14px; font-weight: 600; color: #111; font-size: 15px;">Total</td>
            <td style="padding: 12px 14px; text-align: right; font-weight: 600; color: #111; font-size: 15px;">${finalTotal}€</td>
          </tr>
        </table>
        ${
          order.direccion?.calle
            ? `
          <div style="background: #f9f9f7; border-radius: 8px; padding: 14px 20px; margin: 0 0 20px;">
            <p style="font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; margin: 0 0 8px;">Dirección de envío</p>
            <p style="font-size: 14px; color: #111; margin: 0; line-height: 1.6;">
              ${order.direccion.calle}<br/>
              ${order.direccion.codigoPostal} ${order.direccion.ciudad}<br/>
              ${order.direccion.pais}
            </p>
          </div>
        `
            : ""
        }
        <a href="${process.env.FRONTEND_URL}/profile"
          style="display: inline-block; padding: 12px 28px; background: #2c2c2a; color: #fff; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; margin: 0 0 24px;">
          Ver mis pedidos
        </a>
        <p style="font-size: 13px; color: #888; border-top: 0.5px solid #e0e0e0; padding-top: 16px; margin: 0;">
          Si tienes alguna duda escríbenos a
          <a href="mailto:${process.env.EMAIL_USER}" style="color: #2c2c2a;">${process.env.EMAIL_USER}</a><br/>
          El equipo de <strong style="color: #2c2c2a;">Tienda</strong>
        </p>
      </div>
    `,
  });

  // notificación a la tienda
  await transporter.sendMail({
    from: `"Tienda" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `Nuevo pedido #${orderId} — ${finalTotal}€`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2c2c2a; margin: 0 0 16px;">Nuevo pedido recibido</h2>
        <p style="color: #555; margin: 0 0 8px;"><strong>Cliente:</strong> ${email}</p>
        <p style="color: #555; margin: 0 0 8px;"><strong>Total:</strong> ${finalTotal}€</p>
        <p style="color: #555; margin: 0 0 20px;"><strong>Productos:</strong> ${order.items?.length || 0}</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>
    `,
  });
};
