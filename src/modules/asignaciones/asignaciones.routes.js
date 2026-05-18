// Rutas del modulo de asignaciones. Solo el administrador las gestiona.
const express = require("express");
const asignacionesControlador = require("./asignaciones.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const ROLES = require("../../utils/roles");

const rutasAsignaciones = express.Router();

rutasAsignaciones.use(autenticarUsuario, autorizarRoles(ROLES.ADMINISTRADOR));

rutasAsignaciones.get("/", envolverAsync(asignacionesControlador.listarAsignaciones));

rutasAsignaciones.post(
  "/",
  validarCamposRequeridos(["idAlumno", "idProyecto"]),
  envolverAsync(asignacionesControlador.crearAsignacion)
);

rutasAsignaciones.delete("/:id", envolverAsync(asignacionesControlador.eliminarAsignacion));

module.exports = rutasAsignaciones;
