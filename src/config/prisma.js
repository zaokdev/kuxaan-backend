// Instancia unica del cliente Prisma reutilizada en todo el backend.
// Evita abrir multiples conexiones a la base de datos.
const { PrismaClient } = require("@prisma/client");

const clientePrisma = new PrismaClient();

module.exports = clientePrisma;
