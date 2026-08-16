// Rutas de reportes. Solo accesibles para el administrador.
const express = require("express");
const reportesController = require("./reportes.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const ROLES = require("../../utils/roles");

const reportesRouter = express.Router();

reportesRouter.use(autenticarUsuario, autorizarRoles(ROLES.ADMINISTRADOR));

reportesRouter.get("/students", envolverAsync(reportesController.reporteEstudiantes));
reportesRouter.get("/projects", envolverAsync(reportesController.reporteProyectos));
reportesRouter.get("/hours", envolverAsync(reportesController.reporteHoras));
reportesRouter.get("/evidence", envolverAsync(reportesController.reporteEvidencias));
reportesRouter.get("/general", envolverAsync(reportesController.reporteGeneral));

module.exports = reportesRouter;
