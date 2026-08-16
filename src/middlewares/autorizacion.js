// Restringe el acceso a una ruta segun el rol del usuario autenticado.
// Se usa despues del middleware de autenticacion.
const ErrorAplicacion = require("../utils/errores");

function autorizarRoles(...rolesPermitidos) {
  return (peticion, respuesta, siguiente) => {
    const rolUsuario = peticion.usuario?.rol;

    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      throw new ErrorAplicacion("No tienes permiso para acceder a este recurso", 403);
    }

    siguiente();
  };
}

module.exports = autorizarRoles;
