// Logica de negocio de la autenticacion: valida credenciales y emite token.
const autenticacionRepository = require("./auth.repository");
const { encriptarContrasena, compararContrasena } = require("../../utils/contrasenas");
const { generarToken } = require("../../utils/jwt");
const {
  validarFormatoEmail,
  validarFortalezaContrasena,
} = require("../../utils/validaciones");
const ErrorAplicacion = require("../../utils/errores");
const ROLES = require("../../utils/roles");

async function iniciarSesion(email, contrasena) {
  const usuarioEncontrado = await autenticacionRepository.buscarUsuarioPorEmail(email);

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
    idAlumno: usuarioEncontrado.alumno?.idAlumno || null,
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

async function registrarUsuario(email, contrasena) {
  const emailValidado = validarFormatoEmail(email);
  validarFortalezaContrasena(contrasena);

  const usuarioExistente = await autenticacionRepository.buscarUsuarioPorEmail(emailValidado);

  if (usuarioExistente) {
    throw new ErrorAplicacion("Ya existe un usuario con ese correo", 409);
  }

  const passwordEncriptada = await encriptarContrasena(contrasena);
  return autenticacionRepository.crearUsuario(
    emailValidado,
    passwordEncriptada,
    ROLES.ADMINISTRADOR
  );
}

// Cambio de contrasena del propio usuario autenticado (cualquier rol).
// Exige la contrasena actual para evitar cambios con un token robado.
async function cambiarContrasena(usuarioAutenticado, contrasenaActual, contrasenaNueva) {
  validarFortalezaContrasena(contrasenaNueva);

  const usuarioEncontrado = await autenticacionRepository.buscarUsuarioPorId(
    usuarioAutenticado.idUsuario
  );

  if (!usuarioEncontrado) {
    throw new ErrorAplicacion("Usuario no encontrado", 404);
  }

  const contrasenaValida = await compararContrasena(
    contrasenaActual,
    usuarioEncontrado.password
  );

  if (!contrasenaValida) {
    throw new ErrorAplicacion("La contrasena actual no es correcta", 401);
  }

  if (contrasenaActual === contrasenaNueva) {
    throw new ErrorAplicacion("La contrasena nueva debe ser distinta a la actual", 400);
  }

  const passwordEncriptada = await encriptarContrasena(contrasenaNueva);
  return autenticacionRepository.actualizarPassword(
    usuarioEncontrado.idUsuario,
    passwordEncriptada
  );
}

module.exports = { iniciarSesion, registrarUsuario, cambiarContrasena };
