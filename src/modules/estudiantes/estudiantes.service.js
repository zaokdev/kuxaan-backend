// Logica de negocio del modulo de estudiantes.
const estudiantesRepository = require("./estudiantes.repository");
const { encriptarContrasena } = require("../../utils/contrasenas");
const sumarHoras = require("../../utils/horas");
const {
  validarFormatoEmail,
  validarFortalezaContrasena,
} = require("../../utils/validaciones");
const ErrorAplicacion = require("../../utils/errores");
const ROLES = require("../../utils/roles");

// Garantiza que el usuario autenticado sea un estudiante con perfil de alumno.
function asegurarAlumno(usuarioAutenticado) {
  if (usuarioAutenticado.rol !== ROLES.ESTUDIANTE || !usuarioAutenticado.idAlumno) {
    throw new ErrorAplicacion("Esta seccion es solo para estudiantes", 403);
  }
  return usuarioAutenticado.idAlumno;
}

// Listado para el administrador: cada alumno con su total de horas acumuladas.
// Los registros crudos no se devuelven, solo el total ya calculado.
async function obtenerEstudiantes() {
  const estudiantes = await estudiantesRepository.listarEstudiantes();

  return estudiantes.map(({ registros, ...alumno }) => ({
    ...alumno,
    totalHoras: sumarHoras(registros),
  }));
}

async function obtenerEstudiantePorId(idAlumno) {
  const estudianteEncontrado = await estudiantesRepository.buscarEstudiantePorId(idAlumno);

  if (!estudianteEncontrado) {
    throw new ErrorAplicacion("Estudiante no encontrado", 404);
  }

  return estudianteEncontrado;
}

// Perfil propio del estudiante logueado, con totales para su panel.
async function obtenerPerfilPropio(usuarioAutenticado) {
  const idAlumno = asegurarAlumno(usuarioAutenticado);
  const alumno = await estudiantesRepository.buscarPerfilCompleto(idAlumno);

  if (!alumno) {
    throw new ErrorAplicacion("Estudiante no encontrado", 404);
  }

  const totalHoras = sumarHoras(alumno.registros);

  return {
    idAlumno: alumno.idAlumno,
    nombreCompleto: alumno.nombreCompleto,
    carrera: alumno.carrera,
    universidad: alumno.universidad,
    periodoAcademico: alumno.periodoAcademico,
    telefono: alumno.telefono,
    estado: alumno.estado,
    horasRequeridas: alumno.horasRequeridas,
    email: alumno.usuario.email,
    totalHoras,
    totalEvidencias: alumno._count.evidencias,
    proyectos: alumno.asignaciones.map((asignacion) => asignacion.proyecto),
  };
}

// Proyectos asignados al estudiante logueado.
async function obtenerProyectosPropios(usuarioAutenticado) {
  const idAlumno = asegurarAlumno(usuarioAutenticado);
  return estudiantesRepository.listarProyectosDeAlumno(idAlumno);
}

async function registrarEstudiante(datosEntrada) {
  const emailValidado = validarFormatoEmail(datosEntrada.email);
  validarFortalezaContrasena(datosEntrada.contrasena);

  const passwordEncriptada = await encriptarContrasena(datosEntrada.contrasena);

  const datosUsuario = {
    email: emailValidado,
    passwordEncriptada,
  };

  const datosAlumno = {
    nombreCompleto: datosEntrada.nombreCompleto,
    carrera: datosEntrada.carrera || null,
    universidad: datosEntrada.universidad || null,
    periodoAcademico: datosEntrada.periodoAcademico || null,
    telefono: datosEntrada.telefono || null,
    estado: datosEntrada.estado || "ACTIVO",
    horasRequeridas: Number(datosEntrada.horasRequeridas) || 240,
  };

  return estudiantesRepository.crearEstudiante(datosUsuario, datosAlumno);
}

// Descarta las claves sin valor para no sobrescribir con undefined.
function soloCamposEnviados(datos) {
  return Object.fromEntries(
    Object.entries(datos).filter(([, valor]) => valor !== undefined)
  );
}

async function actualizarEstudiante(idAlumno, datosEntrada) {
  await obtenerEstudiantePorId(idAlumno);

  const datosAlumno = soloCamposEnviados({
    nombreCompleto: datosEntrada.nombreCompleto,
    carrera: datosEntrada.carrera,
    universidad: datosEntrada.universidad,
    periodoAcademico: datosEntrada.periodoAcademico,
    telefono: datosEntrada.telefono,
    estado: datosEntrada.estado,
    horasRequeridas:
      datosEntrada.horasRequeridas === undefined
        ? undefined
        : Number(datosEntrada.horasRequeridas) || 240,
  });

  return estudiantesRepository.actualizarEstudiante(idAlumno, datosAlumno);
}

// El estudiante actualiza sus propios datos de contacto. No puede tocar
// su estado ni su meta de horas: eso lo administra la coordinacion.
async function actualizarPerfilPropio(usuarioAutenticado, datosEntrada) {
  const idAlumno = asegurarAlumno(usuarioAutenticado);

  const datosAlumno = soloCamposEnviados({
    nombreCompleto: datosEntrada.nombreCompleto,
    carrera: datosEntrada.carrera,
    universidad: datosEntrada.universidad,
    periodoAcademico: datosEntrada.periodoAcademico,
    telefono: datosEntrada.telefono,
  });

  await estudiantesRepository.actualizarEstudiante(idAlumno, datosAlumno);
  return obtenerPerfilPropio(usuarioAutenticado);
}

// El administrador asigna una contrasena nueva a un estudiante.
async function restablecerContrasena(idAlumno, contrasenaNueva) {
  validarFortalezaContrasena(contrasenaNueva);

  const estudianteEncontrado = await obtenerEstudiantePorId(idAlumno);
  const passwordEncriptada = await encriptarContrasena(contrasenaNueva);

  return estudiantesRepository.actualizarPasswordDeUsuario(
    estudianteEncontrado.idUsuario,
    passwordEncriptada
  );
}

async function eliminarEstudiante(idAlumno) {
  const estudianteEncontrado = await obtenerEstudiantePorId(idAlumno);
  await estudiantesRepository.eliminarEstudiante(estudianteEncontrado.idUsuario);
}

module.exports = {
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  obtenerPerfilPropio,
  obtenerProyectosPropios,
  registrarEstudiante,
  actualizarEstudiante,
  actualizarPerfilPropio,
  restablecerContrasena,
  eliminarEstudiante,
};
