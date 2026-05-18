// Controlador del modulo de proyectos.
const proyectosServicio = require("./proyectos.service");
const { enviarExito } = require("../../utils/respuestas");
const obtenerIdNumerico = require("../../utils/parametros");

async function listarProyectos(peticion, respuesta) {
  const listaProyectos = await proyectosServicio.obtenerProyectos();
  return enviarExito(respuesta, listaProyectos);
}

async function obtenerProyecto(peticion, respuesta) {
  const idProyecto = obtenerIdNumerico(peticion.params.id, "idProyecto");
  const proyecto = await proyectosServicio.obtenerProyectoPorId(idProyecto);
  return enviarExito(respuesta, proyecto);
}

async function crearProyecto(peticion, respuesta) {
  const proyectoCreado = await proyectosServicio.registrarProyecto(peticion.body);
  return enviarExito(respuesta, proyectoCreado, 201, "Proyecto registrado correctamente");
}

async function actualizarProyecto(peticion, respuesta) {
  const idProyecto = obtenerIdNumerico(peticion.params.id, "idProyecto");
  const proyectoActualizado = await proyectosServicio.actualizarProyecto(
    idProyecto,
    peticion.body
  );
  return enviarExito(respuesta, proyectoActualizado, 200, "Proyecto actualizado correctamente");
}

module.exports = {
  listarProyectos,
  obtenerProyecto,
  crearProyecto,
  actualizarProyecto,
};
