// Encriptado y comparacion de contrasenas con bcrypt.
const bcrypt = require("bcryptjs");

const RONDAS_SAL = 10;

async function encriptarContrasena(contrasenaPlana) {
  return bcrypt.hash(contrasenaPlana, RONDAS_SAL);
}

async function compararContrasena(contrasenaPlana, contrasenaEncriptada) {
  return bcrypt.compare(contrasenaPlana, contrasenaEncriptada);
}

module.exports = { encriptarContrasena, compararContrasena };
