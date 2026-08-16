// Controller del panel administrativo.
const dashboardService = require("./dashboard.service");
const { enviarExito } = require("../../utils/respuestas");

async function obtenerEstadisticas(peticion, respuesta) {
  const estadisticas = await dashboardService.obtenerEstadisticas();
  return enviarExito(respuesta, estadisticas, 200, "Estadisticas del panel administrativo");
}

module.exports = { obtenerEstadisticas };
