// Generacion y verificacion de tokens JWT para la autenticacion.
const jsonwebtoken = require("jsonwebtoken");
const configuracion = require("../config/entorno");

function generarToken(datosUsuario) {
  return jsonwebtoken.sign(datosUsuario, configuracion.jwtSecreto, {
    expiresIn: configuracion.jwtExpiracion,
  });
}

function verificarToken(token) {
  return jsonwebtoken.verify(token, configuracion.jwtSecreto);
}

module.exports = { generarToken, verificarToken };
