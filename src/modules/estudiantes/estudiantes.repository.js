// Acceso a datos de estudiantes (tablas usuarios + alumnos).
const clientePrisma = require("../../config/prisma");

const seleccionDatosUsuario = {
  idUsuario: true,
  email: true,
  rol: true,
  fechaRegistro: true,
};

// Incluye los registros de horas para poder calcular el total acumulado
// que muestra la tabla de estudiantes del administrador.
function listarEstudiantes() {
  return clientePrisma.alumno.findMany({
    include: {
      usuario: { select: seleccionDatosUsuario },
      registros: { select: { cantidadHoras: true } },
    },
    orderBy: { idAlumno: "asc" },
  });
}

function buscarEstudiantePorId(idAlumno) {
  return clientePrisma.alumno.findUnique({
    where: { idAlumno },
    include: { usuario: { select: seleccionDatosUsuario } },
  });
}

// Perfil del estudiante con sus totales (horas, evidencias) y proyectos.
// Alimenta el panel de auto-servicio del estudiante (GET /students/me).
function buscarPerfilCompleto(idAlumno) {
  return clientePrisma.alumno.findUnique({
    where: { idAlumno },
    include: {
      usuario: { select: seleccionDatosUsuario },
      registros: { select: { cantidadHoras: true } },
      asignaciones: { include: { proyecto: true } },
      _count: { select: { evidencias: true } },
    },
  });
}

// Proyectos a los que el alumno esta asignado.
function listarProyectosDeAlumno(idAlumno) {
  return clientePrisma.proyecto.findMany({
    where: { asignaciones: { some: { idAlumno } } },
    orderBy: { idProyecto: "asc" },
  });
}

// Crea el usuario de acceso y el perfil de alumno en una sola operacion.
function crearEstudiante(datosUsuario, datosAlumno) {
  return clientePrisma.usuario.create({
    data: {
      email: datosUsuario.email,
      password: datosUsuario.passwordEncriptada,
      rol: "ESTUDIANTE",
      alumno: { create: datosAlumno },
    },
    include: { alumno: true },
  });
}

function actualizarEstudiante(idAlumno, datosAlumno) {
  return clientePrisma.alumno.update({
    where: { idAlumno },
    data: datosAlumno,
    include: { usuario: { select: seleccionDatosUsuario } },
  });
}

// Al borrar el usuario se elimina en cascada el alumno asociado.
function eliminarEstudiante(idUsuario) {
  return clientePrisma.usuario.delete({ where: { idUsuario } });
}

// Restablecimiento de contrasena hecho por el administrador.
function actualizarPasswordDeUsuario(idUsuario, passwordEncriptada) {
  return clientePrisma.usuario.update({
    where: { idUsuario },
    data: { password: passwordEncriptada },
    select: { idUsuario: true, email: true },
  });
}

module.exports = {
  listarEstudiantes,
  buscarEstudiantePorId,
  buscarPerfilCompleto,
  listarProyectosDeAlumno,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  actualizarPasswordDeUsuario,
};
