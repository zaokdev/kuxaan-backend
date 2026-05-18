// Configuracion de multer para la carga local de archivos de evidencia.
// Acepta solo PDF, JPG y PNG con un tamano maximo de 10 MB.
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const configuracion = require("../config/entorno");
const ErrorAplicacion = require("../utils/errores");

const carpetaDestino = configuracion.carpetaEvidencias;

// Crea la carpeta de destino si aun no existe.
fs.mkdirSync(carpetaDestino, { recursive: true });

const FORMATOS_PERMITIDOS = ["application/pdf", "image/jpeg", "image/png"];
const TAMANO_MAXIMO_BYTES = 10 * 1024 * 1024;

const almacenamiento = multer.diskStorage({
  destination: (peticion, archivo, devolverDestino) => {
    devolverDestino(null, carpetaDestino);
  },
  filename: (peticion, archivo, devolverNombre) => {
    const extension = path.extname(archivo.originalname);
    const nombreUnico = `evidencia-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    devolverNombre(null, nombreUnico);
  },
});

function filtrarFormato(peticion, archivo, devolverResultado) {
  if (FORMATOS_PERMITIDOS.includes(archivo.mimetype)) {
    return devolverResultado(null, true);
  }
  return devolverResultado(
    new ErrorAplicacion("Formato no permitido. Solo se aceptan PDF, JPG o PNG", 400)
  );
}

const cargarEvidencia = multer({
  storage: almacenamiento,
  fileFilter: filtrarFormato,
  limits: { fileSize: TAMANO_MAXIMO_BYTES },
}).single("archivo");

module.exports = cargarEvidencia;
