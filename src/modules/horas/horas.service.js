// Logica de negocio del registro de horas de servicio social.
const horasRepositorio = require("./horas.repository");
const estudiantesServicio = require("../estudiantes/estudiantes.service");
const proyectosServicio = require("../proyectos/proyectos.service");
const convertirAFecha = require("../../utils/fechas");
const ErrorAplicacion = require("../../utils/errores");
const ROLES = require("../../utils/roles");

// El administrador ve todos los registros; el estudiante solo los suyos.
async function obtenerRegistros(usuarioAutenticado) {
  const filtroAlumno =
    usuarioAutenticado.rol === ROLES.ESTUDIANTE ? usuarioAutenticado.idAlumno : undefined;
  return horasRepositorio.listarRegistros(filtroAlumno);
}

async function registrarHoras(idAlumno, datosEntrada) {
  await estudiantesServicio.obtenerEstudiantePorId(idAlumno);
  await proyectosServicio.obtenerProyectoPorId(datosEntrada.idProyecto);

  const cantidadHoras = Number(datosEntrada.cantidadHoras);

  if (Number.isNaN(cantidadHoras) || cantidadHoras <= 0) {
    throw new ErrorAplicacion("La cantidad de horas debe ser un numero mayor a cero", 400);
  }

  const datosRegistro = {
    idAlumno,
    idProyecto: datosEntrada.idProyecto,
    cantidadHoras,
    descripcion: datosEntrada.descripcion || null,
    fechaRegistro: convertirAFecha(datosEntrada.fechaRegistro, "fechaRegistro") || new Date(),
  };

  return horasRepositorio.crearRegistro(datosRegistro);
}

async function actualizarRegistro(idRegistro, datosEntrada) {
  const registroEncontrado = await horasRepositorio.buscarRegistroPorId(idRegistro);

  if (!registroEncontrado) {
    throw new ErrorAplicacion("Registro de horas no encontrado", 404);
  }

  const datosRegistro = {};

  if (datosEntrada.cantidadHoras !== undefined) {
    const cantidadHoras = Number(datosEntrada.cantidadHoras);
    if (Number.isNaN(cantidadHoras) || cantidadHoras <= 0) {
      throw new ErrorAplicacion("La cantidad de horas debe ser un numero mayor a cero", 400);
    }
    datosRegistro.cantidadHoras = cantidadHoras;
  }

  if (datosEntrada.descripcion !== undefined) {
    datosRegistro.descripcion = datosEntrada.descripcion;
  }

  if (datosEntrada.fechaRegistro !== undefined) {
    datosRegistro.fechaRegistro = convertirAFecha(datosEntrada.fechaRegistro, "fechaRegistro");
  }

  return horasRepositorio.actualizarRegistro(idRegistro, datosRegistro);
}

module.exports = { obtenerRegistros, registrarHoras, actualizarRegistro };
