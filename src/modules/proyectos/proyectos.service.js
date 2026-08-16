// Logica de negocio del catalogo de proyectos comunitarios.
const proyectosRepository = require("./proyectos.repository");
const convertirAFecha = require("../../utils/fechas");
const ErrorAplicacion = require("../../utils/errores");

async function obtenerProyectos() {
  return proyectosRepository.listarProyectos();
}

async function obtenerProyectoPorId(idProyecto) {
  const proyectoEncontrado = await proyectosRepository.buscarProyectoPorId(idProyecto);

  if (!proyectoEncontrado) {
    throw new ErrorAplicacion("Proyecto no encontrado", 404);
  }

  return proyectoEncontrado;
}

// Estudiantes asignados a un proyecto (valida que el proyecto exista).
async function obtenerEstudiantesDeProyecto(idProyecto) {
  await obtenerProyectoPorId(idProyecto);
  return proyectosRepository.listarEstudiantesDeProyecto(idProyecto);
}

async function registrarProyecto(datosEntrada) {
  const datosProyecto = {
    nombreProyecto: datosEntrada.nombreProyecto,
    objetivo: datosEntrada.objetivo || null,
    comunidadBeneficiada: datosEntrada.comunidadBeneficiada || null,
    responsable: datosEntrada.responsable || null,
    fechaInicio: convertirAFecha(datosEntrada.fechaInicio, "fechaInicio"),
    fechaTermino: convertirAFecha(datosEntrada.fechaTermino, "fechaTermino"),
    estado: datosEntrada.estado || "ACTIVO",
  };

  return proyectosRepository.crearProyecto(datosProyecto);
}

async function actualizarProyecto(idProyecto, datosEntrada) {
  await obtenerProyectoPorId(idProyecto);

  const datosProyecto = {
    nombreProyecto: datosEntrada.nombreProyecto,
    objetivo: datosEntrada.objetivo,
    comunidadBeneficiada: datosEntrada.comunidadBeneficiada,
    responsable: datosEntrada.responsable,
    estado: datosEntrada.estado,
  };

  if (datosEntrada.fechaInicio !== undefined) {
    datosProyecto.fechaInicio = convertirAFecha(datosEntrada.fechaInicio, "fechaInicio");
  }
  if (datosEntrada.fechaTermino !== undefined) {
    datosProyecto.fechaTermino = convertirAFecha(datosEntrada.fechaTermino, "fechaTermino");
  }

  Object.keys(datosProyecto).forEach((campo) => {
    if (datosProyecto[campo] === undefined) {
      delete datosProyecto[campo];
    }
  });

  return proyectosRepository.actualizarProyecto(idProyecto, datosProyecto);
}

// Elimina un proyecto sin historial. Las asignaciones se borran en cascada,
// pero un proyecto con horas o evidencias arrastraria el trabajo registrado
// por los estudiantes, asi que en ese caso se rechaza.
async function eliminarProyecto(idProyecto) {
  await obtenerProyectoPorId(idProyecto);

  const relaciones = await proyectosRepository.contarRelacionesDeProyecto(idProyecto);

  if (relaciones._count.registros > 0 || relaciones._count.evidencias > 0) {
    throw new ErrorAplicacion(
      "No se puede eliminar un proyecto con horas o evidencias registradas. Cambia su estado a INACTIVO.",
      409
    );
  }

  return proyectosRepository.eliminarProyecto(idProyecto);
}

module.exports = {
  obtenerProyectos,
  obtenerProyectoPorId,
  obtenerEstudiantesDeProyecto,
  registrarProyecto,
  actualizarProyecto,
  eliminarProyecto,
};
