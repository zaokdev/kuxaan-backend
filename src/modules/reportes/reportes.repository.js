// Acceso a datos para los reportes administrativos.
const clientePrisma = require("../../config/prisma");

// Estudiantes con sus registros de horas y proyectos asignados.
function obtenerDatosEstudiantes() {
  return clientePrisma.alumno.findMany({
    include: {
      registros: { select: { cantidadHoras: true } },
      asignaciones: { include: { proyecto: { select: { nombreProyecto: true } } } },
    },
    orderBy: { idAlumno: "asc" },
  });
}

// Proyectos con la lista de estudiantes asignados.
function obtenerDatosProyectos() {
  return clientePrisma.proyecto.findMany({
    include: {
      asignaciones: { include: { alumno: { select: { idAlumno: true, nombreCompleto: true } } } },
    },
    orderBy: { idProyecto: "asc" },
  });
}

// Registros de horas agrupables por proyecto.
function obtenerRegistrosHoras() {
  return clientePrisma.registroHoras.findMany({
    include: {
      alumno: { select: { nombreCompleto: true } },
      proyecto: { select: { idProyecto: true, nombreProyecto: true } },
    },
    orderBy: { fechaRegistro: "desc" },
  });
}

function obtenerEvidencias() {
  return clientePrisma.evidencia.findMany({
    include: {
      alumno: { select: { nombreCompleto: true } },
      proyecto: { select: { nombreProyecto: true } },
    },
    orderBy: { fechaSubida: "desc" },
  });
}

// Conteos globales para el reporte general.
async function obtenerIndicadoresGenerales() {
  const totalEstudiantes = await clientePrisma.alumno.count();
  const totalProyectosActivos = await clientePrisma.proyecto.count({
    where: { estado: "ACTIVO" },
  });
  const sumaHoras = await clientePrisma.registroHoras.aggregate({
    _sum: { cantidadHoras: true },
  });
  const totalEvidencias = await clientePrisma.evidencia.count();

  return {
    totalEstudiantes,
    totalProyectosActivos,
    totalHorasRegistradas: sumaHoras._sum.cantidadHoras || 0,
    totalEvidencias,
  };
}

module.exports = {
  obtenerDatosEstudiantes,
  obtenerDatosProyectos,
  obtenerRegistrosHoras,
  obtenerEvidencias,
  obtenerIndicadoresGenerales,
};
