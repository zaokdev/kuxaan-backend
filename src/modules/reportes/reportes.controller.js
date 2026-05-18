// Controlador de los reportes administrativos.
const reportesServicio = require("./reportes.service");
const { enviarExito } = require("../../utils/respuestas");

async function reporteEstudiantes(peticion, respuesta) {
  const datos = await reportesServicio.generarReporteEstudiantes();
  return enviarExito(respuesta, datos, 200, "Reporte de horas por estudiante");
}

async function reporteProyectos(peticion, respuesta) {
  const datos = await reportesServicio.generarReporteProyectos();
  return enviarExito(respuesta, datos, 200, "Reporte de participacion en proyectos");
}

async function reporteHoras(peticion, respuesta) {
  const datos = await reportesServicio.generarReporteHoras();
  return enviarExito(respuesta, datos, 200, "Reporte de registro de horas por proyecto");
}

async function reporteEvidencias(peticion, respuesta) {
  const datos = await reportesServicio.generarReporteEvidencias();
  return enviarExito(respuesta, datos, 200, "Reporte de evidencias registradas");
}

async function reporteGeneral(peticion, respuesta) {
  const datos = await reportesServicio.generarReporteGeneral();
  return enviarExito(respuesta, datos, 200, "Reporte administrativo general");
}

module.exports = {
  reporteEstudiantes,
  reporteProyectos,
  reporteHoras,
  reporteEvidencias,
  reporteGeneral,
};
