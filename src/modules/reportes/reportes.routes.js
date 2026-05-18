// Rutas de reportes. Solo accesibles para el administrador.
const express = require("express");
const reportesControlador = require("./reportes.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const ROLES = require("../../utils/roles");

const rutasReportes = express.Router();

rutasReportes.use(autenticarUsuario, autorizarRoles(ROLES.ADMINISTRADOR));

rutasReportes.get("/students", envolverAsync(reportesControlador.reporteEstudiantes));
rutasReportes.get("/projects", envolverAsync(reportesControlador.reporteProyectos));
rutasReportes.get("/hours", envolverAsync(reportesControlador.reporteHoras));
rutasReportes.get("/evidence", envolverAsync(reportesControlador.reporteEvidencias));
rutasReportes.get("/general", envolverAsync(reportesControlador.reporteGeneral));

module.exports = rutasReportes;
