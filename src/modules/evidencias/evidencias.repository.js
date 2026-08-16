// Acceso a datos de las evidencias cargadas por los estudiantes.
const clientePrisma = require("../../config/prisma");

const inclusionRelaciones = {
  alumno: { select: { idAlumno: true, nombreCompleto: true } },
  proyecto: { select: { idProyecto: true, nombreProyecto: true } },
};

function listarEvidencias(filtroAlumno) {
  return clientePrisma.evidencia.findMany({
    where: filtroAlumno ? { idAlumno: filtroAlumno } : undefined,
    include: inclusionRelaciones,
    orderBy: { fechaSubida: "desc" },
  });
}

function buscarEvidenciaPorId(idEvidencia) {
  return clientePrisma.evidencia.findUnique({
    where: { idEvidencia },
    include: inclusionRelaciones,
  });
}

function crearEvidencia(datosEvidencia) {
  return clientePrisma.evidencia.create({
    data: datosEvidencia,
    include: inclusionRelaciones,
  });
}

function eliminarEvidencia(idEvidencia) {
  return clientePrisma.evidencia.delete({ where: { idEvidencia } });
}

module.exports = { listarEvidencias, buscarEvidenciaPorId, crearEvidencia, eliminarEvidencia };
