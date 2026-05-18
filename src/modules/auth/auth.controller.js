// Controlador de autenticacion: recibe la peticion HTTP de login.
const autenticacionServicio = require("./auth.service");
const { enviarExito } = require("../../utils/respuestas");

async function login(peticion, respuesta) {
  const { email, contrasena } = peticion.body;
  const resultadoSesion = await autenticacionServicio.iniciarSesion(email, contrasena);
  return enviarExito(respuesta, resultadoSesion, 200, "Inicio de sesion exitoso");
}

module.exports = { login };
