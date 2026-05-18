// Logica de negocio del modulo de evidencias.
const evidenciasRepositorio = require("./evidencias.repository");
const estudiantesServicio = require("../estudiantes/estudiantes.service");
const proyectosServicio = require("../proyectos/proyectos.service");
const ErrorAplicacion = require("../../utils/errores");
const ROLES = require("../../utils/roles");

async function obtenerEvidencias(usuarioAutenticado) {
  const filtroAlumno =
    usuarioAutenticado.rol === ROLES.ESTUDIANTE ? usuarioAutenticado.idAlumno : undefined;
  return evidenciasRepositorio.listarEvidencias(filtroAlumno);
}

async function obtenerEvidenciaPorId(idEvidencia) {
  const evidenciaEncontrada = await evidenciasRepositorio.buscarEvidenciaPorId(idEvidencia);

  if (!evidenciaEncontrada) {
    throw new ErrorAplicacion("Evidencia no encontrada", 404);
  }

  return evidenciaEncontrada;
}

async function registrarEvidencia(idAlumno, idProyecto, archivoCargado) {
  if (!archivoCargado) {
    throw new ErrorAplicacion("Debe adjuntar un archivo de evidencia", 400);
  }

  await estudiantesServicio.obtenerEstudiantePorId(idAlumno);
  await proyectosServicio.obtenerProyectoPorId(idProyecto);

  const datosEvidencia = {
    idAlumno,
    idProyecto,
    nombreArchivo: archivoCargado.originalname,
    tipoArchivo: archivoCargado.mimetype,
    urlArchivo: archivoCargado.path,
  };

  return evidenciasRepositorio.crearEvidencia(datosEvidencia);
}

module.exports = { obtenerEvidencias, obtenerEvidenciaPorId, registrarEvidencia };
