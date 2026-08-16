// Controller del modulo de estudiantes.
const estudiantesService = require("./estudiantes.service");
const { enviarExito } = require("../../utils/respuestas");
const obtenerIdNumerico = require("../../utils/parametros");

async function listarEstudiantes(peticion, respuesta) {
  const listaEstudiantes = await estudiantesService.obtenerEstudiantes();
  return enviarExito(respuesta, listaEstudiantes);
}

async function obtenerEstudiante(peticion, respuesta) {
  const idAlumno = obtenerIdNumerico(peticion.params.id, "idAlumno");
  const estudiante = await estudiantesService.obtenerEstudiantePorId(idAlumno);
  return enviarExito(respuesta, estudiante);
}

async function obtenerMiPerfil(peticion, respuesta) {
  const perfil = await estudiantesService.obtenerPerfilPropio(peticion.usuario);
  return enviarExito(respuesta, perfil);
}

async function obtenerMiProyecto(peticion, respuesta) {
  const proyectos = await estudiantesService.obtenerProyectosPropios(peticion.usuario);
  return enviarExito(respuesta, proyectos);
}

async function actualizarMiPerfil(peticion, respuesta) {
  const perfilActualizado = await estudiantesService.actualizarPerfilPropio(
    peticion.usuario,
    peticion.body
  );
  return enviarExito(respuesta, perfilActualizado, 200, "Perfil actualizado correctamente");
}

async function restablecerContrasena(peticion, respuesta) {
  const idAlumno = obtenerIdNumerico(peticion.params.id, "idAlumno");
  await estudiantesService.restablecerContrasena(idAlumno, peticion.body.contrasenaNueva);
  return enviarExito(respuesta, null, 200, "Contrasena restablecida correctamente");
}

async function crearEstudiante(peticion, respuesta) {
  const estudianteCreado = await estudiantesService.registrarEstudiante(peticion.body);
  return enviarExito(respuesta, estudianteCreado, 201, "Estudiante registrado correctamente");
}

async function actualizarEstudiante(peticion, respuesta) {
  const idAlumno = obtenerIdNumerico(peticion.params.id, "idAlumno");
  const estudianteActualizado = await estudiantesService.actualizarEstudiante(
    idAlumno,
    peticion.body
  );
  return enviarExito(respuesta, estudianteActualizado, 200, "Estudiante actualizado correctamente");
}

async function eliminarEstudiante(peticion, respuesta) {
  const idAlumno = obtenerIdNumerico(peticion.params.id, "idAlumno");
  await estudiantesService.eliminarEstudiante(idAlumno);
  return enviarExito(respuesta, null, 200, "Estudiante eliminado correctamente");
}

module.exports = {
  listarEstudiantes,
  obtenerEstudiante,
  obtenerMiPerfil,
  obtenerMiProyecto,
  actualizarMiPerfil,
  restablecerContrasena,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
};
