# Backend KUXAAN

Backend del **Sistema Digital de Gestión de Servicio Social y Proyectos Comunitarios KUXAAN**.

API REST construida con **Node.js + Express**, **Prisma ORM** sobre **MySQL** y autenticación **JWT** con control de acceso por roles (`ADMINISTRADOR`, `ESTUDIANTE`).

## Arquitectura

Arquitectura por capas (Controllers → Services → Repositories), tal como se definió en la fase de planeación:

```
src/
├── config/        Variables de entorno y cliente Prisma
├── utils/         Funciones reutilizables (respuestas, errores, jwt, hash, fechas...)
├── middlewares/   Autenticación, autorización, validación, errores, carga de archivos
├── modules/
│   ├── auth/         Inicio de sesión
│   ├── estudiantes/  Gestión de estudiantes (CRUD)
│   ├── proyectos/    Catálogo de proyectos (CRUD)
│   ├── asignaciones/ Vínculo estudiante-proyecto
│   ├── horas/        Registro de horas de servicio social
│   ├── evidencias/   Carga de archivos de evidencia
│   └── reportes/     Reportes administrativos
├── routes/        Enrutador principal
├── app.js         Configuración de Express
└── server.js      Punto de entrada
prisma/
├── schema.prisma  Esquema de las 6 tablas
└── seed.js        Usuario administrador inicial
```

Cada módulo separa la responsabilidad en `*.controller.js` (HTTP), `*.service.js` (lógica de negocio) y `*.repository.js` (acceso a datos). La carpeta `utils/` centraliza las funciones repetidas para evitar duplicación.

## Requisitos

- Node.js 18+
- MySQL en ejecución

## Instalación

```bash
npm install
cp .env.example .env   # configurar DATABASE_URL y JWT_SECRETO
npm run prisma:generate
npm run prisma:migrate  # crea las tablas en MySQL
npm run seed            # crea el administrador admin@kuxaan.com / Admin123
npm run dev
```

## Endpoints

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/auth/login` | Público |
| GET/POST/PUT/DELETE | `/api/students` | Administrador |
| GET | `/api/projects` | Autenticado |
| POST/PUT | `/api/projects` | Administrador |
| GET/POST/DELETE | `/api/assignments` | Administrador |
| GET/POST | `/api/hours` | Admin y Estudiante |
| PUT | `/api/hours/:id` | Administrador |
| GET/POST | `/api/evidence` | Admin y Estudiante |
| GET | `/api/reports/{students,projects,hours,evidence,general}` | Administrador |

Las evidencias se cargan como `multipart/form-data` (campo `archivo`) y se almacenan localmente; se aceptan PDF, JPG y PNG (máx. 10 MB).

> Nota: los reportes se entregan en formato JSON estructurado. La exportación a PDF/Excel puede añadirse sobre estos mismos datos sin cambiar la lógica.

## Respuesta estándar

```json
{ "exito": true, "mensaje": "Operacion exitosa", "datos": {} }
```
