// Controller del registro de horas de servicio social.
const horasService = require("./horas.service");
const { enviarExito } = require("../../utils/respuestas");
const obtenerIdNumerico = require("../../utils/parametros");
const ErrorAplicacion = require("../../utils/errores");
const ROLES = require("../../utils/roles");

async function listarRegistros(peticion, respuesta) {
  const listaRegistros = await horasService.obtenerRegistros(peticion.usuario);
  return enviarExito(respuesta, listaRegistros);
}

async function crearRegistro(peticion, respuesta) {
  // El estudiante registra horas para si mismo; el admin indica el alumno.
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

  const registroCreado = await horasService.registrarHoras(idAlumno, {
    idProyecto,
    cantidadHoras: peticion.body.cantidadHoras,
    descripcion: peticion.body.descripcion,
    fechaRegistro: peticion.body.fechaRegistro,
  });

  return enviarExito(respuesta, registroCreado, 201, "Horas registradas correctamente");
}

async function actualizarRegistro(peticion, respuesta) {
  const idRegistro = obtenerIdNumerico(peticion.params.id, "idRegistro");
  const registroActualizado = await horasService.actualizarRegistro(idRegistro, peticion.body);
  return enviarExito(respuesta, registroActualizado, 200, "Registro actualizado correctamente");
}

async function eliminarRegistro(peticion, respuesta) {
  const idRegistro = obtenerIdNumerico(peticion.params.id, "idRegistro");
  await horasService.eliminarRegistro(idRegistro);
  return enviarExito(respuesta, null, 200, "Registro eliminado correctamente");
}

module.exports = { listarRegistros, crearRegistro, actualizarRegistro, eliminarRegistro };
