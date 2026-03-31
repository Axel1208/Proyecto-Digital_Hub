const fichaTemplate = (nombreAprendiz, nombreFicha, programa, jornada, accion = "asignado") => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #160b2e; border-radius: 16px; overflow: hidden; border: 1px solid rgba(127,90,240,0.4); }
    .header { background: linear-gradient(135deg, #1a0d3d 0%, #2d1a55 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(127,90,240,0.4); }
    .header h1 { color: #f0eaff; margin: 0 0 6px; font-size: 26px; font-weight: 800; letter-spacing: 1px; }
    .header p { color: #c9a8ff; margin: 0; font-size: 13px; opacity: 0.8; }
    .body { padding: 32px; }
    .body h2 { color: #f0eaff; font-size: 18px; margin: 0 0 8px; }
    .body p { color: #b8a8d8; line-height: 1.6; font-size: 14px; margin: 0 0 20px; }
    .info-box { background: #0f0820; border: 1px solid rgba(127,90,240,0.35); border-left: 4px solid #7f5af0; padding: 18px 20px; border-radius: 12px; margin: 20px 0; }
    .info-box p { margin: 8px 0; color: #b8a8d8; font-size: 14px; }
    .info-box span { font-weight: 700; color: #c9a8ff; }
    .footer { background: #0f0820; padding: 18px 32px; text-align: center; font-size: 12px; color: #6a5a8a; border-top: 1px solid rgba(127,90,240,0.2); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Digital Hub</h1>
      <p>Sistema de Gestión de Equipos</p>
    </div>
    <div class="body">
      <h2>Hola, ${nombreAprendiz} 👋</h2>
      <p>Has sido <strong style="color:#c9a8ff">${accion}</strong> exitosamente a una ficha de formación.</p>
      <div class="info-box">
        <p>📋 Ficha: <span>${nombreFicha}</span></p>
        <p>🎓 Programa: <span>${programa}</span></p>
        <p>🕐 Jornada: <span>${jornada}</span></p>
      </div>
      <p>Si tienes alguna duda, comunícate con tu instructor.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Digital Hub · Correo automático, no responder.</div>
  </div>
</body>
</html>
`;

module.exports = { fichaTemplate };
