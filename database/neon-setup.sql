-- Configuración completa de base de datos para Vercel + Neon
-- Schema corregido con todas las relaciones (FKs, CHECKs, UNIQUEs, CASCADE)
-- v2.0 - Corregido: matriculas.estado acepta cancelada, UNIQUEs faltantes, CHECKs hora, CASCADEs

BEGIN;

-- ============================================================
-- TABLAS BASE (sin dependencias)
-- ============================================================

CREATE TABLE IF NOT EXISTS sedes (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS carreras (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  facultad VARCHAR(255),
  campus VARCHAR(255),
  id_sede INTEGER REFERENCES sedes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS periodos_academicos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  activo BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS docentes (
  id SERIAL PRIMARY KEY,
  nombre_completo VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  departamento VARCHAR(255),
  email_institucional VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tipos_espacio (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  icono VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS categorias_objetos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  icono VARCHAR(50),
  descripcion TEXT
);

-- ============================================================
-- TABLAS CON DEPENDENCIAS
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'estudiante'
    CHECK (rol IN ('estudiante', 'docente', 'admin')),
  avatar_url TEXT,
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  codigo_estudiante VARCHAR(20),
  id_carrera INTEGER REFERENCES carreras(id) ON DELETE SET NULL,
  nivel_pao INTEGER CHECK (nivel_pao IS NULL OR nivel_pao BETWEEN 1 AND 7),
  id_docente INTEGER REFERENCES docentes(id) ON DELETE SET NULL,
  id_periodo_activo INTEGER REFERENCES periodos_academicos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS asignaturas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  creditos INTEGER CHECK (creditos > 0)
);

CREATE TABLE IF NOT EXISTS nrc (
  id SERIAL PRIMARY KEY,
  nrc VARCHAR(20) NOT NULL,
  id_asignatura INTEGER NOT NULL REFERENCES asignaturas(id) ON DELETE CASCADE,
  id_docente INTEGER REFERENCES docentes(id) ON DELETE SET NULL,
  id_periodo INTEGER NOT NULL REFERENCES periodos_academicos(id) ON DELETE CASCADE,
  id_carrera INTEGER REFERENCES carreras(id) ON DELETE SET NULL,
  nivel_pao VARCHAR(20) CHECK (nivel_pao IS NULL OR nivel_pao ~ '^PAO \d+$' OR nivel_pao = 'UIC'),
  paralelo VARCHAR(10),
  UNIQUE (nrc, id_periodo)
);

CREATE TABLE IF NOT EXISTS espacios_academicos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  id_tipo INTEGER NOT NULL REFERENCES tipos_espacio(id),
  capacidad INTEGER CHECK (capacidad > 0),
  edificio VARCHAR(255),
  piso VARCHAR(50),
  ubicacion_detalle TEXT,
  estado VARCHAR(50) DEFAULT 'disponible'
    CHECK (estado IN ('disponible', 'ocupado', 'mantenimiento', 'cerrado')),
  tiene_proyector BOOLEAN DEFAULT false,
  tiene_computadoras BOOLEAN DEFAULT false,
  tiene_aire_acondicionado BOOLEAN DEFAULT false,
  imagen_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horarios (
  id SERIAL PRIMARY KEY,
  id_nrc INTEGER NOT NULL REFERENCES nrc(id) ON DELETE CASCADE,
  id_espacio INTEGER NOT NULL REFERENCES espacios_academicos(id) ON DELETE CASCADE,
  dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 5),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL CHECK (hora_fin > hora_inicio),
  es_virtual BOOLEAN DEFAULT false,
  UNIQUE (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
);

CREATE TABLE IF NOT EXISTS disponibilidad_espacios (
  id SERIAL PRIMARY KEY,
  id_espacio INTEGER NOT NULL REFERENCES espacios_academicos(id) ON DELETE CASCADE,
  fecha DATE,
  dia_semana SMALLINT CHECK (dia_semana BETWEEN 1 AND 5),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL CHECK (hora_fin > hora_inicio),
  disponible BOOLEAN DEFAULT true,
  motivo VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS objetos_perdidos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  id_categoria INTEGER REFERENCES categorias_objetos(id),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('perdido', 'encontrado')),
  estado VARCHAR(50) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'resuelto', 'cerrado')),
  ubicacion VARCHAR(255),
  fecha_reporte DATE DEFAULT CURRENT_DATE,
  fecha_evento DATE,
  imagenes_url TEXT[],
  id_reportante UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  informacion_contacto VARCHAR(255),
  es_reclamado BOOLEAN DEFAULT false,
  id_reclamante UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  fecha_reclamo TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matriculas (
  id SERIAL PRIMARY KEY,
  id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  id_nrc INTEGER NOT NULL REFERENCES nrc(id) ON DELETE CASCADE,
  id_periodo INTEGER NOT NULL REFERENCES periodos_academicos(id) ON DELETE CASCADE,
  estado VARCHAR(20) NOT NULL DEFAULT 'activa'
    CHECK (estado IN ('activa', 'retirada', 'cancelada')),
  UNIQUE (id_usuario, id_nrc, id_periodo)
);

CREATE TABLE IF NOT EXISTS notificaciones (
  id BIGSERIAL PRIMARY KEY,
  id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  categoria VARCHAR(30) NOT NULL DEFAULT 'sistema',
  leido BOOLEAN NOT NULL DEFAULT false,
  referencia_tipo VARCHAR(30),
  referencia_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_referencia
  ON notificaciones (referencia_tipo, referencia_id);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservas_espacios (
  id BIGSERIAL PRIMARY KEY,
  id_espacio INTEGER NOT NULL REFERENCES espacios_academicos(id) ON DELETE CASCADE,
  id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL CHECK (hora_fin > hora_inicio),
  motivo VARCHAR(255),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'cancelada')),
  created_at TIMESTAMP DEFAULT NOW(),
  id_periodo INTEGER REFERENCES periodos_academicos(id) ON DELETE SET NULL,
  id_nrc INTEGER REFERENCES nrc(id) ON DELETE SET NULL,
  tipo_actividad VARCHAR(50),
  comentario_admin TEXT,
  aprobado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  fecha_revision TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_reserva_activa_exacta
  ON reservas_espacios(id_espacio, fecha, hora_inicio, hora_fin)
  WHERE estado IN ('pendiente', 'aprobada');

-- ============================================================
-- ÍNDICES ADICIONALES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas_espacios(id_usuario);
CREATE INDEX IF NOT EXISTS idx_push_usuario ON push_subscriptions(id_usuario);
CREATE INDEX IF NOT EXISTS idx_horarios_dia ON horarios(dia_semana);
CREATE INDEX IF NOT EXISTS idx_horarios_espacio ON horarios(id_espacio);
CREATE INDEX IF NOT EXISTS idx_matriculas_usuario ON matriculas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_matriculas_periodo ON matriculas(id_periodo);
CREATE INDEX IF NOT EXISTS idx_nrc_periodo ON nrc(id_periodo);
CREATE INDEX IF NOT EXISTS idx_nrc_asignatura ON nrc(id_asignatura);
CREATE INDEX IF NOT EXISTS idx_objetos_tipo ON objetos_perdidos(tipo);
CREATE INDEX IF NOT EXISTS idx_objetos_estado ON objetos_perdidos(estado);
CREATE INDEX IF NOT EXISTS idx_objetos_categoria ON objetos_perdidos(id_categoria);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones(leido);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(id_usuario);
CREATE INDEX IF NOT EXISTS idx_espacios_tipo ON espacios_academicos(id_tipo);
CREATE INDEX IF NOT EXISTS idx_espacios_estado ON espacios_academicos(estado);

-- ============================================================
-- VISTAS
-- ============================================================

CREATE OR REPLACE VIEW vista_horarios_completa AS
SELECT
  h.id,
  h.dia_semana,
  h.hora_inicio,
  h.hora_fin,
  h.es_virtual,
  n.id AS nrc_id,
  n.nrc,
  n.nivel_pao,
  n.paralelo,
  a.id AS asignatura_id,
  a.codigo AS codigo_asignatura,
  a.nombre AS asignatura,
  a.creditos,
  d.id AS docente_id,
  d.nombre_completo AS docente,
  d.email AS docente_email,
  e.id AS espacio_id,
  e.codigo AS codigo_espacio,
  e.nombre AS espacio_nombre,
  e.edificio,
  p.id AS periodo_id,
  p.codigo AS periodo,
  p.nombre AS periodo_nombre,
  c.id AS carrera_id,
  c.codigo AS carrera_codigo,
  c.nombre AS carrera,
  s.nombre AS sede_nombre
FROM horarios h
JOIN nrc n ON n.id = h.id_nrc
JOIN asignaturas a ON a.id = n.id_asignatura
LEFT JOIN docentes d ON d.id = n.id_docente
LEFT JOIN espacios_academicos e ON e.id = h.id_espacio
LEFT JOIN periodos_academicos p ON p.id = n.id_periodo
LEFT JOIN carreras c ON c.id = n.id_carrera
LEFT JOIN sedes s ON s.id = c.id_sede;

CREATE OR REPLACE VIEW vista_disponibilidad AS
SELECT
  e.id AS espacio_id,
  e.codigo AS codigo_espacio,
  e.nombre AS espacio_nombre,
  h.dia_semana,
  h.hora_inicio,
  h.hora_fin,
  'clase' AS tipo_bloqueo,
  a.nombre AS descripcion,
  n.nrc
FROM horarios h
JOIN nrc n ON n.id = h.id_nrc
JOIN asignaturas a ON a.id = n.id_asignatura
JOIN espacios_academicos e ON e.id = h.id_espacio
UNION ALL
SELECT
  de.id_espacio,
  e.codigo,
  e.nombre,
  de.dia_semana,
  de.hora_inicio,
  de.hora_fin,
  'bloqueo_manual' AS tipo_bloqueo,
  COALESCE(de.motivo, 'Bloqueado por administración') AS descripcion,
  NULL AS nrc
FROM disponibilidad_espacios de
JOIN espacios_academicos e ON e.id = de.id_espacio
WHERE de.disponible = false;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT INTO categorias_objetos (nombre, icono, descripcion) VALUES
  ('Electrónica', '💻', 'Dispositivos electrónicos, laptops, tablets, celulares'),
  ('Documentos', '📄', 'Cédulas, carnets, certificados, documentos personales'),
  ('Mochilas y Bolsos', '🎒', 'Mochilas, maletines, carteras y bolsos'),
  ('Accesorios', '⌚', 'Relojes, gafas, joyería y accesorios personales'),
  ('Útiles Académicos', '📚', 'Libros, cuadernos, carpetas y materiales de estudio'),
  ('Ropa', '👕', 'Prendas de vestir, chaquetas, uniformes'),
  ('Billeteras', '👛', 'Billeteras, monederos y porta documentos'),
  ('Otros', '📦', 'Otros objetos no categorizados')
ON CONFLICT (nombre) DO NOTHING;

COMMIT;