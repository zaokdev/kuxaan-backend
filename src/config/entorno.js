// Carga y centraliza las variables de entorno del sistema.
// Cualquier parte del backend lee la configuracion desde aqui.
require("dotenv").config();

const configuracion = {
  puerto: process.env.PUERTO || 3000,
  jwtSecreto: process.env.JWT_SECRETO || "clave-secreta-desarrollo",
  jwtExpiracion: process.env.JWT_EXPIRACION || "8h",
  carpetaEvidencias: process.env.CARPETA_EVIDENCIAS || "uploads/evidencias",
};

module.exports = configuracion;
