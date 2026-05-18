// Acceso a datos del catalogo de proyectos.
const clientePrisma = require("../../config/prisma");

function listarProyectos() {
  return clientePrisma.proyecto.findMany({ orderBy: { idProyecto: "asc" } });
}

function buscarProyectoPorId(idProyecto) {
  return clientePrisma.proyecto.findUnique({ where: { idProyecto } });
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

module.exports = {
  listarProyectos,
  buscarProyectoPorId,
  crearProyecto,
  actualizarProyecto,
};
