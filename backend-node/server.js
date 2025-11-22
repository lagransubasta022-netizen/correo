import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/enviar", async (req, res) => {
  try {
    const { direccion, contacto, correo, pago, productos } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "lagransubasta022@gmail.com",
      subject: "📦 Nuevo Pedido Realizado",
      text: `
Nuevo pedido recibido:

📍 Dirección: ${direccion}
📞 Contacto: ${contacto}
📧 Correo del cliente: ${correo}
💰 Método de pago: ${pago}

🛒 Productos:
${productos.map(p => `- ${p}`).join("\n")}
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ ok: true, mensaje: "Pedido enviado correctamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ ok: false, mensaje: "Error al enviar el pedido" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor funcionando en http://localhost:" + PORT);
});
