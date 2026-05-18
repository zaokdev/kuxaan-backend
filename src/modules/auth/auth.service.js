// Logica de negocio de la autenticacion: valida credenciales y emite token.
const autenticacionRepositorio = require("./auth.repository");
const { compararContrasena } = require("../../utils/contrasenas");
const { generarToken } = require("../../utils/jwt");
const ErrorAplicacion = require("../../utils/errores");

async function iniciarSesion(email, contrasena) {
  const usuarioEncontrado = await autenticacionRepositorio.buscarUsuarioPorEmail(email);

  if (!usuarioEncontrado) {
    throw new ErrorAplicacion("Credenciales incorrectas", 401);
  }

  const contrasenaValida = await compararContrasena(contrasena, usuarioEncontrado.password);

  if (!contrasenaValida) {
    throw new ErrorAplicacion("Credenciales incorrectas", 401);
  }

  const token = generarToken({
    idUsuario: usuarioEncontrado.idUsuario,
    email: usuarioEncontrado.email,
    rol: usuarioEncontrado.rol,
  });

  return {
    token,
    usuario: {
      idUsuario: usuarioEncontrado.idUsuario,
      email: usuarioEncontrado.email,
      rol: usuarioEncontrado.rol,
      idAlumno: usuarioEncontrado.alumno?.idAlumno || null,
      nombreCompleto: usuarioEncontrado.alumno?.nombreCompleto || null,
    },
  };
}

module.exports = { iniciarSesion };
