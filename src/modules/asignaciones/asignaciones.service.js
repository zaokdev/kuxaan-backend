// Logica de negocio de las asignaciones.
// Antes de asignar valida que el alumno y el proyecto existan.
const asignacionesRepositorio = require("./asignaciones.repository");
const estudiantesServicio = require("../estudiantes/estudiantes.service");
const proyectosServicio = require("../proyectos/proyectos.service");

async function obtenerAsignaciones() {
  return asignacionesRepositorio.listarAsignaciones();
}

async function registrarAsignacion(idAlumno, idProyecto) {
  await estudiantesServicio.obtenerEstudiantePorId(idAlumno);
  await proyectosServicio.obtenerProyectoPorId(idProyecto);

  return asignacionesRepositorio.crearAsignacion(idAlumno, idProyecto);
}

async function eliminarAsignacion(idAsignacion) {
  return asignacionesRepositorio.eliminarAsignacion(idAsignacion);
}

module.exports = { obtenerAsignaciones, registrarAsignacion, eliminarAsignacion };
