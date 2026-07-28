CREATE TABLE IF NOT EXISTS reservas_espacios (
    id BIGSERIAL PRIMARY KEY,
    id_espacio INTEGER NOT NULL REFERENCES espacios_academicos(id) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
      CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'cancelada')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas_espacios(id_usuario);
CREATE UNIQUE INDEX IF NOT EXISTS uq_reserva_activa_exacta
    ON reservas_espacios(id_espacio, fecha, hora_inicio, hora_fin)
    WHERE estado IN ('pendiente', 'aprobada');
CREATE INDEX IF NOT EXISTS idx_push_usuario ON push_subscriptions(id_usuario);
