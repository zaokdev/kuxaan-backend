// Controller del modulo de evidencias.
const evidenciasService = require("./evidencias.service");
const { enviarExito } = require("../../utils/respuestas");
const obtenerIdNumerico = require("../../utils/parametros");
const ErrorAplicacion = require("../../utils/errores");
const ROLES = require("../../utils/roles");

async function listarEvidencias(peticion, respuesta) {
  const listaEvidencias = await evidenciasService.obtenerEvidencias(peticion.usuario);
  return enviarExito(respuesta, listaEvidencias);
}

async function obtenerEvidencia(peticion, respuesta) {
  const idEvidencia = obtenerIdNumerico(peticion.params.id, "idEvidencia");
  const evidencia = await evidenciasService.obtenerEvidenciaPorId(idEvidencia);
  return enviarExito(respuesta, evidencia);
}

async function descargarEvidencia(peticion, respuesta) {
  const idEvidencia = obtenerIdNumerico(peticion.params.id, "idEvidencia");
  const { rutaAbsoluta, nombreArchivo } = await evidenciasService.obtenerArchivoEvidencia(
    peticion.usuario,
    idEvidencia
  );

  return respuesta.download(rutaAbsoluta, nombreArchivo);
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

  const evidenciaCreada = await evidenciasService.registrarEvidencia(
    idAlumno,
    idProyecto,
    peticion.file
  );

  return enviarExito(respuesta, evidenciaCreada, 201, "Evidencia cargada correctamente");
}

async function eliminarEvidencia(peticion, respuesta) {
  const idEvidencia = obtenerIdNumerico(peticion.params.id, "idEvidencia");
  await evidenciasService.eliminarEvidencia(idEvidencia);
  return enviarExito(respuesta, null, 200, "Evidencia eliminada correctamente");
}

module.exports = {
  listarEvidencias,
  obtenerEvidencia,
  descargarEvidencia,
  crearEvidencia,
  eliminarEvidencia,
};
