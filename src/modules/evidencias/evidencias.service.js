// Logica de negocio del modulo de evidencias.
const fs = require("fs");
const path = require("path");
const evidenciasRepository = require("./evidencias.repository");
const estudiantesService = require("../estudiantes/estudiantes.service");
const proyectosService = require("../proyectos/proyectos.service");
const asignacionesService = require("../asignaciones/asignaciones.service");
const configuracion = require("../../config/entorno");
const ErrorAplicacion = require("../../utils/errores");
const ROLES = require("../../utils/roles");

async function obtenerEvidencias(usuarioAutenticado) {
  const filtroAlumno =
    usuarioAutenticado.rol === ROLES.ESTUDIANTE ? usuarioAutenticado.idAlumno : undefined;
  return evidenciasRepository.listarEvidencias(filtroAlumno);
}

async function obtenerEvidenciaPorId(idEvidencia) {
  const evidenciaEncontrada = await evidenciasRepository.buscarEvidenciaPorId(idEvidencia);

  if (!evidenciaEncontrada) {
    throw new ErrorAplicacion("Evidencia no encontrada", 404);
  }

  return evidenciaEncontrada;
}

// Localiza el archivo fisico de una evidencia para descargarlo.
// El administrador puede abrir cualquiera; el estudiante solo las suyas.
async function obtenerArchivoEvidencia(usuarioAutenticado, idEvidencia) {
  const evidenciaEncontrada = await obtenerEvidenciaPorId(idEvidencia);

  if (
    usuarioAutenticado.rol === ROLES.ESTUDIANTE &&
    evidenciaEncontrada.idAlumno !== usuarioAutenticado.idAlumno
  ) {
    throw new ErrorAplicacion("No tienes permiso para consultar esta evidencia", 403);
  }

  const rutaAbsoluta = path.resolve(evidenciaEncontrada.urlArchivo);
  const carpetaPermitida = path.resolve(configuracion.carpetaEvidencias);

  // El archivo debe vivir dentro de la carpeta de evidencias configurada.
  if (!rutaAbsoluta.startsWith(carpetaPermitida + path.sep)) {
    throw new ErrorAplicacion("La ruta del archivo no es valida", 400);
  }

  if (!fs.existsSync(rutaAbsoluta)) {
    throw new ErrorAplicacion("El archivo ya no existe en el servidor", 404);
  }

  return { rutaAbsoluta, nombreArchivo: evidenciaEncontrada.nombreArchivo };
}

async function registrarEvidencia(idAlumno, idProyecto, archivoCargado) {
  if (!archivoCargado) {
    throw new ErrorAplicacion("Debe adjuntar un archivo de evidencia", 400);
  }

  await estudiantesService.obtenerEstudiantePorId(idAlumno);
  await proyectosService.obtenerProyectoPorId(idProyecto);

  // La evidencia debe pertenecer a un proyecto donde el alumno participa.
  await asignacionesService.asegurarAsignacion(idAlumno, idProyecto);

  const datosEvidencia = {
    idAlumno,
    idProyecto,
    nombreArchivo: archivoCargado.originalname,
    tipoArchivo: archivoCargado.mimetype,
    urlArchivo: archivoCargado.path,
  };

  return evidenciasRepository.crearEvidencia(datosEvidencia);
}

async function eliminarEvidencia(idEvidencia) {
  const evidenciaEncontrada = await evidenciasRepository.buscarEvidenciaPorId(idEvidencia);

  if (!evidenciaEncontrada) {
    throw new ErrorAplicacion("Evidencia no encontrada", 404);
  }

  await evidenciasRepository.eliminarEvidencia(idEvidencia);

  // Borrado best-effort del archivo fisico; no bloquea si ya no existe.
  fs.promises.unlink(evidenciaEncontrada.urlArchivo).catch(() => {});

  return evidenciaEncontrada;
}

module.exports = {
  obtenerEvidencias,
  obtenerEvidenciaPorId,
  obtenerArchivoEvidencia,
  registrarEvidencia,
  eliminarEvidencia,
};
