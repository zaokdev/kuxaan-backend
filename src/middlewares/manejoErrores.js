// Middlewares finales: ruta no encontrada y manejo central de errores.
const { enviarError } = require("../utils/respuestas");

function rutaNoEncontrada(peticion, respuesta) {
  return enviarError(respuesta, `Ruta no encontrada: ${peticion.originalUrl}`, 404);
}

function manejarErrores(error, peticion, respuesta, siguiente) {
  // Errores controlados de la logica de negocio.
  if (error.esErrorControlado) {
    return enviarError(respuesta, error.mensaje || error.message, error.codigoEstado);
  }

  // Violacion de restriccion unica de Prisma (ej. email duplicado).
  if (error.code === "P2002") {
    return enviarError(respuesta, "El registro ya existe (valor duplicado)", 409);
  }

  // Registro no encontrado en Prisma.
  if (error.code === "P2025") {
    return enviarError(respuesta, "Registro no encontrado", 404);
  }

  console.error("Error no controlado:", error);
  return enviarError(respuesta, "Error interno del servidor", 500);
}

module.exports = { rutaNoEncontrada, manejarErrores };
