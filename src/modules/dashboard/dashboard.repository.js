// Acceso a datos del panel administrativo.
// Reutiliza las mismas tablas que los reportes para calcular metricas.
const clientePrisma = require("../../config/prisma");

// Proyectos con su numero de participantes y sus horas registradas,
// para armar el listado de "proyectos mas activos".
function obtenerProyectosConMetricas() {
  return clientePrisma.proyecto.findMany({
    include: {
      _count: { select: { asignaciones: true } },
      registros: { select: { cantidadHoras: true } },
    },
    orderBy: { idProyecto: "asc" },
  });
}

module.exports = { obtenerProyectosConMetricas };
