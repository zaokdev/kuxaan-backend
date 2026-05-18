// Convierte una cadena a objeto Date validando el formato.
// Devuelve null si el valor no se proporciona.
const ErrorAplicacion = require("./errores");

function convertirAFecha(valorFecha, nombreCampo = "fecha") {
  if (valorFecha === undefined || valorFecha === null || valorFecha === "") {
    return null;
  }

  const fechaConvertida = new Date(valorFecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    throw new ErrorAplicacion(`El campo ${nombreCampo} no tiene un formato de fecha valido`, 400);
  }

  return fechaConvertida;
}

module.exports = convertirAFecha;
