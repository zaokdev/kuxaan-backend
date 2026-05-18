// Rutas del modulo de estudiantes. Solo el administrador las gestiona.
const express = require("express");
const estudiantesControlador = require("./estudiantes.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const ROLES = require("../../utils/roles");

const rutasEstudiantes = express.Router();

// Todas las rutas requieren usuario autenticado con rol administrador.
rutasEstudiantes.use(autenticarUsuario, autorizarRoles(ROLES.ADMINISTRADOR));

rutasEstudiantes.get("/", envolverAsync(estudiantesControlador.listarEstudiantes));

rutasEstudiantes.get("/:id", envolverAsync(estudiantesControlador.obtenerEstudiante));

rutasEstudiantes.post(
  "/",
  validarCamposRequeridos(["email", "contrasena", "nombreCompleto"]),
  envolverAsync(estudiantesControlador.crearEstudiante)
);

rutasEstudiantes.put("/:id", envolverAsync(estudiantesControlador.actualizarEstudiante));

rutasEstudiantes.delete("/:id", envolverAsync(estudiantesControlador.eliminarEstudiante));

module.exports = rutasEstudiantes;
