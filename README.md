# ESPEConnect

Plataforma universitaria para la comunidad de la **Universidad de las Fuerzas Armadas ESPE - Sede Santo Domingo**.
Conecta a los estudiantes con los servicios del campus: **espacios académicos**, **horarios** y **objetos perdidos**.

---

## Requisitos

| Herramienta | Versión |
|-------------|---------|
| Node.js | 22+ |
| PostgreSQL | 18 |
| npm | 10+ |

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd Proyecto
```

### 2. Configurar la base de datos

Asegúrate de que PostgreSQL 18 esté corriendo y ejecuta los siguientes scripts **en orden**:

```powershell
# En Windows (PowerShell):
$env:PGPASSWORD = "admin"

# 2a. Crear la base de datos
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE espe_connect;"

# 2b. Ejecutar el schema (tablas)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d espe_connect -f database/schema.sql

# 2c. Poblar los horarios (asignaturas, docentes, nrc, horarios)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d espe_connect -f database/seed_horarios.sql
```

> **Nota**: Si tu PostgreSQL tiene otra contraseña, edita `server/.env` y cambia `DB_PASSWORD`.

### 3. Instalar dependencias

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 4. Iniciar el backend

```bash
cd server
npm run dev
```

El backend se ejecutará en `http://localhost:3000`.

### 5. Iniciar el frontend

Abre otra terminal:

```bash
cd Proyecto
npm run dev
```

El frontend se ejecutará en `http://localhost:5173`.

### 6. Registrar un usuario de prueba

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Tu Nombre","correo":"test@espe.edu.ec","password":"123456"}'
```

O usa el login con las credenciales ya registradas:

| Campo | Valor |
|-------|-------|
| Correo | `test@espe.edu.ec` |
| Contraseña | `123456` |

---

## Funcionalidades incluidas

### Dashboard
Estadísticas generales: total de espacios, objetos reportados, horarios activos.

### Espacios Académicos
Visualización de aulas y laboratorios con filtros por tipo, estado y capacidad.
Cada espacio muestra su disponibilidad y equipamiento (proyector, computadoras).

### Horarios
Tabla semanal interactiva (lunes a viernes, 07:00–18:00) con los horarios oficiales
de la carrera de **Tecnología de la Información** — período **202650 (MAR 2026 – AGO 2026)**.

Incluye 8 PAO (Periodos Académicos Ordinarios) más la Unidad de Integración Curricular,
con búsqueda en vivo por asignatura, docente o espacio.

### Objetos Perdidos
CRUD completo para reportar objetos perdidos/encontrados, con búsqueda,
filtro por categoría, y funcionalidad de reclamo.

### Administración de Espacios (solo admin)
CRUD completo de espacios académicos: crear, editar, cambiar estado.

---

## Cálculo de notas (propuesta)

> Esta sección describe el sistema de cálculo de notas **a implementar** para que los estudiantes
> puedan llevar el registro de sus calificaciones por materia y por semestre.

### Esquema de base de datos propuesto

```sql
-- Materias inscritas por semestre
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    id_usuario UUID NOT NULL REFERENCES usuarios(id),
    id_nrc INTEGER NOT NULL REFERENCES nrc(id),
    id_periodo INTEGER NOT NULL REFERENCES periodos_academicos(id),
    estado VARCHAR(20) DEFAULT 'cursando' CHECK (estado IN ('cursando','aprobado','reprobado','retirado')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Componentes de nota por materia (ej: 3 parciales, deberes, examen final)
CREATE TABLE componentes_evaluacion (
    id SERIAL PRIMARY KEY,
    id_inscripcion INTEGER NOT NULL REFERENCES inscripciones(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,        -- ej: 'Parcial 1', 'Deberes', 'Examen Final'
    porcentaje DECIMAL(5,2) NOT NULL,    -- ej: 30.00 (30%)
    nota DECIMAL(4,2),                   -- nota obtenida (0.00 - 20.00)
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Cálculo de nota final

```
Nota Final = Σ (componente.nota × componente.porcentaje / 100)

Ejemplo:
  Parcial 1:  15.0 × 30% = 4.50
  Parcial 2:  18.0 × 30% = 5.40
  Deberes:    20.0 × 10% = 2.00
  Examen:     14.0 × 30% = 4.20
  ──────────────────────────
  Nota Final:            = 16.10
```

### Escala de calificación (ESPE)

| Nota | Estado |
|------|--------|
| 0.00 – 13.99 | Reprobado |
| 14.00 – 20.00 | Aprobado |
| 20.00 | Excelente |

Para aprobar una materia se necesita **nota final ≥ 14.00**.

### Promedio del semestre

```
Promedio Semestre = Σ (Nota Final de cada materia) / N° de materias
```

### Vista sugerida para consultar notas por periodo

```sql
CREATE VIEW vista_notas_periodo AS
SELECT
    u.id AS id_usuario,
    u.nombre_completo,
    p.codigo AS periodo,
    a.nombre AS asignatura,
    a.creditos,
    i.estado AS estado_inscripcion,
    ROUND(
        SUM(ce.nota * ce.porcentaje) / 100.0, 2
    ) AS nota_final,
    CASE
        WHEN SUM(ce.nota * ce.porcentaje) / 100.0 >= 14 THEN 'Aprobado'
        ELSE 'Reprobado'
    END AS resultado
FROM usuarios u
JOIN inscripciones i ON u.id = i.id_usuario
JOIN nrc n ON i.id_nrc = n.id
JOIN asignaturas a ON n.id_asignatura = a.id
JOIN periodos_academicos p ON i.id_periodo = p.id
LEFT JOIN componentes_evaluacion ce ON i.id = ce.id_inscripcion
GROUP BY u.id, u.nombre_completo, p.codigo, a.nombre, a.creditos, i.estado;
```

---

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `estudiante` | Dashboard, Espacios, Horarios, Objetos Perdidos |
| `admin` | Todo lo anterior + Administrar Espacios, moderar objetos |

Usuario admin pre-registrado:

| Campo | Valor |
|-------|-------|
| Correo | `test@espe.edu.ec` |
| Contraseña | `123456` |
| Rol | `admin` |

---

## Estructura del proyecto

```
Proyecto/
├── src/                    # Frontend (React 19 + Vite + PWA)
│   ├── pages/              # Login, Dashboard, Espacios, Objetos, Horarios, Admin
│   ├── components/         # Header, Footer, Sidebar, Layout
│   ├── services/           # auth, espacios, horarios, objetos
│   ├── store/              # Zustand (auth, ui)
│   ├── routes/             # PrivateRoutes
│   └── api/axios.js        # Cliente HTTP
│
├── server/                 # Backend (Express + JWT + PostgreSQL)
│   ├── routes/             # auth, usuarios, espacios, horarios, objetos
│   ├── middlewares/        # authentication, authorization
│   ├── database/conexion.js
│   └── config/jwt.js
│
├── database/
│   ├── schema.sql          # Creación de tablas
│   └── seed_horarios.sql   # Poblado de horarios, NRC, asignaturas, docentes
│
└── docker-compose.yml      # Opcional: levantar todo con Docker
```

---

## Tecnologías

| Frontend | Backend |
|----------|---------|
| React 19 | Express 5 |
| Vite 8 | JWT (jsonwebtoken) |
| React Router 7 | bcrypt |
| TanStack Query 5 | PostgreSQL (pg) |
| Zustand 5 | CORS |
| HeroUI | Dotenv |
| Axios | Nodemon |
| PWA (vite-plugin-pwa) | |

---

## Ejecutar con Docker (opcional)

```bash
docker compose up --build
```

Esto levanta PostgreSQL, backend y frontend automáticamente.
