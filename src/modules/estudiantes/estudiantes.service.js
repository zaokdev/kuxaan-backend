// Logica de negocio del modulo de estudiantes.
const estudiantesRepositorio = require("./estudiantes.repository");
const { encriptarContrasena } = require("../../utils/contrasenas");
const ErrorAplicacion = require("../../utils/errores");

async function obtenerEstudiantes() {
  return estudiantesRepositorio.listarEstudiantes();
}

async function obtenerEstudiantePorId(idAlumno) {
  const estudianteEncontrado = await estudiantesRepositorio.buscarEstudiantePorId(idAlumno);

  if (!estudianteEncontrado) {
    throw new ErrorAplicacion("Estudiante no encontrado", 404);
  }

  return estudianteEncontrado;
}

async function registrarEstudiante(datosEntrada) {
  const passwordEncriptada = await encriptarContrasena(datosEntrada.contrasena);

  const datosUsuario = {
    email: datosEntrada.email,
    passwordEncriptada,
  };

  const datosAlumno = {
    nombreCompleto: datosEntrada.nombreCompleto,
    carrera: datosEntrada.carrera || null,
    universidad: datosEntrada.universidad || null,
    periodoAcademico: datosEntrada.periodoAcademico || null,
    telefono: datosEntrada.telefono || null,
    estado: datosEntrada.estado || "ACTIVO",
  };

  return estudiantesRepositorio.crearEstudiante(datosUsuario, datosAlumno);
}

async function actualizarEstudiante(idAlumno, datosEntrada) {
  await obtenerEstudiantePorId(idAlumno);

  const datosAlumno = {
    nombreCompleto: datosEntrada.nombreCompleto,
    carrera: datosEntrada.carrera,
    universidad: datosEntrada.universidad,
    periodoAcademico: datosEntrada.periodoAcademico,
    telefono: datosEntrada.telefono,
    estado: datosEntrada.estado,
  };

  // Solo se actualizan los campos enviados en la peticion.
  Object.keys(datosAlumno).forEach((campo) => {
    if (datosAlumno[campo] === undefined) {
      delete datosAlumno[campo];
    }
  });

  return estudiantesRepositorio.actualizarEstudiante(idAlumno, datosAlumno);
}

async function eliminarEstudiante(idAlumno) {
  const estudianteEncontrado = await obtenerEstudiantePorId(idAlumno);
  await estudiantesRepositorio.eliminarEstudiante(estudianteEncontrado.idUsuario);
}

module.exports = {
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  registrarEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
};
