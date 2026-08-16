// Logica de negocio de los reportes: transforma los datos crudos
// en la estructura final de cada reporte administrativo.
const reportesRepository = require("./reportes.repository");
const sumarHoras = require("../../utils/horas");

// Reporte de horas acumuladas por estudiante.
async function generarReporteEstudiantes() {
  const estudiantes = await reportesRepository.obtenerDatosEstudiantes();

  return estudiantes.map((estudiante) => {
    const totalHorasAcumuladas = sumarHoras(estudiante.registros);
    const proyectosAsignados = estudiante.asignaciones.map(
      (asignacion) => asignacion.proyecto.nombreProyecto
    );

    return {
      idAlumno: estudiante.idAlumno,
      nombreCompleto: estudiante.nombreCompleto,
      carrera: estudiante.carrera,
      universidad: estudiante.universidad,
      proyectosAsignados,
      totalHorasAcumuladas,
    };
  });
}

// Reporte de participacion de estudiantes en cada proyecto.
async function generarReporteProyectos() {
  const proyectos = await reportesRepository.obtenerDatosProyectos();

  return proyectos.map((proyecto) => {
    const estudiantesAsignados = proyecto.asignaciones.map((asignacion) => ({
      idAlumno: asignacion.alumno.idAlumno,
      nombreCompleto: asignacion.alumno.nombreCompleto,
    }));

    return {
      idProyecto: proyecto.idProyecto,
      nombreProyecto: proyecto.nombreProyecto,
      responsable: proyecto.responsable,
      comunidadBeneficiada: proyecto.comunidadBeneficiada,
      estudiantesAsignados,
      totalParticipantes: estudiantesAsignados.length,
    };
  });
}

// Reporte de registro de horas detallado por proyecto.
async function generarReporteHoras() {
  const registros = await reportesRepository.obtenerRegistrosHoras();

  return registros.map((registro) => ({
    nombreProyecto: registro.proyecto.nombreProyecto,
    estudianteParticipante: registro.alumno.nombreCompleto,
    fechaRegistro: registro.fechaRegistro,
    cantidadHoras: registro.cantidadHoras,
    descripcion: registro.descripcion,
  }));
}

// Reporte de evidencias cargadas.
async function generarReporteEvidencias() {
  const evidencias = await reportesRepository.obtenerEvidencias();

  return evidencias.map((evidencia) => ({
    nombreEstudiante: evidencia.alumno.nombreCompleto,
    proyectoRelacionado: evidencia.proyecto.nombreProyecto,
    tipoArchivo: evidencia.tipoArchivo,
    nombreArchivo: evidencia.nombreArchivo,
    fechaSubida: evidencia.fechaSubida,
    urlArchivo: evidencia.urlArchivo,
  }));
}

// Reporte administrativo general con indicadores globales.
async function generarReporteGeneral() {
  return reportesRepository.obtenerIndicadoresGenerales();
}

module.exports = {
  generarReporteEstudiantes,
  generarReporteProyectos,
  generarReporteHoras,
  generarReporteEvidencias,
  generarReporteGeneral,
};
