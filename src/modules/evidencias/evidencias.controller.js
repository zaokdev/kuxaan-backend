// Controlador del modulo de evidencias.
const evidenciasServicio = require("./evidencias.service");
const { enviarExito } = require("../../utils/respuestas");
const obtenerIdNumerico = require("../../utils/parametros");
const ErrorAplicacion = require("../../utils/errores");
const ROLES = require("../../utils/roles");

async function listarEvidencias(peticion, respuesta) {
  const listaEvidencias = await evidenciasServicio.obtenerEvidencias(peticion.usuario);
  return enviarExito(respuesta, listaEvidencias);
}

async function obtenerEvidencia(peticion, respuesta) {
  const idEvidencia = obtenerIdNumerico(peticion.params.id, "idEvidencia");
  const evidencia = await evidenciasServicio.obtenerEvidenciaPorId(idEvidencia);
  return enviarExito(respuesta, evidencia);
}

async function crearEvidencia(peticion, respuesta) {
  // El estudiante sube evidencia propia; el admin indica el alumno.
  let idAlumno;
  if (peticion.usuario.rol === ROLES.ESTUDIANTE) {
    idAlumno = peticion.usuario.idAlumno;
    if (!idAlumno) {
      throw new ErrorAplicacion("El usuario no tiene un perfil de alumno asociado", 400);
    }
  } else {
    idAlumno = obtenerIdNumerico(peticion.body.idAlumno, "idAlumno");
  }

  const idProyecto = obtenerIdNumerico(peticion.body.idProyecto, "idProyecto");

  const evidenciaCreada = await evidenciasServicio.registrarEvidencia(
    idAlumno,
    idProyecto,
    peticion.file
  );

  return enviarExito(respuesta, evidenciaCreada, 201, "Evidencia cargada correctamente");
}

module.exports = { listarEvidencias, obtenerEvidencia, crearEvidencia };
