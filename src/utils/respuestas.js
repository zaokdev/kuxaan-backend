// Formato uniforme de respuestas JSON para toda la API.
function enviarExito(respuesta, datos, codigoEstado = 200, mensaje = "Operacion exitosa") {
  return respuesta.status(codigoEstado).json({
    exito: true,
    mensaje,
    datos,
  });
}

function enviarError(respuesta, mensaje, codigoEstado = 400) {
  return respuesta.status(codigoEstado).json({
    exito: false,
    mensaje,
    datos: null,
  });
}

module.exports = { enviarExito, enviarError };
