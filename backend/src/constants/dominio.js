// ==============================
// ROLES DEL SISTEMA
// ==============================

const ROLES = {
  ADMIN: "administrador",
  INSTRUCTOR: "instructor",
  APRENDIZ: "aprendiz"
};

// ==============================
// ESTADOS DE USUARIO
// ==============================

const ESTADOS_USUARIO = [
  "activo",
  "inhabilitado"
];

// ==============================
// ESTADOS DE PORTÁTIL
// ==============================

const ESTADOS_PORTATIL = [
  "disponible",
  "asignado",
  "dañado",
  "mantenimiento"
];

// ==============================
// ESTADOS DE REPORTES
// ==============================

const ESTADOS_REPORTE = [
  "pendiente",
  "en_revision",
  "resuelto"
];

// ==============================
// EXPORTAR CONSTANTES
// ==============================

module.exports = {
  ROLES,
  ESTADOS_USUARIO,
  ESTADOS_PORTATIL,
  ESTADOS_REPORTE
};
