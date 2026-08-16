// Rutas del panel administrativo. Solo accesibles para el administrador.
const express = require("express");
const dashboardController = require("./dashboard.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const ROLES = require("../../utils/roles");

const dashboardRouter = express.Router();

dashboardRouter.use(autenticarUsuario, autorizarRoles(ROLES.ADMINISTRADOR));

// GET /api/dashboard/stats
dashboardRouter.get("/stats", envolverAsync(dashboardController.obtenerEstadisticas));

module.exports = dashboardRouter;
