// Logica de negocio del panel administrativo.
// Combina los indicadores generales (reutilizados de reportes) con el
// ranking de proyectos mas activos que muestra el dashboard.
const reportesService = require("../reportes/reportes.service");
const dashboardRepository = require("./dashboard.repository");
const sumarHoras = require("../../utils/horas");

async function obtenerEstadisticas() {
  const indicadores = await reportesService.generarReporteGeneral();
  const proyectos = await dashboardRepository.obtenerProyectosConMetricas();

  const proyectosDestacados = proyectos
    .map((proyecto) => ({
      idProyecto: proyecto.idProyecto,
      nombreProyecto: proyecto.nombreProyecto,
      comunidadBeneficiada: proyecto.comunidadBeneficiada,
      estado: proyecto.estado,
      totalParticipantes: proyecto._count.asignaciones,
      totalHoras: sumarHoras(proyecto.registros),
    }))
    .sort((a, b) => b.totalHoras - a.totalHoras)
    .slice(0, 5);

  return { ...indicadores, proyectosDestacados };
}

module.exports = { obtenerEstadisticas };
