// Rutas del modulo de evidencias.
// Consulta y carga: admin y estudiante autenticados.
const express = require("express");
const evidenciasControlador = require("./evidencias.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const cargarEvidencia = require("../../middlewares/cargaArchivos");

const rutasEvidencias = express.Router();

rutasEvidencias.use(autenticarUsuario);

rutasEvidencias.get("/", envolverAsync(evidenciasControlador.listarEvidencias));

rutasEvidencias.get("/:id", envolverAsync(evidenciasControlador.obtenerEvidencia));

rutasEvidencias.post(
  "/",
  cargarEvidencia,
  validarCamposRequeridos(["idProyecto"]),
  envolverAsync(evidenciasControlador.crearEvidencia)
);

module.exports = rutasEvidencias;
