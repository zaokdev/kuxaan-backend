// Valida que el cuerpo de la peticion contenga los campos requeridos.
// Mantiene la validacion simple sin librerias externas.
const ErrorAplicacion = require("../utils/errores");

function validarCamposRequeridos(camposRequeridos) {
  return (peticion, respuesta, siguiente) => {
    const camposFaltantes = camposRequeridos.filter((campo) => {
      const valor = peticion.body[campo];
      return valor === undefined || valor === null || valor === "";
    });

    if (camposFaltantes.length > 0) {
      throw new ErrorAplicacion(
        `Faltan campos obligatorios: ${camposFaltantes.join(", ")}`,
        400
      );
    }

    siguiente();
  };
}

module.exports = validarCamposRequeridos;
