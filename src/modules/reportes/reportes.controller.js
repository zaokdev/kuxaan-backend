// Controller de los reportes administrativos.
const reportesService = require("./reportes.service");
const { enviarExito } = require("../../utils/respuestas");

async function reporteEstudiantes(peticion, respuesta) {
  const datos = await reportesService.generarReporteEstudiantes();
  return enviarExito(respuesta, datos, 200, "Reporte de horas por estudiante");
}

async function reporteProyectos(peticion, respuesta) {
  const datos = await reportesService.generarReporteProyectos();
  return enviarExito(respuesta, datos, 200, "Reporte de participacion en proyectos");
}

async function reporteHoras(peticion, respuesta) {
  const datos = await reportesService.generarReporteHoras();
  return enviarExito(respuesta, datos, 200, "Reporte de registro de horas por proyecto");
}

async function reporteEvidencias(peticion, respuesta) {
  const datos = await reportesService.generarReporteEvidencias();
  return enviarExito(respuesta, datos, 200, "Reporte de evidencias registradas");
}

async function reporteGeneral(peticion, respuesta) {
  const datos = await reportesService.generarReporteGeneral();
  return enviarExito(respuesta, datos, 200, "Reporte administrativo general");
}

module.exports = {
  reporteEstudiantes,
  reporteProyectos,
  reporteHoras,
  reporteEvidencias,
  reporteGeneral,
};
