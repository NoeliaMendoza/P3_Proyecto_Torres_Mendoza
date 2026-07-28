-- Agrega horarios de Jueves y Viernes faltantes a todos los PAOs
-- Basado en el PDF oficial HORARIO_ITIJ_202650_V5

DO $$
DECLARE
  v_nrc_id INT;
  v_espacio_id INT;
BEGIN

-- ========== PAO 1 ==========

-- NRC 29447 - CÁLCULO DIFERENCIAL E INTEGRAL - JUE 07-09 AULA-A02, VIE 07-09 AULA-A02
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29447' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29430 - ÁLGEBRA LINEAL - JUE 09-11 AULA-A10, VIE 09-11 AULA-A10
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29430' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A10';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 31375 - FUNDAMENTOS DE PROGRAMACIÓN - JUE 11-13 LAB-DCCO04, VIE 11-13 LAB-DCCO04
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '31375' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO04';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- NRC 28897 - CULTURA AMBIENTAL - JUE 09-11 AULA-A, VIE 09-11 AULA-A
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '28897' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- ========== PAO 2 ==========

-- NRC 31377 - POO A - JUE 07-09 LAB-DCCO02, VIE 07-09 LAB-DCCO02
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '31377' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29557 - COMPUTACIÓN DIGITAL A - JUE 09-11 LAB-DCCO01, VIE 09-11 LAB-DCCO01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29557' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 29529 - CÁLCULO VECTORIAL A - JUE 07-09 AULA-A02, VIE 07-09 AULA-A02
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29529' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29526 - ECUACIONES DIFERENCIALES ORDINARIAS A - JUE 09-11 AULA-A01, VIE 09-11 AULA-A01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29526' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 29498 - FÍSICA I A - JUE 11-13 AULA-A14, VIE 11-13 AULA-A14
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29498' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A14';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- NRC 31378 - POO B - (already has Mie 13-15, Jue 13-15, Vie 13-15) - add Lun 13-15 LAB-DCCO2, Mar 13-15 LAB-DCCO2
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '31378' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO2';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 1 AND hora_inicio = '13:00') THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 1, '13:00', '15:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 2 AND hora_inicio = '13:00') THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 2, '13:00', '15:00');
END IF;

-- NRC 29558 - COMPUTACIÓN DIGITAL B - JUE 11-13 LAB-DCCO03, VIE 11-13 LAB-DCCO03 (already has L,M,W)
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29558' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO03';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- NRC 29500 - FÍSICA I B - JUE 09-11 AULA-A13, VIE 07-09 AULA-A12
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29500' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A13';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A12';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29530 - CÁLCULO VECTORIAL B - JUE 09-11 AULA-A02, VIE 09-11 AULA-A09
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29530' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A09';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 30380 - ECUACIONES DIFERENCIALES ORDINARIAS B - JUE 11-13 AULA-A01, VIE 11-13 AULA-A01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '30380' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- ========== PAO 3 ==========

-- NRC 29523 - ESTADÍSTICA - JUE 07-09 AULA-A09, VIE 07-09 LAB-DCCO06
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29523' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A09';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO06';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 31379 - ESTRUCTURA DE DATOS - JUE 09-11 LAB-DCCO02, VIE 09-11 LAB-DCCO02
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '31379' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 29531 - METODOLOGÍAS DE DESARROLLO DE SOFTWARE - JUE 11-13 LAB-DCCO02, VIE 11-13 LAB-DCCO02
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29531' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- NRC 29533 - SISTEMAS OPERATIVOS - JUE 07-09 LAB-DCCO01, VIE 07-09 LAB-DCCO01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29533' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29528 - MÉTODOS NUMÉRICOS - JUE 09-11 AULA-A14, VIE 09-11 AULA-A14
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29528' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'AULA-A14';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 29532 - MODELOS DISCRETOS PARA INGENIERÍA - JUE 11-13 LAB-DCCO02, VIE 11-13 LAB-DCCO02
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29532' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- ========== PAO 4 ==========

-- NRC 31374 - SISTEMAS DE BASES DE DATOS - JUE 07-09 LAB-DCCO03, VIE 07-09 LAB-DCCO03
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '31374' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO03';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29535 - FUNDAMENTOS DE SISTEMAS WEB - JUE 09-11 LAB-DCCO03, VIE 09-11 LAB-DCCO03
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29535' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO03';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 30875 - REDES DE COMUNICACIONES - JUE 13-15 LAB-DCCO01, VIE 13-15 LAB-DCCO01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '30875' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '13:00', '15:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '13:00', '15:00');
END IF;

-- NRC 29534 - INTERFACES Y MULTIMEDIA - JUE 07-09 LAB-DCCO02, VIE 07-09 LAB-DCCO02
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29534' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29536 - ADMINISTRACIÓN Y MANTENIMIENTO DE SISTEMAS - JUE 09-11 LAB-DCCO02, VIE 09-11 LAB-DCCO02
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29536' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO02';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- ========== PAO 5 ==========

-- NRC 29537 - GESTIÓN DE BASE DE DATOS - JUE 09-11 LAB-DCCO05, VIE 09-11 LAB-DCCO05
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29537' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO05';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 29539 - APLICACIÓN DE SISTEMAS OP. - JUE 07-09 LAB-DCCO04, VIE 07-09 LAB-DCCO04
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29539' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO04';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29540 - INTERNETWORKING - JUE 11-13 LAB-DCCO01, VIE 11-13 LAB-DCCO01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29540' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- NRC 29538 - APLICACIÓN DE TECNOLOGÍAS WEB - JUE 09-11 LAB-DCCO01, VIE 09-11 LAB-DCCO01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29538' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- ========== PAO 6 ==========

-- NRC 29543 - DESARROLLO WEB INTEGRACIÓN - JUE 07-09 LAB-DCCO05, VIE 07-09 LAB-DCCO05
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29543' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO05';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29541 - INTELIGENCIA ARTIFICIAL - JUE 09-11 LAB-DCCO04, VIE 09-11 LAB-DCCO04
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29541' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO04';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 29545 - LECTURA Y ESCRITURA TEXTOS ACAD. - JUE 07-09 LAB-DCCO03, VIE 07-09 LAB-DCCO03
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29545' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO03';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29542 - MODELADO AVANZADO BD - JUE 11-13 LAB-DCCO05, VIE 11-13 LAB-DCCO05
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29542' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO05';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- NRC 29544 - PROGRAMACIÓN INTEGRATIVA COMP. WEB - JUE 09-11 LAB-DCCO03, VIE 09-11 LAB-DCCO03
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29544' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO03';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- ========== PAO 7 ==========

-- NRC 29547 - PROGRAMACIÓN AVANZADA - JUE 13-15 LAB-DCCO03, VIE 13-15 LAB-DCCO03 (already has Lun, Mar, Mie)
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29547' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO03';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 1) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 1, '13:00', '15:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 2) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 2, '13:00', '15:00');
END IF;

-- NRC 29546 - APLICACIONES DISTRIBUIDAS - JUE 11-13 LAB-DCCO01, VIE 11-13 LAB-DCCO01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29546' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- ========== PAO 8 ==========

-- NRC 29552 - GESTIÓN SEGURIDAD INFORMÁTICA - JUE 11-13 LAB-DCCO06, VIE 11-13 LAB-DCCO06
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29552' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO06';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- NRC 29551 - ARQUITECTURA DE SOFTWARE - JUE 09-11 LAB-DCCO06, VIE 09-11 LAB-DCCO06
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29551' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO06';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 30874 - TECNOLOGÍAS EMERGENTES - JUE 11-13 LAB-DCCO03, VIE 11-13 LAB-DCCO03
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '30874' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO03';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '11:00', '13:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '11:00', '13:00');
END IF;

-- NRC 28504 - GESTIÓN Y EMPRENDIMIENTO - JUE 15-17 CD-ENLINEA, VIE 15-17 CD-ENLINEA
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '28504' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'CD-ENLINEA';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 1) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin, es_virtual) VALUES (v_nrc_id, v_espacio_id, 1, '15:00', '17:00', true);
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 2) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin, es_virtual) VALUES (v_nrc_id, v_espacio_id, 2, '15:00', '17:00', true);
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 3) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin, es_virtual) VALUES (v_nrc_id, v_espacio_id, 3, '15:00', '17:00', true);
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin, es_virtual) VALUES (v_nrc_id, v_espacio_id, 4, ':00', ':00', true);
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin, es_virtual) VALUES (v_nrc_id, v_espacio_id, 5, ':00', ':00', true);
END IF;

-- También agregar horarios faltantes de PAO 8 que ya tienen algunos días
-- NRC 30873 - SEGURIDAD INFORMÁTICA - JUE 07-09 LAB-DCCO01, VIE 07-09 LAB-DCCO01
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '30873' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO01';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

-- NRC 29548 - DISEÑO Y EVALUACIÓN DE PROYECTOS TI - JUE 09-11 LAB-DCCO04, VIE 09-11 LAB-DCCO04
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29548' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO04';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '09:00', '11:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '09:00', '11:00');
END IF;

-- NRC 29549 - MINERÍA DE DATOS - JUE 07-09 LAB-DCCO04, VIE 07-09 LAB-DCCO04
SELECT id INTO v_nrc_id FROM nrc WHERE nrc = '29549' AND id_periodo = (SELECT id FROM periodos_academicos WHERE activo = true);
SELECT id INTO v_espacio_id FROM espacios_academicos WHERE codigo = 'LAB-DCCO04';
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 4) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 4, '07:00', '09:00');
END IF;
IF NOT EXISTS (SELECT 1 FROM horarios WHERE id_nrc = v_nrc_id AND dia_semana = 5) THEN
  INSERT INTO horarios (id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin) VALUES (v_nrc_id, v_espacio_id, 5, '07:00', '09:00');
END IF;

RAISE NOTICE 'Horarios de Jueves y Viernes agregados correctamente.';
END $$;
