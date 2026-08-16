// Logica de negocio de las asignaciones.
// Antes de asignar valida que el alumno y el proyecto existan.
const asignacionesRepository = require("./asignaciones.repository");
const estudiantesService = require("../estudiantes/estudiantes.service");
const proyectosService = require("../proyectos/proyectos.service");
const ErrorAplicacion = require("../../utils/errores");

async function obtenerAsignaciones() {
  return asignacionesRepository.listarAsignaciones();
}

async function registrarAsignacion(idAlumno, idProyecto) {
  await estudiantesService.obtenerEstudiantePorId(idAlumno);
  await proyectosService.obtenerProyectoPorId(idProyecto);

  return asignacionesRepository.crearAsignacion(idAlumno, idProyecto);
}

// Verifica que el alumno pertenezca al proyecto. La usan horas y evidencias
// para impedir registros en proyectos donde el estudiante no participa.
async function asegurarAsignacion(idAlumno, idProyecto) {
  const asignacionEncontrada = await asignacionesRepository.buscarAsignacion(
    idAlumno,
    idProyecto
  );

  if (!asignacionEncontrada) {
    throw new ErrorAplicacion(
      "El estudiante no esta asignado a este proyecto",
      409
    );
  }

  return asignacionEncontrada;
}

async function eliminarAsignacion(idAsignacion) {
  return asignacionesRepository.eliminarAsignacion(idAsignacion);
}

module.exports = {
  obtenerAsignaciones,
  registrarAsignacion,
  asegurarAsignacion,
  eliminarAsignacion,
};
