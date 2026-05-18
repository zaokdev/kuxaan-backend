// Enrutador principal: agrupa todos los modulos bajo el prefijo /api.
const express = require("express");

const rutasAutenticacion = require("../modules/auth/auth.routes");
const rutasEstudiantes = require("../modules/estudiantes/estudiantes.routes");
const rutasProyectos = require("../modules/proyectos/proyectos.routes");
const rutasAsignaciones = require("../modules/asignaciones/asignaciones.routes");
const rutasHoras = require("../modules/horas/horas.routes");
const rutasEvidencias = require("../modules/evidencias/evidencias.routes");
const rutasReportes = require("../modules/reportes/reportes.routes");

const enrutadorPrincipal = express.Router();

enrutadorPrincipal.use("/auth", rutasAutenticacion);
enrutadorPrincipal.use("/students", rutasEstudiantes);
enrutadorPrincipal.use("/projects", rutasProyectos);
enrutadorPrincipal.use("/assignments", rutasAsignaciones);
enrutadorPrincipal.use("/hours", rutasHoras);
enrutadorPrincipal.use("/evidence", rutasEvidencias);
enrutadorPrincipal.use("/reports", rutasReportes);

module.exports = enrutadorPrincipal;
