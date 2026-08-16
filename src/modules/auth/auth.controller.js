// Controller de autenticacion: recibe la peticion HTTP de login.
const autenticacionService = require("./auth.service");
const { enviarExito } = require("../../utils/respuestas");

async function login(peticion, respuesta) {
  const { email, contrasena } = peticion.body;
  const resultadoSesion = await autenticacionService.iniciarSesion(email, contrasena);
  return enviarExito(respuesta, resultadoSesion, 200, "Inicio de sesion exitoso");
}

async function registrar(peticion, respuesta) {
  const { email, contrasena } = peticion.body;
  const nuevoUsuario = await autenticacionService.registrarUsuario(email, contrasena);
  return enviarExito(respuesta, nuevoUsuario, 201, "Usuario registrado exitosamente");
}

async function cambiarContrasena(peticion, respuesta) {
  const { contrasenaActual, contrasenaNueva } = peticion.body;
  await autenticacionService.cambiarContrasena(
    peticion.usuario,
    contrasenaActual,
    contrasenaNueva
  );
  return enviarExito(respuesta, null, 200, "Contrasena actualizada correctamente");
}

module.exports = { login, registrar, cambiarContrasena };
