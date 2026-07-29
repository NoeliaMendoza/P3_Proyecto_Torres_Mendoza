-- ESPEConnect - Migración de Relaciones y Constraints
-- Corrige FKs faltantes, CHECKs, UNIQUEs y normaliza tipos
-- Aplica sobre BD existente SIN perder datos

BEGIN;

-- ============================================================
-- 1. CORREGIR CHECK CONSTRAINTS
-- ============================================================

-- 1a. matriculas.estado: agregar 'cancelada'
ALTER TABLE matriculas DROP CONSTRAINT IF EXISTS matriculas_estado_check;
ALTER TABLE matriculas ADD CONSTRAINT matriculas_estado_check
  CHECK (estado IN ('activa', 'retirada', 'cancelada'));

-- 1b. horarios: hora_fin > hora_inicio
ALTER TABLE horarios DROP CONSTRAINT IF EXISTS horarios_hora_check;
ALTER TABLE horarios ADD CONSTRAINT horarios_hora_check
  CHECK (hora_fin > hora_inicio);

-- 1c. disponibilidad_espacios: hora_fin > hora_inicio
ALTER TABLE disponibilidad_espacios DROP CONSTRAINT IF EXISTS disp_espacios_hora_check;
ALTER TABLE disponibilidad_espacios ADD CONSTRAINT disp_espacios_hora_check
  CHECK (hora_fin > hora_inicio);

-- 1d. reservas_espacios: hora_fin > hora_inicio
ALTER TABLE reservas_espacios DROP CONSTRAINT IF EXISTS reservas_hora_check;
ALTER TABLE reservas_espacios ADD CONSTRAINT reservas_hora_check
  CHECK (hora_fin > hora_inicio);

-- 1e. nrc.nivel_pao: normalizar CHECK si se deja como VARCHAR
ALTER TABLE nrc DROP CONSTRAINT IF EXISTS nrc_nivel_pao_check;
ALTER TABLE nrc ADD CONSTRAINT nrc_nivel_pao_check
  CHECK (nivel_pao IS NULL OR nivel_pao ~ '^PAO \d+$' OR nivel_pao = 'UIC');

-- ============================================================
-- 2. AGREGAR UNIQUE CONSTRAINTS FALTANTES
-- ============================================================

-- 2a. nrc: evitar duplicados de NRC en mismo periodo
ALTER TABLE nrc DROP CONSTRAINT IF EXISTS nrc_nrc_id_periodo_key;
ALTER TABLE nrc ADD CONSTRAINT nrc_nrc_id_periodo_key
  UNIQUE (nrc, id_periodo);

-- 2b. horarios: evitar horarios duplicados para un mismo NRC
ALTER TABLE horarios DROP CONSTRAINT IF EXISTS horarios_unique;
ALTER TABLE horarios ADD CONSTRAINT horarios_unique
  UNIQUE (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin);

-- 2c. categorias_objetos: unique en nombre (necesario para ON CONFLICT)
ALTER TABLE categorias_objetos DROP CONSTRAINT IF EXISTS categorias_objetos_nombre_key;
ALTER TABLE categorias_objetos ADD CONSTRAINT categorias_objetos_nombre_key
  UNIQUE (nombre);

-- ============================================================
-- 3. NOT NULL PARA PERIODOS ACADEMICOS
-- ============================================================

ALTER TABLE periodos_academicos ALTER COLUMN fecha_inicio SET NOT NULL;
ALTER TABLE periodos_academicos ALTER COLUMN fecha_fin SET NOT NULL;

-- ============================================================
-- 4. MEJORAR ON DELETE CASCADE
-- ============================================================

-- 4a. Eliminar FKs viejas y recrear con CASCADE
-- nrc → asignaturas, docentes, periodos, carreras
ALTER TABLE nrc DROP CONSTRAINT IF EXISTS nrc_id_asignatura_fkey;
ALTER TABLE nrc ADD CONSTRAINT nrc_id_asignatura_fkey
  FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id) ON DELETE CASCADE;

ALTER TABLE nrc DROP CONSTRAINT IF EXISTS nrc_id_docente_fkey;
ALTER TABLE nrc ADD CONSTRAINT nrc_id_docente_fkey
  FOREIGN KEY (id_docente) REFERENCES docentes(id) ON DELETE SET NULL;

ALTER TABLE nrc DROP CONSTRAINT IF EXISTS nrc_id_periodo_fkey;
ALTER TABLE nrc ADD CONSTRAINT nrc_id_periodo_fkey
  FOREIGN KEY (id_periodo) REFERENCES periodos_academicos(id) ON DELETE CASCADE;

ALTER TABLE nrc DROP CONSTRAINT IF EXISTS nrc_id_carrera_fkey;
ALTER TABLE nrc ADD CONSTRAINT nrc_id_carrera_fkey
  FOREIGN KEY (id_carrera) REFERENCES carreras(id) ON DELETE SET NULL;

-- 4b. horarios → espacios
ALTER TABLE horarios DROP CONSTRAINT IF EXISTS horarios_id_espacio_fkey;
ALTER TABLE horarios ADD CONSTRAINT horarios_id_espacio_fkey
  FOREIGN KEY (id_espacio) REFERENCES espacios_academicos(id) ON DELETE CASCADE;

-- 4c. matriculas → nrc, periodos
ALTER TABLE matriculas DROP CONSTRAINT IF EXISTS matriculas_id_nrc_fkey;
ALTER TABLE matriculas ADD CONSTRAINT matriculas_id_nrc_fkey
  FOREIGN KEY (id_nrc) REFERENCES nrc(id) ON DELETE CASCADE;

ALTER TABLE matriculas DROP CONSTRAINT IF EXISTS matriculas_id_periodo_fkey;
ALTER TABLE matriculas ADD CONSTRAINT matriculas_id_periodo_fkey
  FOREIGN KEY (id_periodo) REFERENCES periodos_academicos(id) ON DELETE CASCADE;

-- 4d. objetos_perdidos → usuarios (reportante, reclamante)
ALTER TABLE objetos_perdidos DROP CONSTRAINT IF EXISTS objetos_perdidos_id_reportante_fkey;
ALTER TABLE objetos_perdidos ADD CONSTRAINT objetos_perdidos_id_reportante_fkey
  FOREIGN KEY (id_reportante) REFERENCES usuarios(id) ON DELETE CASCADE;

ALTER TABLE objetos_perdidos DROP CONSTRAINT IF EXISTS objetos_perdidos_id_reclamante_fkey;
ALTER TABLE objetos_perdidos ADD CONSTRAINT objetos_perdidos_id_reclamante_fkey
  FOREIGN KEY (id_reclamante) REFERENCES usuarios(id) ON DELETE SET NULL;

-- 4e. reservas_espacios → periodos, nrc
ALTER TABLE reservas_espacios DROP CONSTRAINT IF EXISTS reservas_espacios_id_periodo_fkey;
ALTER TABLE reservas_espacios ADD CONSTRAINT reservas_espacios_id_periodo_fkey
  FOREIGN KEY (id_periodo) REFERENCES periodos_academicos(id) ON DELETE SET NULL;

ALTER TABLE reservas_espacios DROP CONSTRAINT IF EXISTS reservas_espacios_id_nrc_fkey;
ALTER TABLE reservas_espacios ADD CONSTRAINT reservas_espacios_id_nrc_fkey
  FOREIGN KEY (id_nrc) REFERENCES nrc(id) ON DELETE SET NULL;

ALTER TABLE reservas_espacios DROP CONSTRAINT IF EXISTS reservas_espacios_aprobado_por_fkey;
ALTER TABLE reservas_espacios ADD CONSTRAINT reservas_espacios_aprobado_por_fkey
  FOREIGN KEY (aprobado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

-- 4f. usuarios → docentes, periodos, carreras
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_id_carrera_fkey;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_id_carrera_fkey
  FOREIGN KEY (id_carrera) REFERENCES carreras(id) ON DELETE SET NULL;

ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_id_docente_fkey;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_id_docente_fkey
  FOREIGN KEY (id_docente) REFERENCES docentes(id) ON DELETE SET NULL;

ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_id_periodo_activo_fkey;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_id_periodo_activo_fkey
  FOREIGN KEY (id_periodo_activo) REFERENCES periodos_academicos(id) ON DELETE SET NULL;

-- 4g. carreras → sedes
ALTER TABLE carreras DROP CONSTRAINT IF EXISTS carreras_id_sede_fkey;
ALTER TABLE carreras ADD CONSTRAINT carreras_id_sede_fkey
  FOREIGN KEY (id_sede) REFERENCES sedes(id) ON DELETE SET NULL;

-- ============================================================
-- 5. ÍNDICE PARA NOTIFICACIONES (referencia polimórfica)
-- ============================================================

DROP INDEX IF EXISTS idx_notificaciones_referencia;
CREATE INDEX idx_notificaciones_referencia
  ON notificaciones (referencia_tipo, referencia_id);

-- ============================================================
-- 6. ACTUALIZAR neon-setup.sql COMO REFERENCIA (opcional)
-- ============================================================

COMMIT;