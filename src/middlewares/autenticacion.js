// Verifica el token JWT enviado en el encabezado Authorization.
// Si es valido, adjunta los datos del usuario a la peticion.
const { verificarToken } = require("../utils/jwt");
const ErrorAplicacion = require("../utils/errores");

function autenticarUsuario(peticion, respuesta, siguiente) {
  const encabezadoAutorizacion = peticion.headers.authorization;

  if (!encabezadoAutorizacion || !encabezadoAutorizacion.startsWith("Bearer ")) {
    throw new ErrorAplicacion("Token de autenticacion no proporcionado", 401);
  }

  const token = encabezadoAutorizacion.split(" ")[1];

  try {
    const usuarioAutenticado = verificarToken(token);
    peticion.usuario = usuarioAutenticado;
    siguiente();
  } catch (error) {
    throw new ErrorAplicacion("Token invalido o expirado", 401);
  }
}

module.exports = autenticarUsuario;
