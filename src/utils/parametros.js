// Convierte un parametro de ruta a numero entero y valida que sea correcto.
// Se reutiliza en todos los modulos que reciben un :id en la URL.
const ErrorAplicacion = require("./errores");

function obtenerIdNumerico(valorParametro, nombreParametro = "id") {
  const idNumerico = Number(valorParametro);

  if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
    throw new ErrorAplicacion(`El parametro ${nombreParametro} debe ser un numero valido`, 400);
  }

  return idNumerico;
}

module.exports = obtenerIdNumerico;
