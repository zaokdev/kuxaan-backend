// Acceso a datos de las asignaciones estudiante-proyecto.
const clientePrisma = require("../../config/prisma");

function listarAsignaciones() {
  return clientePrisma.asignacion.findMany({
    include: {
      alumno: { select: { idAlumno: true, nombreCompleto: true } },
      proyecto: { select: { idProyecto: true, nombreProyecto: true } },
    },
    orderBy: { idAsignacion: "asc" },
  });
}

function crearAsignacion(idAlumno, idProyecto) {
  return clientePrisma.asignacion.create({
    data: { idAlumno, idProyecto },
    include: {
      alumno: { select: { idAlumno: true, nombreCompleto: true } },
      proyecto: { select: { idProyecto: true, nombreProyecto: true } },
    },
  });
}

function eliminarAsignacion(idAsignacion) {
  return clientePrisma.asignacion.delete({ where: { idAsignacion } });
}

module.exports = { listarAsignaciones, crearAsignacion, eliminarAsignacion };
