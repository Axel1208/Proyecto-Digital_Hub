// ===============================
// TEMPLATE PARA CÓDIGO DE RECUPERACIÓN
// ===============================
const generarTemplateCodigo = (codigo) => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2 style="color: #333;">Recuperación de contraseña</h2>
      <p>Usa el siguiente código para continuar:</p>
      <h1 style="color: #007bff; letter-spacing: 5px;">${codigo}</h1>
      <p>Este código expira en <strong>5 minutos</strong>.</p>
      <hr />
      <p style="font-size: 12px; color: #999;">
        Si no solicitaste esto, puedes ignorar este mensaje.
      </p>
    </div>
  `;
};

module.exports = {
  generarTemplateCodigo
};