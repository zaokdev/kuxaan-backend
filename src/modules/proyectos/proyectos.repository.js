// Acceso a datos del catalogo de proyectos.
const clientePrisma = require("../../config/prisma");

function listarProyectos() {
  return clientePrisma.proyecto.findMany({ orderBy: { idProyecto: "asc" } });
}

function buscarProyectoPorId(idProyecto) {
  return clientePrisma.proyecto.findUnique({ where: { idProyecto } });
}

// Estudiantes asignados a un proyecto especifico.
function listarEstudiantesDeProyecto(idProyecto) {
  return clientePrisma.alumno.findMany({
    where: { asignaciones: { some: { idProyecto } } },
    include: { usuario: { select: { idUsuario: true, email: true } } },
    orderBy: { idAlumno: "asc" },
  });
}

// Conteo de registros relacionados, para decidir si el proyecto
// se puede eliminar sin arrastrar historial de estudiantes.
function contarRelacionesDeProyecto(idProyecto) {
  return clientePrisma.proyecto.findUnique({
    where: { idProyecto },
    select: {
      _count: { select: { registros: true, evidencias: true, asignaciones: true } },
    },
  });
}

function crearProyecto(datosProyecto) {
  return clientePrisma.proyecto.create({ data: datosProyecto });
}

function actualizarProyecto(idProyecto, datosProyecto) {
  return clientePrisma.proyecto.update({
    where: { idProyecto },
    data: datosProyecto,
  });
}

function eliminarProyecto(idProyecto) {
  return clientePrisma.proyecto.delete({ where: { idProyecto } });
}

module.exports = {
  listarProyectos,
  buscarProyectoPorId,
  listarEstudiantesDeProyecto,
  contarRelacionesDeProyecto,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
};
