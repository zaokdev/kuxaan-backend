// Suma las horas de una lista de registros de servicio social.
// Se reutiliza en los modulos que necesitan totales por alumno
// (listado de estudiantes, perfil propio y reportes).
function sumarHoras(registros) {
  if (!Array.isArray(registros)) {
    return 0;
  }

  return registros.reduce((acumulado, registro) => acumulado + registro.cantidadHoras, 0);
}

module.exports = sumarHoras;
