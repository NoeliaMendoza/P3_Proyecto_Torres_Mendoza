-- ESPEConnect - Esquema de Base de Datos (PostgreSQL 16+)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'estudiante' CHECK (rol IN ('estudiante','admin')),
    avatar_url TEXT,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. PERIODOS ACADÉMICOS
CREATE TABLE IF NOT EXISTS periodos_academicos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT false
);

-- 3. CARRERAS
CREATE TABLE IF NOT EXISTS carreras (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    facultad VARCHAR(255),
    campus VARCHAR(255)
);

-- 4. DOCENTES
CREATE TABLE IF NOT EXISTS docentes (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    departamento VARCHAR(255)
);

-- 5. ASIGNATURAS
CREATE TABLE IF NOT EXISTS asignaturas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    creditos INTEGER CHECK (creditos > 0)
);

-- 6. NRC (SECCIONES)
CREATE TABLE IF NOT EXISTS nrc (
    id SERIAL PRIMARY KEY,
    nrc VARCHAR(20) NOT NULL,
    id_asignatura INTEGER NOT NULL REFERENCES asignaturas(id),
    id_docente INTEGER REFERENCES docentes(id),
    id_periodo INTEGER NOT NULL REFERENCES periodos_academicos(id),
    id_carrera INTEGER REFERENCES carreras(id),
    nivel_pao VARCHAR(20),
    paralelo VARCHAR(10),
    UNIQUE(nrc, id_periodo)
);

-- 7. TIPOS DE ESPACIO
CREATE TABLE IF NOT EXISTS tipos_espacio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50)
);

-- 8. ESPACIOS ACADÉMICOS
CREATE TABLE IF NOT EXISTS espacios_academicos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    id_tipo INTEGER NOT NULL REFERENCES tipos_espacio(id),
    capacidad INTEGER CHECK (capacidad > 0),
    edificio VARCHAR(255),
    piso VARCHAR(50),
    ubicacion_detalle TEXT,
    estado VARCHAR(50) DEFAULT 'disponible' CHECK (estado IN ('disponible','ocupado','mantenimiento','cerrado')),
    tiene_proyector BOOLEAN DEFAULT false,
    tiene_computadoras BOOLEAN DEFAULT false,
    tiene_aire_acondicionado BOOLEAN DEFAULT false,
    imagen_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. HORARIOS
CREATE TABLE IF NOT EXISTS horarios (
    id SERIAL PRIMARY KEY,
    id_nrc INTEGER NOT NULL REFERENCES nrc(id) ON DELETE CASCADE,
    id_espacio INTEGER NOT NULL REFERENCES espacios_academicos(id),
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 5),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    es_virtual BOOLEAN DEFAULT false,
    UNIQUE(id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
);

-- 10. DISPONIBILIDAD MANUAL
CREATE TABLE IF NOT EXISTS disponibilidad_espacios (
    id SERIAL PRIMARY KEY,
    id_espacio INTEGER NOT NULL REFERENCES espacios_academicos(id) ON DELETE CASCADE,
    fecha DATE,
    dia_semana SMALLINT CHECK (dia_semana BETWEEN 1 AND 5),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible BOOLEAN DEFAULT true,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 11. CATEGORÍAS DE OBJETOS
CREATE TABLE IF NOT EXISTS categorias_objetos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    icono VARCHAR(50),
    descripcion TEXT
);

-- 12. OBJETOS PERDIDOS/ENCONTRADOS
CREATE TABLE IF NOT EXISTS objetos_perdidos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    id_categoria INTEGER REFERENCES categorias_objetos(id),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('perdido','encontrado')),
    estado VARCHAR(50) DEFAULT 'abierto' CHECK (estado IN ('abierto','resuelto','cerrado')),
    ubicacion VARCHAR(255),
    fecha_reporte DATE DEFAULT CURRENT_DATE,
    fecha_evento DATE,
    imagenes_url TEXT[],
    id_reportante UUID REFERENCES usuarios(id),
    informacion_contacto VARCHAR(255),
    es_reclamado BOOLEAN DEFAULT false,
    id_reclamante UUID REFERENCES usuarios(id),
    fecha_reclamo TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_nrc_periodo ON nrc(id_periodo);
CREATE INDEX IF NOT EXISTS idx_nrc_asignatura ON nrc(id_asignatura);
CREATE INDEX IF NOT EXISTS idx_horarios_espacio ON horarios(id_espacio);
CREATE INDEX IF NOT EXISTS idx_horarios_dia ON horarios(dia_semana);
CREATE INDEX IF NOT EXISTS idx_objetos_tipo ON objetos_perdidos(tipo);
CREATE INDEX IF NOT EXISTS idx_objetos_estado ON objetos_perdidos(estado);
CREATE INDEX IF NOT EXISTS idx_objetos_categoria ON objetos_perdidos(id_categoria);
CREATE INDEX IF NOT EXISTS idx_espacios_tipo ON espacios_academicos(id_tipo);
CREATE INDEX IF NOT EXISTS idx_espacios_estado ON espacios_academicos(estado);

-- VISTA: Disponibilidad en tiempo real
CREATE OR REPLACE VIEW vista_disponibilidad AS
SELECT e.id, e.codigo, e.nombre AS nombre_espacio, te.nombre AS tipo_espacio,
       e.capacidad, e.edificio, e.piso, e.estado,
       CASE WHEN h.id IS NOT NULL THEN 'ocupado' ELSE 'disponible' END AS estado_actual,
       h.dia_semana, h.hora_inicio, h.hora_fin, a.nombre AS asignatura, d.nombre_completo AS docente
FROM espacios_academicos e
LEFT JOIN tipos_espacio te ON e.id_tipo = te.id
LEFT JOIN horarios h ON e.id = h.id_espacio AND h.dia_semana = EXTRACT(DOW FROM CURRENT_DATE)
    AND CURRENT_TIME BETWEEN h.hora_inicio AND h.hora_fin
LEFT JOIN nrc n ON h.id_nrc = n.id
LEFT JOIN asignaturas a ON n.id_asignatura = a.id
LEFT JOIN docentes d ON n.id_docente = d.id;

-- VISTA: Horarios completa
CREATE OR REPLACE VIEW vista_horarios_completa AS
SELECT h.id, n.nrc, a.codigo AS codigo_asignatura, a.nombre AS asignatura, a.creditos,
       d.nombre_completo AS docente, e.codigo AS codigo_espacio, e.nombre AS nombre_espacio,
       te.nombre AS tipo_espacio, h.dia_semana,
       CASE h.dia_semana WHEN 1 THEN 'Lunes' WHEN 2 THEN 'Martes' WHEN 3 THEN 'Miércoles'
                         WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' END AS dia,
       h.hora_inicio, h.hora_fin, n.nivel_pao, n.paralelo, p.codigo AS periodo,
       p.id AS periodo_id, e.id AS espacio_id, c.nombre AS carrera
FROM horarios h
JOIN nrc n ON h.id_nrc = n.id
JOIN asignaturas a ON n.id_asignatura = a.id
LEFT JOIN docentes d ON n.id_docente = d.id
JOIN espacios_academicos e ON h.id_espacio = e.id
JOIN tipos_espacio te ON e.id_tipo = te.id
JOIN periodos_academicos p ON n.id_periodo = p.id
LEFT JOIN carreras c ON n.id_carrera = c.id;
