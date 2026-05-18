// Acceso a datos de estudiantes (tablas usuarios + alumnos).
const clientePrisma = require("../../config/prisma");

const seleccionDatosUsuario = {
  idUsuario: true,
  email: true,
  rol: true,
  fechaRegistro: true,
};

function listarEstudiantes() {
  return clientePrisma.alumno.findMany({
    include: { usuario: { select: seleccionDatosUsuario } },
    orderBy: { idAlumno: "asc" },
  });
}

function buscarEstudiantePorId(idAlumno) {
  return clientePrisma.alumno.findUnique({
    where: { idAlumno },
    include: { usuario: { select: seleccionDatosUsuario } },
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

module.exports = {
  listarEstudiantes,
  buscarEstudiantePorId,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
};
