-- ESPEConnect - Agrega FKs faltantes que nunca se crearon en la BD original
-- Tablas "sueltas": disponibilidad_espacios, categorias_objetos, tipos_espacio

BEGIN;

-- 1. disponibilidad_espacios.id_espacio → espacios_academicos(id)
ALTER TABLE disponibilidad_espacios DROP CONSTRAINT IF EXISTS disp_espacios_id_espacio_fkey;
ALTER TABLE disponibilidad_espacios ADD CONSTRAINT disp_espacios_id_espacio_fkey
  FOREIGN KEY (id_espacio) REFERENCES espacios_academicos(id) ON DELETE CASCADE
  NOT VALID;
ALTER TABLE disponibilidad_espacios VALIDATE CONSTRAINT disp_espacios_id_espacio_fkey;

-- 2. objetos_perdidos.id_categoria → categorias_objetos(id)
ALTER TABLE objetos_perdidos DROP CONSTRAINT IF EXISTS objetos_perdidos_id_categoria_fkey;
ALTER TABLE objetos_perdidos ADD CONSTRAINT objetos_perdidos_id_categoria_fkey
  FOREIGN KEY (id_categoria) REFERENCES categorias_objetos(id) ON DELETE SET NULL
  NOT VALID;
ALTER TABLE objetos_perdidos VALIDATE CONSTRAINT objetos_perdidos_id_categoria_fkey;

-- 3. espacios_academicos.id_tipo → tipos_espacio(id)
ALTER TABLE espacios_academicos DROP CONSTRAINT IF EXISTS espacios_academicos_id_tipo_fkey;
ALTER TABLE espacios_academicos ADD CONSTRAINT espacios_academicos_id_tipo_fkey
  FOREIGN KEY (id_tipo) REFERENCES tipos_espacio(id) ON DELETE RESTRICT
  NOT VALID;
ALTER TABLE espacios_academicos VALIDATE CONSTRAINT espacios_academicos_id_tipo_fkey;

COMMIT;