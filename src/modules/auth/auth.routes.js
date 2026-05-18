// Rutas del modulo de autenticacion.
const express = require("express");
const autenticacionControlador = require("./auth.controller");
const envolverAsync = require("../../utils/asyncHandler");
const validarCamposRequeridos = require("../../middlewares/validacion");

const rutasAutenticacion = express.Router();

// POST /api/auth/login
rutasAutenticacion.post(
  "/login",
  validarCamposRequeridos(["email", "contrasena"]),
  envolverAsync(autenticacionControlador.login)
);

module.exports = rutasAutenticacion;
