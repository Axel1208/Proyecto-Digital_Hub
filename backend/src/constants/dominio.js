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

// Constantes seguras para no depender de índices en el resto del código
const ESTADO_USUARIO_ACTIVO = ESTADOS_USUARIO[0];
const ESTADO_USUARIO_INHABILITADO = ESTADOS_USUARIO[1];

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
  ESTADO_USUARIO_ACTIVO,
  ESTADO_USUARIO_INHABILITADO,
  ESTADOS_PORTATIL,
  ESTADOS_REPORTE
};