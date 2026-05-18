// Logica de negocio del catalogo de proyectos comunitarios.
const proyectosRepositorio = require("./proyectos.repository");
const convertirAFecha = require("../../utils/fechas");
const ErrorAplicacion = require("../../utils/errores");

async function obtenerProyectos() {
  return proyectosRepositorio.listarProyectos();
}

async function obtenerProyectoPorId(idProyecto) {
  const proyectoEncontrado = await proyectosRepositorio.buscarProyectoPorId(idProyecto);

  if (!proyectoEncontrado) {
    throw new ErrorAplicacion("Proyecto no encontrado", 404);
  }

  return proyectoEncontrado;
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

  return proyectosRepositorio.crearProyecto(datosProyecto);
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

  return proyectosRepositorio.actualizarProyecto(idProyecto, datosProyecto);
}

module.exports = {
  obtenerProyectos,
  obtenerProyectoPorId,
  registrarProyecto,
  actualizarProyecto,
};
