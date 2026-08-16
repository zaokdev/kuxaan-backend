// Rutas del modulo de autenticacion.
const express = require("express");
const autenticacionController = require("./auth.controller");
const envolverAsync = require("../../utils/asyncHandler");
const validarCamposRequeridos = require("../../middlewares/validacion");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const ROLES = require("../../utils/roles");

const authRouter = express.Router();

// POST /api/auth/login
authRouter.post(
  "/login",
  validarCamposRequeridos(["email", "contrasena"]),
  envolverAsync(autenticacionController.login)
);

// POST /api/auth/register — solo administradores
authRouter.post(
  "/register",
  autenticarUsuario,
  autorizarRoles(ROLES.ADMINISTRADOR),
  validarCamposRequeridos(["email", "contrasena"]),
  envolverAsync(autenticacionController.registrar)
);

// PUT /api/auth/password — cualquier usuario autenticado cambia la suya
authRouter.put(
  "/password",
  autenticarUsuario,
  validarCamposRequeridos(["contrasenaActual", "contrasenaNueva"]),
  envolverAsync(autenticacionController.cambiarContrasena)
);

module.exports = authRouter;
