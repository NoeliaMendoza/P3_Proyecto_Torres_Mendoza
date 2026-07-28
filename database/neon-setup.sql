-- Configuración completa de base de datos para Vercel + Neon
-- Corre esto en la consola SQL de Neon después de crear la base de datos

BEGIN;

CREATE TABLE IF NOT EXISTS carreras (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  modalidad VARCHAR(50) DEFAULT 'presencial',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS periodos_academicos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias_objetos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  icono VARCHAR(10),
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'estudiante' CHECK (rol IN ('estudiante','docente','admin')),
  avatar_url TEXT,
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  codigo_estudiante VARCHAR(20),
  id_carrera INTEGER REFERENCES carreras(id),
  nivel_pao INTEGER,
  id_docente INTEGER,
  id_periodo_activo INTEGER REFERENCES periodos_academicos(id)
);

CREATE TABLE IF NOT EXISTS espacios_academicos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  capacidad INTEGER NOT NULL,
  edificio VARCHAR(100),
  piso VARCHAR(20),
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible','ocupado','mantenimiento')),
  equipamiento TEXT[],
  horario_atencion VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

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

INSERT INTO categorias_objetos (nombre, icono, descripcion) VALUES
  ('Electrónica', '💻', 'Dispositivos electrónicos, laptops, tablets, celulares'),
  ('Documentos', '📄', 'Cédulas, carnets, certificados, documentos personales'),
  ('Mochilas y Bolsos', '🎒', 'Mochilas, maletines, carteras y bolsos'),
  ('Accesorios', '⌚', 'Relojes, gafas, joyería y accesorios personales'),
  ('Útiles Académicos', '📚', 'Libros, cuadernos, carpetas y materiales de estudio'),
  ('Ropa', '👕', 'Prendas de vestir, chaquetas, uniformes'),
  ('Billeteras', '👛', 'Billeteras, monederos y porta documentos'),
  ('Otros', '📦', 'Otros objetos no categorizados')
ON CONFLICT DO NOTHING;

COMMIT;