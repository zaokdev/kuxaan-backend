// Controller del modulo de asignaciones.
const asignacionesService = require("./asignaciones.service");
const { enviarExito } = require("../../utils/respuestas");
const obtenerIdNumerico = require("../../utils/parametros");

async function listarAsignaciones(peticion, respuesta) {
  const listaAsignaciones = await asignacionesService.obtenerAsignaciones();
  return enviarExito(respuesta, listaAsignaciones);
}

async function crearAsignacion(peticion, respuesta) {
  const idAlumno = obtenerIdNumerico(peticion.body.idAlumno, "idAlumno");
  const idProyecto = obtenerIdNumerico(peticion.body.idProyecto, "idProyecto");
  const asignacionCreada = await asignacionesService.registrarAsignacion(idAlumno, idProyecto);
  return enviarExito(respuesta, asignacionCreada, 201, "Estudiante asignado al proyecto");
}

async function eliminarAsignacion(peticion, respuesta) {
  const idAsignacion = obtenerIdNumerico(peticion.params.id, "idAsignacion");
  await asignacionesService.eliminarAsignacion(idAsignacion);
  return enviarExito(respuesta, null, 200, "Asignacion eliminada correctamente");
}

module.exports = { listarAsignaciones, crearAsignacion, eliminarAsignacion };
