// Datos iniciales del sistema: administrador y un conjunto de demostracion
// (proyectos, estudiantes, asignaciones y horas) para que la plataforma no
// se vea vacia en la primera ejecucion.
// Ejecutar con: npm run seed
// Es idempotente: si un registro ya existe, no se vuelve a crear.
const clientePrisma = require("../src/config/prisma");
const { encriptarContrasena } = require("../src/utils/contrasenas");

const ADMINISTRADOR = { email: "admin@kuxaan.com", contrasena: "Admin123" };

const PROYECTOS = [
  {
    nombreProyecto: "Milpa Maya Sostenible",
    objetivo:
      "Acompanar a las familias productoras en la recuperacion de tecnicas de milpa tradicional y el manejo de semillas nativas.",
    comunidadBeneficiada: "Yaxcaba, Yucatan",
    responsable: "Ing. Rosa Canul",
    fechaInicio: new Date("2026-01-15"),
    fechaTermino: new Date("2026-06-30"),
    estado: "ACTIVO",
  },
  {
    nombreProyecto: "Agua Limpia Comunitaria",
    objetivo:
      "Instalar y dar mantenimiento a filtros de agua potable en escuelas y centros comunitarios de la region.",
    comunidadBeneficiada: "Tixcacalcupul, Yucatan",
    responsable: "Biol. Manuel Chan",
    fechaInicio: new Date("2026-02-01"),
    fechaTermino: new Date("2026-07-31"),
    estado: "ACTIVO",
  },
  {
    nombreProyecto: "Alfabetizacion Digital",
    objetivo:
      "Impartir talleres basicos de computo e internet seguro para personas adultas de la comunidad.",
    comunidadBeneficiada: "Merida, Yucatan",
    responsable: "Lic. Ana Pech",
    fechaInicio: new Date("2026-01-20"),
    fechaTermino: new Date("2026-06-15"),
    estado: "ACTIVO",
  },
];

const ESTUDIANTES = [
  {
    email: "maria.couoh@kuxaan.com",
    contrasena: "Estudiante123!",
    nombreCompleto: "Maria Couoh Balam",
    carrera: "Ingenieria Ambiental",
    universidad: "Universidad Autonoma de Yucatan",
    periodoAcademico: "Ene-Jun 2026",
    telefono: "9991234567",
    horasRequeridas: 240,
    proyecto: "Milpa Maya Sostenible",
    horas: [
      { cantidadHoras: 6, descripcion: "Diagnostico de parcelas con familias productoras", dias: 30 },
      { cantidadHoras: 5, descripcion: "Taller de seleccion de semilla nativa", dias: 21 },
      { cantidadHoras: 4, descripcion: "Registro fotografico y bitacora de campo", dias: 12 },
    ],
  },
  {
    email: "carlos.uc@kuxaan.com",
    contrasena: "Estudiante123!",
    nombreCompleto: "Carlos Uc Dzib",
    carrera: "Ingenieria Civil",
    universidad: "Instituto Tecnologico de Merida",
    periodoAcademico: "Ene-Jun 2026",
    telefono: "9997654321",
    horasRequeridas: 240,
    proyecto: "Agua Limpia Comunitaria",
    horas: [
      { cantidadHoras: 8, descripcion: "Instalacion de filtros en la escuela primaria", dias: 25 },
      { cantidadHoras: 6, descripcion: "Capacitacion de mantenimiento a comite de agua", dias: 10 },
    ],
  },
  {
    email: "ana.balam@kuxaan.com",
    contrasena: "Estudiante123!",
    nombreCompleto: "Ana Balam Kauil",
    carrera: "Licenciatura en Educacion",
    universidad: "Universidad Autonoma de Yucatan",
    periodoAcademico: "Ene-Jun 2026",
    telefono: "9993216549",
    horasRequeridas: 180,
    proyecto: "Alfabetizacion Digital",
    horas: [
      { cantidadHoras: 4, descripcion: "Taller introductorio de uso de computadora", dias: 18 },
      { cantidadHoras: 4, descripcion: "Sesion de correo electronico e internet seguro", dias: 11 },
      { cantidadHoras: 3, descripcion: "Asesoria individual a personas adultas mayores", dias: 4 },
    ],
  },
  {
    email: "luis.pat@kuxaan.com",
    contrasena: "Estudiante123!",
    nombreCompleto: "Luis Pat Moo",
    carrera: "Ingenieria en Sistemas",
    universidad: "Instituto Tecnologico de Merida",
    periodoAcademico: "Ene-Jun 2026",
    telefono: "9990001122",
    horasRequeridas: 240,
    proyecto: "Alfabetizacion Digital",
    horas: [
      { cantidadHoras: 5, descripcion: "Preparacion de material didactico digital", dias: 15 },
    ],
  },
];

// Fecha de hace N dias, para que las horas tengan historial reciente.
function hace(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
}

async function crearAdministrador() {
  const existente = await clientePrisma.usuario.findUnique({
    where: { email: ADMINISTRADOR.email },
  });

  if (existente) {
    console.log(`- Administrador ${ADMINISTRADOR.email} ya existe`);
    return;
  }

  await clientePrisma.usuario.create({
    data: {
      email: ADMINISTRADOR.email,
      password: await encriptarContrasena(ADMINISTRADOR.contrasena),
      rol: "ADMINISTRADOR",
    },
  });

  console.log(`+ Administrador creado: ${ADMINISTRADOR.email} / ${ADMINISTRADOR.contrasena}`);
}

async function crearProyectos() {
  const proyectosPorNombre = new Map();

  for (const datosProyecto of PROYECTOS) {
    let proyecto = await clientePrisma.proyecto.findFirst({
      where: { nombreProyecto: datosProyecto.nombreProyecto },
    });

    if (proyecto) {
      console.log(`- Proyecto "${datosProyecto.nombreProyecto}" ya existe`);
    } else {
      proyecto = await clientePrisma.proyecto.create({ data: datosProyecto });
      console.log(`+ Proyecto creado: ${datosProyecto.nombreProyecto}`);
    }

    proyectosPorNombre.set(proyecto.nombreProyecto, proyecto);
  }

  return proyectosPorNombre;
}

async function crearEstudiantes(proyectosPorNombre) {
  for (const datosEstudiante of ESTUDIANTES) {
    const existente = await clientePrisma.usuario.findUnique({
      where: { email: datosEstudiante.email },
      include: { alumno: true },
    });

    if (existente) {
      console.log(`- Estudiante ${datosEstudiante.email} ya existe`);
      continue;
    }

    const usuario = await clientePrisma.usuario.create({
      data: {
        email: datosEstudiante.email,
        password: await encriptarContrasena(datosEstudiante.contrasena),
        rol: "ESTUDIANTE",
        alumno: {
          create: {
            nombreCompleto: datosEstudiante.nombreCompleto,
            carrera: datosEstudiante.carrera,
            universidad: datosEstudiante.universidad,
            periodoAcademico: datosEstudiante.periodoAcademico,
            telefono: datosEstudiante.telefono,
            estado: "ACTIVO",
            horasRequeridas: datosEstudiante.horasRequeridas,
          },
        },
      },
      include: { alumno: true },
    });

    const proyecto = proyectosPorNombre.get(datosEstudiante.proyecto);

    await clientePrisma.asignacion.create({
      data: { idAlumno: usuario.alumno.idAlumno, idProyecto: proyecto.idProyecto },
    });

    for (const registro of datosEstudiante.horas) {
      await clientePrisma.registroHoras.create({
        data: {
          idAlumno: usuario.alumno.idAlumno,
          idProyecto: proyecto.idProyecto,
          cantidadHoras: registro.cantidadHoras,
          descripcion: registro.descripcion,
          fechaRegistro: hace(registro.dias),
        },
      });
    }

    console.log(
      `+ Estudiante creado: ${datosEstudiante.email} / ${datosEstudiante.contrasena} ` +
        `(${datosEstudiante.proyecto}, ${datosEstudiante.horas.length} registros de horas)`
    );
  }
}

async function ejecutarSeed() {
  console.log("Sembrando datos de KUXAAN...\n");

  await crearAdministrador();
  const proyectosPorNombre = await crearProyectos();
  await crearEstudiantes(proyectosPorNombre);

  console.log("\nListo. Entra con el administrador para explorar el sistema.");
}

ejecutarSeed()
  .catch((error) => {
    console.error("Error al ejecutar el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await clientePrisma.$disconnect();
  });
