-- Seed: Poblar horarios del período 202650 (MARZO 2026 - AGOSTO 2026)
-- Carrera: Tecnología de la Información - Sede Santo Domingo
-- Basado en el documento oficial de horarios ESPE

DO $$
DECLARE
  v_carrera_id INT;
  v_periodo_id INT;
  v_tipo_aula INT;
  v_tipo_lab INT;
  v_tipo_virtual INT;
  v_docente_id INT;
  v_asignatura_id INT;
  v_nrc_id INT;
  v_espacio_id INT;
BEGIN

-- ============================================================
-- 1. DATOS BASE
-- ============================================================

INSERT INTO carreras (codigo, nombre, facultad, campus)
VALUES ('TECINFO', 'Tecnología de la Información', 'Ciencias de la Ingeniería', 'Santo Domingo')
ON CONFLICT (codigo) DO UPDATE SET nombre = EXCLUDED.nombre
RETURNING id INTO v_carrera_id;

INSERT INTO periodos_academicos (codigo, nombre, fecha_inicio, fecha_fin, activo)
VALUES ('202650', '202650 - MARZO 2026 - AGOSTO 2026', '2026-03-01', '2026-08-31', true)
ON CONFLICT (codigo) DO UPDATE SET activo = true
RETURNING id INTO v_periodo_id;

INSERT INTO tipos_espacio (nombre, descripcion) VALUES
  ('Aula', 'Aula de clases teórica'),
  ('Laboratorio', 'Laboratorio de cómputo / prácticas'),
  ('Virtual', 'En línea - sincrónico')
ON CONFLICT (nombre) DO NOTHING;

SELECT id INTO v_tipo_aula FROM tipos_espacio WHERE nombre = 'Aula';
SELECT id INTO v_tipo_lab FROM tipos_espacio WHERE nombre = 'Laboratorio';
SELECT id INTO v_tipo_virtual FROM tipos_espacio WHERE nombre = 'Virtual';

-- ============================================================
-- 2. ESPACIOS ACADÉMICOS (Aulas y Laboratorios)
-- ============================================================

INSERT INTO espacios_academicos (codigo, nombre, id_tipo, edificio, piso, capacidad, estado, tiene_proyector, tiene_computadoras) VALUES
  ('AULA-A',    'Aula A',      v_tipo_aula, 'Bloque 1', NULL, 40, 'disponible', true,  false),
  ('AULA-A01',  'Aula A01',    v_tipo_aula, 'Bloque 1', NULL, 40, 'disponible', true,  false),
  ('AULA-A02',  'Aula A02',    v_tipo_aula, 'Bloque 1', NULL, 40, 'disponible', true,  false),
  ('AULA-A09',  'Aula A09',    v_tipo_aula, 'Bloque 1', NULL, 40, 'disponible', true,  false),
  ('AULA-A10',  'Aula A10',    v_tipo_aula, 'Bloque 1', NULL, 40, 'disponible', true,  false),
  ('AULA-A11',  'Aula A11',    v_tipo_aula, 'Bloque 2', NULL, 40, 'disponible', true,  false),
  ('AULA-A12',  'Aula A12',    v_tipo_aula, 'Bloque 2', NULL, 40, 'disponible', true,  false),
  ('AULA-A13',  'Aula A13',    v_tipo_aula, 'Bloque 2', NULL, 40, 'disponible', true,  false),
  ('AULA-A14',  'Aula A14',    v_tipo_aula, 'Bloque 2', NULL, 40, 'disponible', true,  false),
  ('LAB-DCCO01','Lab DCCO 01', v_tipo_lab,  'Bloque 1', NULL, 30, 'disponible', true,  true),
  ('LAB-DCCO02','Lab DCCO 02', v_tipo_lab,  'Bloque 1', NULL, 30, 'disponible', true,  true),
  ('LAB-DCCO03','Lab DCCO 03', v_tipo_lab,  'Bloque 1', NULL, 30, 'disponible', true,  true),
  ('LAB-DCCO04','Lab DCCO 04', v_tipo_lab,  'Bloque 2', NULL, 30, 'disponible', true,  true),
  ('LAB-DCCO05','Lab DCCO 05', v_tipo_lab,  'Bloque 2', NULL, 30, 'disponible', true,  true),
  ('LAB-DCCO06','Lab DCCO 06', v_tipo_lab,  'Bloque 2', NULL, 30, 'disponible', true,  true),
  ('LAB-DCCO2', 'Lab DCCO 2',  v_tipo_lab,  'Bloque 1', NULL, 30, 'disponible', true,  true),
  ('LAB-QUIM',  'Lab Química', v_tipo_lab,  'Bloque 2', NULL, 25, 'disponible', false, false),
  ('CD-ENLINEA','CD-En Línea', v_tipo_virtual, NULL, NULL, NULL, 'disponible', false, false)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================
-- 3. DOCENTES
-- ============================================================

INSERT INTO docentes (nombre_completo)
SELECT nombre FROM (VALUES
  ('NINABANDA ARELLANO NELSON'),
  ('BASTIDAS CHALAN RODRIGO VLADIMIR'),
  ('CRUZ GARZÓN JOHN JAVIER'),
  ('JÁCOME GÓMEZ LEONARDO RAFAEL'),
  ('SUASNAVAS FLORES DARWIN FRANCISCO'),
  ('MARTÍNEZ CEPEDA VERÓNICA ISABEL'),
  ('LOPEZ LOPEZ ANDREA MARGARITA'),
  ('VIVAS PASPUEL ATAL KUMAR'),
  ('VINUEZA ESCOBAR NELSON FERNANDO'),
  ('BUSTOS GANCHOZO OSCAR FERNANDO'),
  ('PUENTE PONCE PABLO FRANCISCO'),
  ('VEGA QUIÑONEZ IVAN FRANCISCO'),
  ('CHUQUITARCO KEVIN JAIR'),
  ('CORONEL GUERRERO CHRISTIAN ALFREDO'),
  ('CEVALLOS FARÍAS JAVIER JOSÉ'),
  ('ORTIZ DELGADO LUIS ARMANDO'),
  ('NÚÑEZ AGURTO ALBERTO DANIEL'),
  ('BENAVIDES ASTUDILLO DIEGO EDUARDO'),
  ('MORENO MUÑOZ MARIO DIDÁN'),
  ('GALARZA SANCHEZ PAULO CESAR')
) AS t(nombre)
WHERE NOT EXISTS (SELECT 1 FROM docentes WHERE nombre_completo = t.nombre);

-- ============================================================
-- 4. ASIGNATURAS
-- ============================================================

INSERT INTO asignaturas (codigo, nombre, creditos) VALUES
  ('EXCT-A0301',    'CÁLCULO DIFERENCIAL E INTEGRAL', 6),
  ('EXCT-A0302',    'ÁLGEBRA LINEAL', 4),
  ('COMP-A0J01',    'FUNDAMENTOS DE PROGRAMACIÓN', 6),
  ('TCON-A0304',    'CULTURA AMBIENTAL', 4),
  ('EXCT-A0201-T',  'QUÍMICA I (TEORÍA)', 3),
  ('EXCT-A0201-L',  'QUÍMICA I (LABORATORIO)', 3),
  ('CHUM-A0100',    'METODOLOGÍA DE LA INVESTIGACIÓN CIENTÍFICA', 4),
  ('COMP-A0J07',    'PROGRAMACIÓN ORIENTADA A OBJETOS', 6),
  ('ELEE-A0442',    'COMPUTACIÓN DIGITAL', 6),
  ('EXCT-A0303',    'CÁLCULO VECTORIAL', 4),
  ('EXCT-A0401',    'ECUACIONES DIFERENCIALES ORDINARIAS', 4),
  ('EXCT-A0001',    'FÍSICA I', 4),
  ('EXCT-A0501',    'ESTADÍSTICA', 6),
  ('COMP-A0J09',    'ESTRUCTURA DE DATOS', 6),
  ('COMP-A0G02',    'METODOLOGÍAS DE DESARROLLO DE SOFTWARE', 6),
  ('COMP-A0I02',    'SISTEMAS OPERATIVOS', 4),
  ('EXCT-A0402',    'MÉTODOS NUMÉRICOS', 4),
  ('COMP-A0F02',    'MODELOS DISCRETOS PARA INGENIERÍA', 4),
  ('COMP-A0H02',    'SISTEMAS DE BASES DE DATOS', 6),
  ('COMP-A0G03',    'FUNDAMENTOS DE SISTEMAS WEB', 6),
  ('ELEE-A0344',    'REDES DE COMUNICACIONES', 6),
  ('COMP-A0G05',    'INTERFACES Y MULTIMEDIA', 4),
  ('COMP-A0I03',    'ADMINISTRACIÓN Y MANTENIMIENTO DE SISTEMAS', 4),
  ('SEGD-A0000',    'LIDERAZGO', 4),
  ('COMP-A0H03',    'GESTIÓN DE BASE DE DATOS', 6),
  ('COMP-A0I05',    'APLICACIÓN DE SISTEMAS OPERATIVOS', 6),
  ('COMP-A0I06',    'INTERNETWORKING', 6),
  ('COMP-A0G08',    'APLICACIÓN DE TECNOLOGÍAS WEB', 4),
  ('SEGD-A0101',    'REALIDAD NACIONAL Y GEOPOLÍTICA', 4),
  ('COMP-A0G13',    'DESARROLLO WEB PARA LA INTEGRACIÓN DE TECNOLOGÍAS', 6),
  ('COMP-A0H05',    'INTELIGENCIA ARTIFICIAL', 6),
  ('COMP-A0K02',    'LECTURA Y ESCRITURA DE TEXTOS ACADÉMICOS', 4),
  ('COMP-A0H06',    'MODELADO AVANZADO DE BASE DE DATOS', 4),
  ('COMP-A0G14',    'PROGRAMACIÓN INTEGRATIVA DE COMPONENTES WEB', 4),
  ('COMP-A0G20',    'PROGRAMACIÓN AVANZADA', 6),
  ('COMP-A0G17',    'APLICACIONES DISTRIBUIDAS', 6),
  ('COMP-A0I10',    'SEGURIDAD INFORMÁTICA', 6),
  ('COMP-A0L04',    'DISEÑO Y EVALUACIÓN DE PROYECTOS TI', 4),
  ('COMP-A0H07',    'MINERIA DE DATOS', 4),
  ('COMP-A0L06',    'GESTIÓN DE LA SEGURIDAD INFORMÁTICA', 6),
  ('COMP-A0G22',    'ARQUITECTURA DE SOFTWARE', 6),
  ('COMP-A0I11',    'TECNOLOGÍAS EMERGENTES', 4),
  ('CADM-A0G00',    'GESTIÓN Y EMPRENDIMIENTO', 4),
  ('COMP-A0K04',    'MIC - PI PROFESIONALIZANTE', 11),
  ('COMP-EFC01',    'EXAMEN FIN DE CARRERA', 11)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================
-- 5. NRC + HORARIOS
-- ============================================================

-- Helper para insertar horario
-- Formato: nrc, cod_asignatura, nivel_pao, paralelo, docente_nombre,
--          dia1, hora_ini1, hora_fin1, espacio1,
--          dia2, hora_ini2, hora_fin2, espacio2,
--          dia3, hora_ini3, hora_fin3, espacio3

-- ========== PAO 1 ==========

-- NRC 29447 - CÁLCULO DIFERENCIAL E INTEGRAL - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29447', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 1', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0301' AND d.nombre_completo = 'NINABANDA ARELLANO NELSON'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A02';

-- NRC 29430 - ÁLGEBRA LINEAL - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29430', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 1', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0302' AND d.nombre_completo = 'BASTIDAS CHALAN RODRIGO VLADIMIR'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A10';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A10';

-- NRC 31375 - FUNDAMENTOS DE PROGRAMACIÓN - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '31375', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 1', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0J01' AND d.nombre_completo = 'CRUZ GARZÓN JOHN JAVIER'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';

-- NRC 28897 - CULTURA AMBIENTAL - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '28897', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 1', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'TCON-A0304' AND d.nombre_completo = 'JÁCOME GÓMEZ LEONARDO RAFAEL'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A';

-- NRC 29469 - QUÍMICA I TEORÍA - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29469', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 1', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0201-T' AND d.nombre_completo = 'SUASNAVAS FLORES DARWIN FRANCISCO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '13:00', '16:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A11';

-- NRC 29483 - QUÍMICA I LABORATORIO - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29483', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 1', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0201-L' AND d.nombre_completo = 'SUASNAVAS FLORES DARWIN FRANCISCO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 4, '13:00', '16:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-QUIM';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 4, '13:00', '16:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A13';

-- NRC 30541 - METODOLOGÍA DE LA INVESTIGACIÓN CIENTÍFICA - Paralelo A (virtual)
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30541', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 1', 'A'
FROM asignaturas a WHERE a.codigo = 'CHUM-A0100';

-- ========== PAO 2 ==========

-- NRC 31377 - PROGRAMACIÓN ORIENTADA A OBJETOS A - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '31377', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0J07' AND d.nombre_completo = 'MARTÍNEZ CEPEDA VERÓNICA ISABEL'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';

-- NRC 29557 - COMPUTACIÓN DIGITAL A - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29557', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'ELEE-A0442' AND d.nombre_completo = 'LOPEZ LOPEZ ANDREA MARGARITA'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';

-- NRC 29529 - CÁLCULO VECTORIAL A - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29529', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0303' AND d.nombre_completo = 'VIVAS PASPUEL ATAL KUMAR'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A12';

-- NRC 29526 - ECUACIONES DIFERENCIALES ORDINARIAS A - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29526', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0401' AND d.nombre_completo = 'VINUEZA ESCOBAR NELSON FERNANDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A01';

-- NRC 29498 - FÍSICA I A - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29498', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0001' AND d.nombre_completo = 'BUSTOS GANCHOZO OSCAR FERNANDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A14';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A14';

-- NRC 31378 - PROGRAMACIÓN ORIENTADA A OBJETOS B - Paralelo B
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '31378', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'B'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0J07' AND d.nombre_completo = 'PUENTE PONCE PABLO FRANCISCO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO2';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 4, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO2';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 5, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO2';

-- NRC 29558 - COMPUTACIÓN DIGITAL B - Paralelo B
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29558', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 2', 'B'
FROM asignaturas a WHERE a.codigo = 'ELEE-A0442'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';

-- NRC 29500 - FÍSICA I B - Paralelo B
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29500', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'B'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0001' AND d.nombre_completo = 'VEGA QUIÑONEZ IVAN FRANCISCO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A12';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A13';

-- NRC 29530 - CÁLCULO VECTORIAL B - Paralelo B
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29530', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'B'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0303' AND d.nombre_completo = 'VIVAS PASPUEL ATAL KUMAR'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A09';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A02';

-- NRC 30380 - ECUACIONES DIFERENCIALES ORDINARIAS B - Paralelo B
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30380', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 2', 'B'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0401' AND d.nombre_completo = 'VINUEZA ESCOBAR NELSON FERNANDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A01';

-- ========== PAO 3 ==========

-- NRC 29523 - ESTADÍSTICA - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29523', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 3', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0501' AND d.nombre_completo = 'VIVAS PASPUEL ATAL KUMAR'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A09';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A09';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO06';

-- NRC 31379 - ESTRUCTURA DE DATOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '31379', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 3', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0J09' AND d.nombre_completo = 'PUENTE PONCE PABLO FRANCISCO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';

-- NRC 29531 - METODOLOGÍAS DE DESARROLLO DE SOFTWARE - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29531', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 3', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0G02' AND d.nombre_completo = 'CHUQUITARCO KEVIN JAIR'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';

-- NRC 29533 - SISTEMAS OPERATIVOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29533', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 3', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0I02' AND d.nombre_completo = 'CORONEL GUERRERO CHRISTIAN ALFREDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';

-- NRC 29528 - MÉTODOS NUMÉRICOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29528', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 3', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'EXCT-A0402' AND d.nombre_completo = 'BASTIDAS CHALAN RODRIGO VLADIMIR'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'AULA-A14';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';

-- NRC 29532 - MODELOS DISCRETOS PARA INGENIERÍA - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29532', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 3', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0F02' AND d.nombre_completo = 'CEVALLOS FARÍAS JAVIER JOSÉ'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';

-- ========== PAO 4 ==========

-- NRC 31374 - SISTEMAS DE BASES DE DATOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '31374', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 4', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0H02' AND d.nombre_completo = 'ORTIZ DELGADO LUIS ARMANDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';

-- NRC 29535 - FUNDAMENTOS DE SISTEMAS WEB - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29535', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 4', 'A'
FROM asignaturas a WHERE a.codigo = 'COMP-A0G03'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';

-- NRC 30875 - REDES DE COMUNICACIONES - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30875', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 4', 'A'
FROM asignaturas a WHERE a.codigo = 'ELEE-A0344'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';

-- NRC 29534 - INTERFACES Y MULTIMEDIA - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29534', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 4', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0G05' AND d.nombre_completo = 'PUENTE PONCE PABLO FRANCISCO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';

-- NRC 29536 - ADMINISTRACIÓN Y MANTENIMIENTO DE SISTEMAS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29536', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 4', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0I03' AND d.nombre_completo = 'CORONEL GUERRERO CHRISTIAN ALFREDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO02';

-- NRC 29921 - LIDERAZGO (virtual)
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29921', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 4', 'A'
FROM asignaturas a WHERE a.codigo = 'SEGD-A0000';

-- ========== PAO 5 ==========

-- NRC 29537 - GESTIÓN DE BASE DE DATOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29537', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 5', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0H03' AND d.nombre_completo = 'ORTIZ DELGADO LUIS ARMANDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';

-- NRC 29539 - APLICACIÓN DE SISTEMAS OPERATIVOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29539', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 5', 'A'
FROM asignaturas a WHERE a.codigo = 'COMP-A0I05'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';

-- NRC 29540 - INTERNETWORKING - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29540', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 5', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0I06' AND d.nombre_completo = 'NÚÑEZ AGURTO ALBERTO DANIEL'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';

-- NRC 29538 - APLICACIÓN DE TECNOLOGÍAS WEB - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29538', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 5', 'A'
FROM asignaturas a WHERE a.codigo = 'COMP-A0G08'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';

-- NRC 30652 - REALIDAD NACIONAL Y GEOPOLÍTICA (virtual)
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30652', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 5', 'A'
FROM asignaturas a WHERE a.codigo = 'SEGD-A0101';

-- ========== PAO 6 ==========

-- NRC 29543 - DESARROLLO WEB PARA LA INTEGRACIÓN DE TECNOLOGÍAS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29543', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 6', 'A'
FROM asignaturas a WHERE a.codigo = 'COMP-A0G13'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';

-- NRC 29541 - INTELIGENCIA ARTIFICIAL - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29541', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 6', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0H05' AND d.nombre_completo = 'BENAVIDES ASTUDILLO DIEGO EDUARDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';

-- NRC 29545 - LECTURA Y ESCRITURA DE TEXTOS ACADÉMICOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29545', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 6', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0K02' AND d.nombre_completo = 'NÚÑEZ AGURTO ALBERTO DANIEL'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';

-- NRC 29542 - MODELADO AVANZADO DE BASE DE DATOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29542', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 6', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0H06' AND d.nombre_completo = 'ORTIZ DELGADO LUIS ARMANDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';

-- NRC 29544 - PROGRAMACIÓN INTEGRATIVA DE COMPONENTES WEB - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29544', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 6', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0G14' AND d.nombre_completo = 'CHUQUITARCO KEVIN JAIR'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';

-- ========== PAO 7 ==========

-- NRC 29547 - PROGRAMACIÓN AVANZADA - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29547', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 7', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0G20' AND d.nombre_completo = 'CRUZ GARZÓN JOHN JAVIER'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 4, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 5, '13:00', '15:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';

-- NRC 29546 - APLICACIONES DISTRIBUIDAS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29546', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 7', 'A'
FROM asignaturas a WHERE a.codigo = 'COMP-A0G17'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO05';

-- ========== PAO 8 ==========

-- NRC 30873 - SEGURIDAD INFORMÁTICA - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30873', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 8', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0I10' AND d.nombre_completo = 'NÚÑEZ AGURTO ALBERTO DANIEL'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO01';

-- NRC 29548 - DISEÑO Y EVALUACIÓN DE PROYECTOS TI - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29548', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 8', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0L04' AND d.nombre_completo = 'CEVALLOS FARÍAS JAVIER JOSÉ'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';

-- NRC 29549 - MINERIA DE DATOS - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29549', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 8', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0H07' AND d.nombre_completo = 'BENAVIDES ASTUDILLO DIEGO EDUARDO'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '07:00', '09:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO04';

-- NRC 29552 - GESTIÓN DE LA SEGURIDAD INFORMÁTICA - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29552', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 8', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0L06' AND d.nombre_completo = 'CEVALLOS FARÍAS JAVIER JOSÉ'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO06';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO06';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO06';

-- NRC 29551 - ARQUITECTURA DE SOFTWARE - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '29551', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 8', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0G22' AND d.nombre_completo = 'CHUQUITARCO KEVIN JAIR'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO06';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO06';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 3, '09:00', '11:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO06';

-- NRC 30874 - TECNOLOGÍAS EMERGENTES - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30874', a.id, NULL, v_periodo_id, v_carrera_id, 'PAO 8', 'A'
FROM asignaturas a WHERE a.codigo = 'COMP-A0I11'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 1, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin)
SELECT v_nrc_id, e.id, 2, '11:00', '13:00' FROM espacios_academicos e WHERE e.codigo = 'LAB-DCCO03';

-- NRC 28504 - GESTIÓN Y EMPRENDIMIENTO - Paralelo A (virtual)
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '28504', a.id, d.id, v_periodo_id, v_carrera_id, 'PAO 8', 'A'
FROM asignaturas a, docentes d
WHERE a.codigo = 'CADM-A0G00' AND d.nombre_completo = 'MORENO MUÑOZ MARIO DIDÁN'
RETURNING id INTO v_nrc_id;
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin, es_virtual)
SELECT v_nrc_id, e.id, 4, '15:00', '17:00', true FROM espacios_academicos e WHERE e.codigo = 'CD-ENLINEA';
INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin, es_virtual)
SELECT v_nrc_id, e.id, 5, '15:00', '17:00', true FROM espacios_academicos e WHERE e.codigo = 'CD-ENLINEA';

-- ========== UNIDAD DE INTEGRACIÓN CURRICULAR (UIC) ==========

-- NRC 31359 - MIC - PI PROFESIONALIZANTE (CB) - 11 créditos - Paralelo CB
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '31359', a.id, NULL, v_periodo_id, v_carrera_id, 'UIC', 'CB'
FROM asignaturas a WHERE a.codigo = 'COMP-A0K04';

-- NRC 31360 - Secretario Académico (C2) - Paralelo C2
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '31360', a.id, NULL, v_periodo_id, v_carrera_id, 'UIC', 'C2'
FROM asignaturas a WHERE a.codigo = 'COMP-A0K04';

-- NRC 31361 - EXAMEN FIN DE CARRERA - Paralelo A
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '31361', a.id, NULL, v_periodo_id, v_carrera_id, 'UIC', 'A'
FROM asignaturas a WHERE a.codigo = 'COMP-EFC01';

-- Tutores de MIC
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30965', a.id, d.id, v_periodo_id, v_carrera_id, 'UIC', 'TUTOR-2'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0K04' AND d.nombre_completo = 'BENAVIDES ASTUDILLO DIEGO EDUARDO';
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30967', a.id, d.id, v_periodo_id, v_carrera_id, 'UIC', 'TUTOR-2'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0K04' AND d.nombre_completo = 'CORONEL GUERRERO CHRISTIAN ALFREDO';
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30968', a.id, d.id, v_periodo_id, v_carrera_id, 'UIC', 'TUTOR-2'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0K04' AND d.nombre_completo = 'GALARZA SANCHEZ PAULO CESAR';
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '32065', a.id, d.id, v_periodo_id, v_carrera_id, 'UIC', 'TUTOR-2'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0K04' AND d.nombre_completo = 'LOPEZ LOPEZ ANDREA MARGARITA';
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30969', a.id, d.id, v_periodo_id, v_carrera_id, 'UIC', 'TUTOR-1'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0K04' AND d.nombre_completo = 'NÚÑEZ AGURTO ALBERTO DANIEL';
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30971', a.id, d.id, v_periodo_id, v_carrera_id, 'UIC', 'TUTOR-1'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0K04' AND d.nombre_completo = 'CHUQUITARCO KEVIN JAIR';
INSERT INTO nrc (nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo)
SELECT '30972', a.id, d.id, v_periodo_id, v_carrera_id, 'UIC', 'TUTOR-1'
FROM asignaturas a, docentes d
WHERE a.codigo = 'COMP-A0K04' AND d.nombre_completo = 'PUENTE PONCE PABLO FRANCISCO';

RAISE NOTICE 'Seed completado exitosamente.';
END $$;
