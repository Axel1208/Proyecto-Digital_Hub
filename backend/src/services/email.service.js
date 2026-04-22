const nodemailer = require("nodemailer");

const enviarCorreo = async (destinatario, asunto, htmlContent) => {
  try {
    // Crear transporter en cada llamada para asegurar que .env ya cargó
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Digital Hub" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: asunto,
      html: htmlContent,
    });
    console.log(`✅ Correo enviado a: ${destinatario}`);
  } catch (error) {
    console.error("❌ Error enviando correo:", error.message);
  }
};

// ===============================
// ENVIAR CÓDIGO DE RECUPERACIÓN
// ===============================
const enviarCodigoRecuperacion = async (correo, codigo, template) => {
  try {
    await enviarCorreo(
      correo,
      "Recuperación de contraseña - Digital Hub",
      template(codigo)
    );
  } catch (error) {
    console.error("❌ ERROR COMPLETO:", error);
  }
};

module.exports = { 
  enviarCorreo,
  enviarCodigoRecuperacion
};