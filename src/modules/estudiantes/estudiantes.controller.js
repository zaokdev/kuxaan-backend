// Controlador del modulo de estudiantes.
const estudiantesServicio = require("./estudiantes.service");
const { enviarExito } = require("../../utils/respuestas");
const obtenerIdNumerico = require("../../utils/parametros");

async function listarEstudiantes(peticion, respuesta) {
  const listaEstudiantes = await estudiantesServicio.obtenerEstudiantes();
  return enviarExito(respuesta, listaEstudiantes);
}

async function obtenerEstudiante(peticion, respuesta) {
  const idAlumno = obtenerIdNumerico(peticion.params.id, "idAlumno");
  const estudiante = await estudiantesServicio.obtenerEstudiantePorId(idAlumno);
  return enviarExito(respuesta, estudiante);
}

async function crearEstudiante(peticion, respuesta) {
  const estudianteCreado = await estudiantesServicio.registrarEstudiante(peticion.body);
  return enviarExito(respuesta, estudianteCreado, 201, "Estudiante registrado correctamente");
}

async function actualizarEstudiante(peticion, respuesta) {
  const idAlumno = obtenerIdNumerico(peticion.params.id, "idAlumno");
  const estudianteActualizado = await estudiantesServicio.actualizarEstudiante(
    idAlumno,
    peticion.body
  );
  return enviarExito(respuesta, estudianteActualizado, 200, "Estudiante actualizado correctamente");
}

async function eliminarEstudiante(peticion, respuesta) {
  const idAlumno = obtenerIdNumerico(peticion.params.id, "idAlumno");
  await estudiantesServicio.eliminarEstudiante(idAlumno);
  return enviarExito(respuesta, null, 200, "Estudiante eliminado correctamente");
}

module.exports = {
  listarEstudiantes,
  obtenerEstudiante,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
};
