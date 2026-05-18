// Acceso a datos del registro de horas de servicio social.
const clientePrisma = require("../../config/prisma");

const inclusionRelaciones = {
  alumno: { select: { idAlumno: true, nombreCompleto: true } },
  proyecto: { select: { idProyecto: true, nombreProyecto: true } },
};

// Lista todos los registros o solo los de un alumno especifico.
function listarRegistros(filtroAlumno) {
  return clientePrisma.registroHoras.findMany({
    where: filtroAlumno ? { idAlumno: filtroAlumno } : undefined,
    include: inclusionRelaciones,
    orderBy: { fechaRegistro: "desc" },
  });
}

function buscarRegistroPorId(idRegistro) {
  return clientePrisma.registroHoras.findUnique({ where: { idRegistro } });
}

function crearRegistro(datosRegistro) {
  return clientePrisma.registroHoras.create({
    data: datosRegistro,
    include: inclusionRelaciones,
  });
}

function actualizarRegistro(idRegistro, datosRegistro) {
  return clientePrisma.registroHoras.update({
    where: { idRegistro },
    data: datosRegistro,
    include: inclusionRelaciones,
  });
}

module.exports = {
  listarRegistros,
  buscarRegistroPorId,
  crearRegistro,
  actualizarRegistro,
};
