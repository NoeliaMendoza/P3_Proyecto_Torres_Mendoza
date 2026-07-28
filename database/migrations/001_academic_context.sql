-- ESPEConnect: contexto académico, matrículas y notificaciones

CREATE TABLE IF NOT EXISTS sedes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO sedes (codigo, nombre)
VALUES ('SD', 'Santo Domingo de los Tsáchilas')
ON CONFLICT (codigo) DO NOTHING;

ALTER TABLE carreras ADD COLUMN IF NOT EXISTS id_sede INTEGER REFERENCES sedes(id);

UPDATE carreras c
SET id_sede = s.id
FROM sedes s
WHERE s.codigo = 'SD' AND c.codigo = 'TECINFO' AND c.id_sede IS NULL;

ALTER TABLE docentes ADD COLUMN IF NOT EXISTS email_institucional VARCHAR(255);

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS codigo_estudiante VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS id_carrera INTEGER REFERENCES carreras(id);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nivel_pao SMALLINT CHECK (nivel_pao IS NULL OR nivel_pao BETWEEN 1 AND 7);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS id_docente INTEGER REFERENCES docentes(id);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS id_periodo_activo INTEGER REFERENCES periodos_academicos(id);

DO $$
BEGIN
  ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_check;
  ALTER TABLE usuarios ADD CONSTRAINT usuarios_rol_check
    CHECK (rol IN ('estudiante', 'docente', 'admin'));
EXCEPTION
  WHEN others THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS matriculas (
    id SERIAL PRIMARY KEY,
    id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    id_nrc INTEGER NOT NULL REFERENCES nrc(id),
    id_periodo INTEGER NOT NULL REFERENCES periodos_academicos(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'activa'
      CHECK (estado IN ('activa', 'retirada')),
    UNIQUE(id_usuario, id_nrc, id_periodo)
);

CREATE INDEX IF NOT EXISTS idx_matriculas_usuario ON matriculas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_matriculas_periodo ON matriculas(id_periodo);

ALTER TABLE reservas_espacios ADD COLUMN IF NOT EXISTS id_periodo INTEGER REFERENCES periodos_academicos(id);
ALTER TABLE reservas_espacios ADD COLUMN IF NOT EXISTS id_nrc INTEGER REFERENCES nrc(id);
ALTER TABLE reservas_espacios ADD COLUMN IF NOT EXISTS tipo_actividad VARCHAR(50);
ALTER TABLE reservas_espacios ADD COLUMN IF NOT EXISTS comentario_admin TEXT;
ALTER TABLE reservas_espacios ADD COLUMN IF NOT EXISTS aprobado_por UUID REFERENCES usuarios(id);
ALTER TABLE reservas_espacios ADD COLUMN IF NOT EXISTS fecha_revision TIMESTAMP;

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

CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(id_usuario);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leido ON notificaciones(id_usuario, leido);
