// Validaciones de formato reutilizables. Se mantienen sin librerias externas,
// en la misma linea que el middleware de campos requeridos.
const ErrorAplicacion = require("./errores");

const LONGITUD_MINIMA_CONTRASENA = 8;
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validarFormatoEmail(email) {
  if (!PATRON_EMAIL.test(String(email).trim())) {
    throw new ErrorAplicacion("El correo electronico no tiene un formato valido", 400);
  }

  return String(email).trim();
}

function validarFortalezaContrasena(contrasena) {
  if (typeof contrasena !== "string" || contrasena.length < LONGITUD_MINIMA_CONTRASENA) {
    throw new ErrorAplicacion(
      `La contrasena debe tener al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres`,
      400
    );
  }

  return contrasena;
}

module.exports = {
  validarFormatoEmail,
  validarFortalezaContrasena,
  LONGITUD_MINIMA_CONTRASENA,
};
