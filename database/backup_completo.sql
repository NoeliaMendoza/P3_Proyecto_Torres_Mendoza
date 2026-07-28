--
-- PostgreSQL database dump
--

\restrict mmbwaPJ3A9q7OlU4iJdWZsiotympkHPzFkfYFylaW2mCloqwG2aEh1ATspkjHVe

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asignaturas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asignaturas (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    creditos integer,
    CONSTRAINT asignaturas_creditos_check CHECK ((creditos > 0))
);


--
-- Name: asignaturas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asignaturas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asignaturas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.asignaturas_id_seq OWNED BY public.asignaturas.id;


--
-- Name: carreras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carreras (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(255) NOT NULL,
    facultad character varying(255),
    campus character varying(255),
    id_sede integer
);


--
-- Name: carreras_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carreras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carreras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carreras_id_seq OWNED BY public.carreras.id;


--
-- Name: categorias_objetos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias_objetos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    icono character varying(50),
    descripcion text
);


--
-- Name: categorias_objetos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categorias_objetos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_objetos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categorias_objetos_id_seq OWNED BY public.categorias_objetos.id;


--
-- Name: disponibilidad_espacios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.disponibilidad_espacios (
    id integer NOT NULL,
    id_espacio integer NOT NULL,
    fecha date,
    dia_semana smallint,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    disponible boolean DEFAULT true,
    motivo character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT disponibilidad_espacios_dia_semana_check CHECK (((dia_semana >= 1) AND (dia_semana <= 5)))
);


--
-- Name: disponibilidad_espacios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.disponibilidad_espacios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: disponibilidad_espacios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.disponibilidad_espacios_id_seq OWNED BY public.disponibilidad_espacios.id;


--
-- Name: docentes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.docentes (
    id integer NOT NULL,
    nombre_completo character varying(255) NOT NULL,
    email character varying(255),
    departamento character varying(255),
    email_institucional character varying(255)
);


--
-- Name: docentes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.docentes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: docentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.docentes_id_seq OWNED BY public.docentes.id;


--
-- Name: espacios_academicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.espacios_academicos (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    id_tipo integer NOT NULL,
    capacidad integer,
    edificio character varying(255),
    piso character varying(50),
    ubicacion_detalle text,
    estado character varying(50) DEFAULT 'disponible'::character varying,
    tiene_proyector boolean DEFAULT false,
    tiene_computadoras boolean DEFAULT false,
    tiene_aire_acondicionado boolean DEFAULT false,
    imagen_url text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT espacios_academicos_capacidad_check CHECK ((capacidad > 0)),
    CONSTRAINT espacios_academicos_estado_check CHECK (((estado)::text = ANY (ARRAY[('disponible'::character varying)::text, ('ocupado'::character varying)::text, ('mantenimiento'::character varying)::text, ('cerrado'::character varying)::text])))
);


--
-- Name: espacios_academicos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.espacios_academicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: espacios_academicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.espacios_academicos_id_seq OWNED BY public.espacios_academicos.id;


--
-- Name: horarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.horarios (
    id integer NOT NULL,
    id_nrc integer NOT NULL,
    id_espacio integer NOT NULL,
    dia_semana smallint NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    es_virtual boolean DEFAULT false,
    CONSTRAINT horarios_dia_semana_check CHECK (((dia_semana >= 1) AND (dia_semana <= 5)))
);


--
-- Name: horarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.horarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: horarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.horarios_id_seq OWNED BY public.horarios.id;


--
-- Name: matriculas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.matriculas (
    id integer NOT NULL,
    id_usuario uuid NOT NULL,
    id_nrc integer NOT NULL,
    id_periodo integer NOT NULL,
    estado character varying(20) DEFAULT 'activa'::character varying NOT NULL,
    CONSTRAINT matriculas_estado_check CHECK (((estado)::text = ANY ((ARRAY['activa'::character varying, 'retirada'::character varying])::text[])))
);


--
-- Name: matriculas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.matriculas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: matriculas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.matriculas_id_seq OWNED BY public.matriculas.id;


--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notificaciones (
    id bigint NOT NULL,
    id_usuario uuid NOT NULL,
    titulo character varying(255) NOT NULL,
    mensaje text NOT NULL,
    categoria character varying(30) DEFAULT 'sistema'::character varying NOT NULL,
    leido boolean DEFAULT false NOT NULL,
    referencia_tipo character varying(30),
    referencia_id bigint,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notificaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notificaciones_id_seq OWNED BY public.notificaciones.id;


--
-- Name: nrc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nrc (
    id integer NOT NULL,
    nrc character varying(20) NOT NULL,
    id_asignatura integer NOT NULL,
    id_docente integer,
    id_periodo integer NOT NULL,
    id_carrera integer,
    nivel_pao character varying(20),
    paralelo character varying(10)
);


--
-- Name: nrc_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nrc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nrc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nrc_id_seq OWNED BY public.nrc.id;


--
-- Name: objetos_perdidos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.objetos_perdidos (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text NOT NULL,
    id_categoria integer,
    tipo character varying(20) NOT NULL,
    estado character varying(50) DEFAULT 'abierto'::character varying,
    ubicacion character varying(255),
    fecha_reporte date DEFAULT CURRENT_DATE,
    fecha_evento date,
    imagenes_url text[],
    id_reportante uuid,
    informacion_contacto character varying(255),
    es_reclamado boolean DEFAULT false,
    id_reclamante uuid,
    fecha_reclamo timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT objetos_perdidos_estado_check CHECK (((estado)::text = ANY (ARRAY[('abierto'::character varying)::text, ('resuelto'::character varying)::text, ('cerrado'::character varying)::text]))),
    CONSTRAINT objetos_perdidos_tipo_check CHECK (((tipo)::text = ANY (ARRAY[('perdido'::character varying)::text, ('encontrado'::character varying)::text])))
);


--
-- Name: objetos_perdidos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.objetos_perdidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: objetos_perdidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.objetos_perdidos_id_seq OWNED BY public.objetos_perdidos.id;


--
-- Name: periodos_academicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.periodos_academicos (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(255) NOT NULL,
    fecha_inicio date,
    fecha_fin date,
    activo boolean DEFAULT false
);


--
-- Name: periodos_academicos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.periodos_academicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: periodos_academicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.periodos_academicos_id_seq OWNED BY public.periodos_academicos.id;


--
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_subscriptions (
    id bigint NOT NULL,
    id_usuario uuid NOT NULL,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.push_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


--
-- Name: reservas_espacios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservas_espacios (
    id bigint NOT NULL,
    id_espacio integer NOT NULL,
    id_usuario uuid NOT NULL,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    motivo character varying(255),
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    id_periodo integer,
    id_nrc integer,
    tipo_actividad character varying(50),
    comentario_admin text,
    aprobado_por uuid,
    fecha_revision timestamp without time zone,
    CONSTRAINT reservas_espacios_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aprobada'::character varying, 'rechazada'::character varying, 'cancelada'::character varying])::text[])))
);


--
-- Name: reservas_espacios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reservas_espacios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reservas_espacios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reservas_espacios_id_seq OWNED BY public.reservas_espacios.id;


--
-- Name: sedes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sedes (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(255) NOT NULL
);


--
-- Name: sedes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sedes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sedes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sedes_id_seq OWNED BY public.sedes.id;


--
-- Name: tipos_espacio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipos_espacio (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    icono character varying(50)
);


--
-- Name: tipos_espacio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipos_espacio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tipos_espacio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipos_espacio_id_seq OWNED BY public.tipos_espacio.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nombre_completo character varying(255) NOT NULL,
    rol character varying(20) DEFAULT 'estudiante'::character varying NOT NULL,
    avatar_url text,
    telefono character varying(20),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    codigo_estudiante character varying(20),
    id_carrera integer,
    nivel_pao smallint,
    id_docente integer,
    id_periodo_activo integer,
    CONSTRAINT usuarios_nivel_pao_check CHECK (((nivel_pao IS NULL) OR ((nivel_pao >= 1) AND (nivel_pao <= 7)))),
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['estudiante'::character varying, 'docente'::character varying, 'admin'::character varying])::text[])))
);


--
-- Name: vista_disponibilidad; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vista_disponibilidad AS
 SELECT e.id,
    e.codigo,
    e.nombre AS nombre_espacio,
    te.nombre AS tipo_espacio,
    e.capacidad,
    e.edificio,
    e.piso,
    e.estado,
        CASE
            WHEN (h.id IS NOT NULL) THEN 'ocupado'::text
            ELSE 'disponible'::text
        END AS estado_actual,
    h.dia_semana,
    h.hora_inicio,
    h.hora_fin,
    a.nombre AS asignatura,
    d.nombre_completo AS docente
   FROM (((((public.espacios_academicos e
     LEFT JOIN public.tipos_espacio te ON ((e.id_tipo = te.id)))
     LEFT JOIN public.horarios h ON (((e.id = h.id_espacio) AND ((h.dia_semana)::numeric = EXTRACT(dow FROM CURRENT_DATE)) AND ((CURRENT_TIME >= (h.hora_inicio)::time with time zone) AND (CURRENT_TIME <= (h.hora_fin)::time with time zone)))))
     LEFT JOIN public.nrc n ON ((h.id_nrc = n.id)))
     LEFT JOIN public.asignaturas a ON ((n.id_asignatura = a.id)))
     LEFT JOIN public.docentes d ON ((n.id_docente = d.id)));


--
-- Name: vista_horarios_completa; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vista_horarios_completa AS
 SELECT h.id,
    n.nrc,
    a.codigo AS codigo_asignatura,
    a.nombre AS asignatura,
    a.creditos,
    d.nombre_completo AS docente,
    e.codigo AS codigo_espacio,
    e.nombre AS nombre_espacio,
    te.nombre AS tipo_espacio,
    h.dia_semana,
        CASE h.dia_semana
            WHEN 1 THEN 'Lunes'::text
            WHEN 2 THEN 'Martes'::text
            WHEN 3 THEN 'Miércoles'::text
            WHEN 4 THEN 'Jueves'::text
            WHEN 5 THEN 'Viernes'::text
            ELSE NULL::text
        END AS dia,
    h.hora_inicio,
    h.hora_fin,
    n.nivel_pao,
    n.paralelo,
    p.codigo AS periodo,
    p.id AS periodo_id,
    e.id AS espacio_id,
    c.nombre AS carrera
   FROM (((((((public.horarios h
     JOIN public.nrc n ON ((h.id_nrc = n.id)))
     JOIN public.asignaturas a ON ((n.id_asignatura = a.id)))
     LEFT JOIN public.docentes d ON ((n.id_docente = d.id)))
     JOIN public.espacios_academicos e ON ((h.id_espacio = e.id)))
     JOIN public.tipos_espacio te ON ((e.id_tipo = te.id)))
     JOIN public.periodos_academicos p ON ((n.id_periodo = p.id)))
     LEFT JOIN public.carreras c ON ((n.id_carrera = c.id)));


--
-- Name: asignaturas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaturas ALTER COLUMN id SET DEFAULT nextval('public.asignaturas_id_seq'::regclass);


--
-- Name: carreras id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras ALTER COLUMN id SET DEFAULT nextval('public.carreras_id_seq'::regclass);


--
-- Name: docentes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docentes ALTER COLUMN id SET DEFAULT nextval('public.docentes_id_seq'::regclass);


--
-- Name: espacios_academicos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.espacios_academicos ALTER COLUMN id SET DEFAULT nextval('public.espacios_academicos_id_seq'::regclass);


--
-- Name: horarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horarios ALTER COLUMN id SET DEFAULT nextval('public.horarios_id_seq'::regclass);


--
-- Name: matriculas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matriculas ALTER COLUMN id SET DEFAULT nextval('public.matriculas_id_seq'::regclass);


--
-- Name: notificaciones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id SET DEFAULT nextval('public.notificaciones_id_seq'::regclass);


--
-- Name: nrc id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nrc ALTER COLUMN id SET DEFAULT nextval('public.nrc_id_seq'::regclass);


--
-- Name: periodos_academicos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periodos_academicos ALTER COLUMN id SET DEFAULT nextval('public.periodos_academicos_id_seq'::regclass);


--
-- Name: push_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


--
-- Name: reservas_espacios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas_espacios ALTER COLUMN id SET DEFAULT nextval('public.reservas_espacios_id_seq'::regclass);


--
-- Name: sedes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sedes ALTER COLUMN id SET DEFAULT nextval('public.sedes_id_seq'::regclass);


--
-- Name: tipos_espacio id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_espacio ALTER COLUMN id SET DEFAULT nextval('public.tipos_espacio_id_seq'::regclass);


--
-- Data for Name: asignaturas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asignaturas (id, codigo, nombre, creditos) FROM stdin;
1	EXCT-A0301	CÁLCULO DIFERENCIAL E INTEGRAL	6
2	EXCT-A0302	ÁLGEBRA LINEAL	4
3	COMP-A0J01	FUNDAMENTOS DE PROGRAMACIÓN	6
4	TCON-A0304	CULTURA AMBIENTAL	4
5	EXCT-A0201-T	QUÍMICA I (TEORÍA)	3
6	EXCT-A0201-L	QUÍMICA I (LABORATORIO)	3
7	CHUM-A0100	METODOLOGÍA DE LA INVESTIGACIÓN CIENTÍFICA	4
8	COMP-A0J07	PROGRAMACIÓN ORIENTADA A OBJETOS	6
9	ELEE-A0442	COMPUTACIÓN DIGITAL	6
10	EXCT-A0303	CÁLCULO VECTORIAL	4
11	EXCT-A0401	ECUACIONES DIFERENCIALES ORDINARIAS	4
12	EXCT-A0001	FÍSICA I	4
13	EXCT-A0501	ESTADÍSTICA	6
14	COMP-A0J09	ESTRUCTURA DE DATOS	6
15	COMP-A0G02	METODOLOGÍAS DE DESARROLLO DE SOFTWARE	6
16	COMP-A0I02	SISTEMAS OPERATIVOS	4
17	EXCT-A0402	MÉTODOS NUMÉRICOS	4
18	COMP-A0F02	MODELOS DISCRETOS PARA INGENIERÍA	4
19	COMP-A0H02	SISTEMAS DE BASES DE DATOS	6
20	COMP-A0G03	FUNDAMENTOS DE SISTEMAS WEB	6
21	ELEE-A0344	REDES DE COMUNICACIONES	6
22	COMP-A0G05	INTERFACES Y MULTIMEDIA	4
23	COMP-A0I03	ADMINISTRACIÓN Y MANTENIMIENTO DE SISTEMAS	4
24	SEGD-A0000	LIDERAZGO	4
25	COMP-A0H03	GESTIÓN DE BASE DE DATOS	6
26	COMP-A0I05	APLICACIÓN DE SISTEMAS OPERATIVOS	6
27	COMP-A0I06	INTERNETWORKING	6
28	COMP-A0G08	APLICACIÓN DE TECNOLOGÍAS WEB	4
29	SEGD-A0101	REALIDAD NACIONAL Y GEOPOLÍTICA	4
30	COMP-A0G13	DESARROLLO WEB PARA LA INTEGRACIÓN DE TECNOLOGÍAS	6
31	COMP-A0H05	INTELIGENCIA ARTIFICIAL	6
32	COMP-A0K02	LECTURA Y ESCRITURA DE TEXTOS ACADÉMICOS	4
33	COMP-A0H06	MODELADO AVANZADO DE BASE DE DATOS	4
34	COMP-A0G14	PROGRAMACIÓN INTEGRATIVA DE COMPONENTES WEB	4
35	COMP-A0G20	PROGRAMACIÓN AVANZADA	6
36	COMP-A0G17	APLICACIONES DISTRIBUIDAS	6
37	COMP-A0I10	SEGURIDAD INFORMÁTICA	6
38	COMP-A0L04	DISEÑO Y EVALUACIÓN DE PROYECTOS TI	4
39	COMP-A0H07	MINERIA DE DATOS	4
40	COMP-A0L06	GESTIÓN DE LA SEGURIDAD INFORMÁTICA	6
41	COMP-A0G22	ARQUITECTURA DE SOFTWARE	6
42	COMP-A0I11	TECNOLOGÍAS EMERGENTES	4
43	CADM-A0G00	GESTIÓN Y EMPRENDIMIENTO	4
44	COMP-A0K04	MIC - PI PROFESIONALIZANTE	11
45	COMP-EFC01	EXAMEN FIN DE CARRERA	11
\.


--
-- Data for Name: carreras; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carreras (id, codigo, nombre, facultad, campus, id_sede) FROM stdin;
1	TECINFO	Tecnología de la Información	Ciencias de la Ingeniería	Santo Domingo	1
\.


--
-- Data for Name: categorias_objetos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categorias_objetos (id, nombre, icono, descripcion) FROM stdin;
\.


--
-- Data for Name: disponibilidad_espacios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.disponibilidad_espacios (id, id_espacio, fecha, dia_semana, hora_inicio, hora_fin, disponible, motivo, created_at) FROM stdin;
\.


--
-- Data for Name: docentes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.docentes (id, nombre_completo, email, departamento, email_institucional) FROM stdin;
1	MARTÍNEZ CEPEDA VERÓNICA ISABEL	\N	\N	\N
2	VEGA QUIÑONEZ IVAN FRANCISCO	\N	\N	\N
3	VIVAS PASPUEL ATAL KUMAR	\N	\N	\N
4	NÚÑEZ AGURTO ALBERTO DANIEL	\N	\N	\N
5	BASTIDAS CHALAN RODRIGO VLADIMIR	\N	\N	\N
6	LOPEZ LOPEZ ANDREA MARGARITA	\N	\N	\N
7	BENAVIDES ASTUDILLO DIEGO EDUARDO	\N	\N	\N
8	CORONEL GUERRERO CHRISTIAN ALFREDO	\N	\N	\N
9	ORTIZ DELGADO LUIS ARMANDO	\N	\N	\N
10	BUSTOS GANCHOZO OSCAR FERNANDO	\N	\N	\N
11	GALARZA SANCHEZ PAULO CESAR	\N	\N	\N
12	JÁCOME GÓMEZ LEONARDO RAFAEL	\N	\N	\N
13	NINABANDA ARELLANO NELSON	\N	\N	\N
14	CEVALLOS FARÍAS JAVIER JOSÉ	\N	\N	\N
16	MORENO MUÑOZ MARIO DIDÁN	\N	\N	\N
17	CRUZ GARZÓN JOHN JAVIER	\N	\N	\N
19	SUASNAVAS FLORES DARWIN FRANCISCO	\N	\N	\N
20	VINUEZA ESCOBAR NELSON FERNANDO	\N	\N	\N
18	PUENTE PONCE PABLO FRANCISCO	\N	\N	ppuente@espe.edu.ec
15	CHUQUITARCO KEVIN JAIR	\N	\N	kjchuquitarko@espe.edu.ec
\.


--
-- Data for Name: espacios_academicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.espacios_academicos (id, codigo, nombre, id_tipo, capacidad, edificio, piso, ubicacion_detalle, estado, tiene_proyector, tiene_computadoras, tiene_aire_acondicionado, imagen_url, created_at, updated_at) FROM stdin;
18	CD-ENLINEA	CD-En Línea	3	\N	\N	\N	\N	disponible	f	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
1	AULA-A	Aula A	1	40	Bloque 1	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
2	AULA-A01	Aula A01	1	40	Bloque 1	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
3	AULA-A02	Aula A02	1	40	Bloque 1	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
4	AULA-A09	Aula A09	1	40	Bloque 1	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
5	AULA-A10	Aula A10	1	40	Bloque 1	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
6	AULA-A11	Aula A11	1	40	Bloque 2	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
7	AULA-A12	Aula A12	1	40	Bloque 2	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
8	AULA-A13	Aula A13	1	40	Bloque 2	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
9	AULA-A14	Aula A14	1	40	Bloque 2	\N	\N	disponible	t	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
17	LAB-QUIM	Lab Química	2	25	Bloque 2	\N	\N	disponible	f	f	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
10	LAB-DCCO01	Lab DCCO 01	2	30	Bloque 1	\N	\N	disponible	t	t	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
11	LAB-DCCO02	Lab DCCO 02	2	30	Bloque 1	\N	\N	disponible	t	t	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
12	LAB-DCCO03	Lab DCCO 03	2	30	Bloque 1	\N	\N	disponible	t	t	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
16	LAB-DCCO2	Lab DCCO 2	2	30	Bloque 1	\N	\N	disponible	t	t	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
13	LAB-DCCO04	Lab DCCO 04	2	30	Bloque 2	\N	\N	disponible	t	t	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
14	LAB-DCCO05	Lab DCCO 05	2	30	Bloque 2	\N	\N	disponible	t	t	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
15	LAB-DCCO06	Lab DCCO 06	2	30	Bloque 2	\N	\N	disponible	t	t	f	\N	2026-07-27 23:35:10.152091	2026-07-27 23:35:10.152091
\.


--
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.horarios (id, id_nrc, id_espacio, dia_semana, hora_inicio, hora_fin, es_virtual) FROM stdin;
1	1	3	1	07:00:00	09:00:00	f
2	1	3	2	07:00:00	09:00:00	f
3	1	3	3	07:00:00	09:00:00	f
4	2	5	1	09:00:00	11:00:00	f
5	2	5	2	09:00:00	11:00:00	f
6	3	13	1	11:00:00	13:00:00	f
7	3	13	2	11:00:00	13:00:00	f
8	3	13	3	11:00:00	13:00:00	f
9	4	1	1	09:00:00	11:00:00	f
10	4	1	2	09:00:00	11:00:00	f
11	5	6	3	13:00:00	16:00:00	f
12	6	17	4	13:00:00	16:00:00	f
13	6	8	4	13:00:00	16:00:00	f
14	8	11	1	07:00:00	09:00:00	f
15	8	11	2	07:00:00	09:00:00	f
16	8	11	3	07:00:00	09:00:00	f
17	9	10	1	09:00:00	11:00:00	f
18	9	10	2	09:00:00	11:00:00	f
19	9	10	3	09:00:00	11:00:00	f
20	10	3	1	07:00:00	09:00:00	f
21	10	7	2	07:00:00	09:00:00	f
22	11	2	1	09:00:00	11:00:00	f
23	11	2	2	09:00:00	11:00:00	f
24	12	9	1	11:00:00	13:00:00	f
25	12	9	2	11:00:00	13:00:00	f
26	13	16	3	13:00:00	15:00:00	f
27	13	16	4	13:00:00	15:00:00	f
28	13	16	5	13:00:00	15:00:00	f
29	14	12	1	11:00:00	13:00:00	f
30	14	12	2	11:00:00	13:00:00	f
31	14	12	3	11:00:00	13:00:00	f
32	15	7	1	07:00:00	09:00:00	f
33	15	8	2	09:00:00	11:00:00	f
34	16	4	1	09:00:00	11:00:00	f
35	16	3	2	09:00:00	11:00:00	f
36	17	2	1	11:00:00	13:00:00	f
37	17	2	2	11:00:00	13:00:00	f
38	18	4	1	07:00:00	09:00:00	f
39	18	4	2	07:00:00	09:00:00	f
40	18	15	3	07:00:00	09:00:00	f
41	19	11	1	09:00:00	11:00:00	f
42	19	11	2	09:00:00	11:00:00	f
43	19	11	3	09:00:00	11:00:00	f
44	20	11	1	11:00:00	13:00:00	f
45	20	11	2	11:00:00	13:00:00	f
46	20	11	3	11:00:00	13:00:00	f
47	21	10	1	07:00:00	09:00:00	f
48	21	10	2	07:00:00	09:00:00	f
49	22	9	1	09:00:00	11:00:00	f
50	22	14	2	09:00:00	11:00:00	f
51	23	11	1	11:00:00	13:00:00	f
52	23	11	2	11:00:00	13:00:00	f
53	24	12	1	07:00:00	09:00:00	f
54	24	12	2	07:00:00	09:00:00	f
55	24	12	3	07:00:00	09:00:00	f
56	25	12	1	09:00:00	11:00:00	f
57	25	12	2	09:00:00	11:00:00	f
58	25	12	3	09:00:00	11:00:00	f
59	26	10	1	13:00:00	15:00:00	f
60	26	10	2	13:00:00	15:00:00	f
61	26	10	3	13:00:00	15:00:00	f
62	27	11	1	07:00:00	09:00:00	f
63	27	11	2	07:00:00	09:00:00	f
64	28	11	1	09:00:00	11:00:00	f
65	28	11	2	09:00:00	11:00:00	f
66	30	14	1	09:00:00	11:00:00	f
67	30	14	2	09:00:00	11:00:00	f
68	30	14	3	09:00:00	11:00:00	f
69	31	13	1	07:00:00	09:00:00	f
70	31	13	2	07:00:00	09:00:00	f
71	31	13	3	07:00:00	09:00:00	f
72	32	10	1	11:00:00	13:00:00	f
73	32	10	2	11:00:00	13:00:00	f
74	32	10	3	11:00:00	13:00:00	f
75	33	10	1	09:00:00	11:00:00	f
76	33	10	2	09:00:00	11:00:00	f
77	35	14	1	07:00:00	09:00:00	f
78	35	14	2	07:00:00	09:00:00	f
79	35	14	3	07:00:00	09:00:00	f
80	36	13	1	09:00:00	11:00:00	f
81	36	13	2	09:00:00	11:00:00	f
82	36	13	3	09:00:00	11:00:00	f
83	37	12	1	07:00:00	09:00:00	f
84	37	12	2	07:00:00	09:00:00	f
85	38	14	1	11:00:00	13:00:00	f
86	38	14	2	11:00:00	13:00:00	f
87	39	12	1	09:00:00	11:00:00	f
88	39	12	2	09:00:00	11:00:00	f
89	40	12	3	13:00:00	15:00:00	f
90	40	12	4	13:00:00	15:00:00	f
91	40	12	5	13:00:00	15:00:00	f
92	41	10	1	11:00:00	13:00:00	f
93	41	10	2	11:00:00	13:00:00	f
94	41	14	3	11:00:00	13:00:00	f
95	42	10	1	07:00:00	09:00:00	f
96	42	10	2	07:00:00	09:00:00	f
97	42	10	3	07:00:00	09:00:00	f
98	43	13	1	09:00:00	11:00:00	f
99	43	13	2	09:00:00	11:00:00	f
100	44	13	1	07:00:00	09:00:00	f
101	44	13	2	07:00:00	09:00:00	f
102	45	15	1	11:00:00	13:00:00	f
103	45	15	2	11:00:00	13:00:00	f
104	45	15	3	11:00:00	13:00:00	f
105	46	15	1	09:00:00	11:00:00	f
106	46	15	2	09:00:00	11:00:00	f
107	46	15	3	09:00:00	11:00:00	f
108	47	12	1	11:00:00	13:00:00	f
109	47	12	2	11:00:00	13:00:00	f
110	48	18	4	15:00:00	17:00:00	t
111	48	18	5	15:00:00	17:00:00	t
112	1	3	4	07:00:00	09:00:00	f
113	1	3	5	07:00:00	09:00:00	f
114	2	5	4	09:00:00	11:00:00	f
115	2	5	5	09:00:00	11:00:00	f
116	3	13	4	11:00:00	13:00:00	f
117	3	13	5	11:00:00	13:00:00	f
118	4	1	4	09:00:00	11:00:00	f
119	4	1	5	09:00:00	11:00:00	f
120	8	11	4	07:00:00	09:00:00	f
121	8	11	5	07:00:00	09:00:00	f
122	9	10	4	09:00:00	11:00:00	f
123	9	10	5	09:00:00	11:00:00	f
124	10	3	4	07:00:00	09:00:00	f
125	10	3	5	07:00:00	09:00:00	f
126	11	2	4	09:00:00	11:00:00	f
127	11	2	5	09:00:00	11:00:00	f
128	12	9	4	11:00:00	13:00:00	f
129	12	9	5	11:00:00	13:00:00	f
130	13	16	1	13:00:00	15:00:00	f
131	13	16	2	13:00:00	15:00:00	f
132	14	12	4	11:00:00	13:00:00	f
133	14	12	5	11:00:00	13:00:00	f
134	15	8	4	09:00:00	11:00:00	f
135	15	7	5	07:00:00	09:00:00	f
136	16	3	4	09:00:00	11:00:00	f
137	16	4	5	09:00:00	11:00:00	f
138	17	2	4	11:00:00	13:00:00	f
139	17	2	5	11:00:00	13:00:00	f
140	18	4	4	07:00:00	09:00:00	f
141	18	15	5	07:00:00	09:00:00	f
142	19	11	4	09:00:00	11:00:00	f
143	19	11	5	09:00:00	11:00:00	f
144	20	11	4	11:00:00	13:00:00	f
145	20	11	5	11:00:00	13:00:00	f
146	21	10	4	07:00:00	09:00:00	f
147	21	10	5	07:00:00	09:00:00	f
148	22	9	4	09:00:00	11:00:00	f
149	22	9	5	09:00:00	11:00:00	f
150	23	11	4	11:00:00	13:00:00	f
151	23	11	5	11:00:00	13:00:00	f
152	24	12	4	07:00:00	09:00:00	f
153	24	12	5	07:00:00	09:00:00	f
154	25	12	4	09:00:00	11:00:00	f
155	25	12	5	09:00:00	11:00:00	f
156	26	10	4	13:00:00	15:00:00	f
157	26	10	5	13:00:00	15:00:00	f
158	27	11	4	07:00:00	09:00:00	f
159	27	11	5	07:00:00	09:00:00	f
160	28	11	4	09:00:00	11:00:00	f
161	28	11	5	09:00:00	11:00:00	f
162	30	14	4	09:00:00	11:00:00	f
163	30	14	5	09:00:00	11:00:00	f
164	31	13	4	07:00:00	09:00:00	f
165	31	13	5	07:00:00	09:00:00	f
166	32	10	4	11:00:00	13:00:00	f
167	32	10	5	11:00:00	13:00:00	f
168	33	10	4	09:00:00	11:00:00	f
169	33	10	5	09:00:00	11:00:00	f
170	35	14	4	07:00:00	09:00:00	f
171	35	14	5	07:00:00	09:00:00	f
172	36	13	4	09:00:00	11:00:00	f
173	36	13	5	09:00:00	11:00:00	f
174	37	12	4	07:00:00	09:00:00	f
175	37	12	5	07:00:00	09:00:00	f
176	38	14	4	11:00:00	13:00:00	f
177	38	14	5	11:00:00	13:00:00	f
178	39	12	4	09:00:00	11:00:00	f
179	39	12	5	09:00:00	11:00:00	f
180	40	12	1	13:00:00	15:00:00	f
181	40	12	2	13:00:00	15:00:00	f
182	41	10	4	11:00:00	13:00:00	f
183	41	10	5	11:00:00	13:00:00	f
184	45	15	4	11:00:00	13:00:00	f
185	45	15	5	11:00:00	13:00:00	f
186	46	15	4	09:00:00	11:00:00	f
187	46	15	5	09:00:00	11:00:00	f
188	47	12	4	11:00:00	13:00:00	f
189	47	12	5	11:00:00	13:00:00	f
190	48	18	1	15:00:00	17:00:00	t
191	48	18	2	15:00:00	17:00:00	t
192	48	18	3	15:00:00	17:00:00	t
193	42	10	4	07:00:00	09:00:00	f
194	42	10	5	07:00:00	09:00:00	f
195	43	13	4	09:00:00	11:00:00	f
196	43	13	5	09:00:00	11:00:00	f
197	44	13	4	07:00:00	09:00:00	f
198	44	13	5	07:00:00	09:00:00	f
\.


--
-- Data for Name: matriculas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.matriculas (id, id_usuario, id_nrc, id_periodo, estado) FROM stdin;
1	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	19	1	activa
2	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	21	1	activa
3	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	22	1	activa
4	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	20	1	activa
73	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	18	1	activa
74	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	23	1	activa
105	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	2	1	activa
106	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	29	1	activa
107	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	27	1	activa
108	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	1	1	activa
\.


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notificaciones (id, id_usuario, titulo, mensaje, categoria, leido, referencia_tipo, referencia_id, created_at) FROM stdin;
1	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	Reserva Aprobada	Tu reserva para el Tue Jul 28 2026 00:00:00 GMT-0500 (hora de Ecuador) (11:00-13:00) fue aprobada.	reserva	f	reserva	5	2026-07-28 00:53:56.803556
2	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	Reserva Aprobada	Tu reserva para el Wed Jul 29 2026 00:00:00 GMT-0500 (hora de Ecuador) (15:00-17:00) fue aprobada.	reserva	f	reserva	4	2026-07-28 00:53:58.280936
\.


--
-- Data for Name: nrc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.nrc (id, nrc, id_asignatura, id_docente, id_periodo, id_carrera, nivel_pao, paralelo) FROM stdin;
1	29447	1	13	1	1	PAO 1	A
2	29430	2	5	1	1	PAO 1	A
3	31375	3	17	1	1	PAO 1	A
4	28897	4	12	1	1	PAO 1	A
5	29469	5	19	1	1	PAO 1	A
6	29483	6	19	1	1	PAO 1	A
7	30541	7	\N	1	1	PAO 1	A
8	31377	8	1	1	1	PAO 2	A
9	29557	9	6	1	1	PAO 2	A
10	29529	10	3	1	1	PAO 2	A
11	29526	11	20	1	1	PAO 2	A
12	29498	12	10	1	1	PAO 2	A
13	31378	8	18	1	1	PAO 2	B
14	29558	9	\N	1	1	PAO 2	B
15	29500	12	2	1	1	PAO 2	B
16	29530	10	3	1	1	PAO 2	B
17	30380	11	20	1	1	PAO 2	B
18	29523	13	3	1	1	PAO 3	A
19	31379	14	18	1	1	PAO 3	A
20	29531	15	15	1	1	PAO 3	A
21	29533	16	8	1	1	PAO 3	A
22	29528	17	5	1	1	PAO 3	A
23	29532	18	14	1	1	PAO 3	A
24	31374	19	9	1	1	PAO 4	A
25	29535	20	\N	1	1	PAO 4	A
26	30875	21	\N	1	1	PAO 4	A
27	29534	22	18	1	1	PAO 4	A
28	29536	23	8	1	1	PAO 4	A
29	29921	24	\N	1	1	PAO 4	A
30	29537	25	9	1	1	PAO 5	A
31	29539	26	\N	1	1	PAO 5	A
32	29540	27	4	1	1	PAO 5	A
33	29538	28	\N	1	1	PAO 5	A
34	30652	29	\N	1	1	PAO 5	A
35	29543	30	\N	1	1	PAO 6	A
36	29541	31	7	1	1	PAO 6	A
37	29545	32	4	1	1	PAO 6	A
38	29542	33	9	1	1	PAO 6	A
39	29544	34	15	1	1	PAO 6	A
40	29547	35	17	1	1	PAO 7	A
41	29546	36	\N	1	1	PAO 7	A
42	30873	37	4	1	1	PAO 8	A
43	29548	38	14	1	1	PAO 8	A
44	29549	39	7	1	1	PAO 8	A
45	29552	40	14	1	1	PAO 8	A
46	29551	41	15	1	1	PAO 8	A
47	30874	42	\N	1	1	PAO 8	A
48	28504	43	16	1	1	PAO 8	A
49	31359	44	\N	1	1	UIC	CB
50	31360	44	\N	1	1	UIC	C2
51	31361	45	\N	1	1	UIC	A
52	30965	44	7	1	1	UIC	TUTOR-2
53	30967	44	8	1	1	UIC	TUTOR-2
54	30968	44	11	1	1	UIC	TUTOR-2
55	32065	44	6	1	1	UIC	TUTOR-2
56	30969	44	4	1	1	UIC	TUTOR-1
57	30971	44	15	1	1	UIC	TUTOR-1
58	30972	44	18	1	1	UIC	TUTOR-1
\.


--
-- Data for Name: objetos_perdidos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.objetos_perdidos (id, titulo, descripcion, id_categoria, tipo, estado, ubicacion, fecha_reporte, fecha_evento, imagenes_url, id_reportante, informacion_contacto, es_reclamado, id_reclamante, fecha_reclamo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: periodos_academicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.periodos_academicos (id, codigo, nombre, fecha_inicio, fecha_fin, activo) FROM stdin;
1	202650	202650 - MARZO 2026 - AGOSTO 2026	2026-03-01	2026-08-31	t
\.


--
-- Data for Name: push_subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.push_subscriptions (id, id_usuario, endpoint, p256dh, auth, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reservas_espacios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservas_espacios (id, id_espacio, id_usuario, fecha, hora_inicio, hora_fin, motivo, estado, created_at, id_periodo, id_nrc, tipo_actividad, comentario_admin, aprobado_por, fecha_revision) FROM stdin;
2	1	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	2026-07-28	14:00:00	16:00:00	bhnjmk,.QZxrctvybuj	rechazada	2026-07-27 23:36:08.186746	\N	\N	\N	\N	\N	\N
1	10	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	2026-07-29	20:00:00	21:00:00	Prueba tarde	cancelada	2026-07-27 23:35:46.507912	\N	\N	\N	\N	\N	\N
3	1	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	2026-07-29	15:00:00	17:00:00	Prueba de reserva con nuevas validaciones	cancelada	2026-07-28 00:10:29.744366	\N	\N	\N	\N	\N	\N
5	16	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	2026-07-28	11:00:00	13:00:00	ertyedfr werty	aprobada	2026-07-28 00:44:52.696439	1	\N	\N	\N	142d53e9-b063-4f91-8e00-3d2c59fe4350	2026-07-28 00:53:56.785511
4	1	66b869e1-78d6-4f55-ad44-59d5d45ec4cb	2026-07-29	15:00:00	17:00:00	Prueba final - test completo	aprobada	2026-07-28 00:13:33.888201	1	\N	\N	\N	142d53e9-b063-4f91-8e00-3d2c59fe4350	2026-07-28 00:53:58.266005
\.


--
-- Data for Name: sedes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sedes (id, codigo, nombre) FROM stdin;
1	SD	Santo Domingo de los Tsáchilas
\.


--
-- Data for Name: tipos_espacio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tipos_espacio (id, nombre, descripcion, icono) FROM stdin;
1	Aula	Aula de clases teórica	\N
2	Laboratorio	Laboratorio de cómputo / prácticas	\N
3	Virtual	En línea - sincrónico	\N
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, email, password_hash, nombre_completo, rol, avatar_url, telefono, created_at, updated_at, codigo_estudiante, id_carrera, nivel_pao, id_docente, id_periodo_activo) FROM stdin;
c16975ab-32dc-4353-9bca-28b87b8201ad	ppuente@espe.edu.ec	$2b$10$bm1b6WZaNzGizrEtsAnDjeNDUvLsmoR2kfVQfH5N86gkpUm.CL.N.	Pablo Francisco Puente Ponce	docente	\N	\N	2026-07-28 00:02:32.532465	2026-07-28 00:02:32.532465	\N	1	\N	18	1
7d909611-41c1-4b6c-8290-0de83912d312	kjchuquitarko@espe.edu.ec	$2b$10$wlstQNaWJguAOvTijBZuDuWWTKqmqJ5cGzyHZwLsxYQPFxq/f4/AS	Kevin Jair Chuquitarko	docente	\N	\N	2026-07-28 00:58:49.186414	2026-07-28 00:58:49.186414	\N	1	\N	15	1
de550c4f-1e4e-4a3c-b7d1-66fd4d81e689	test@espe.edu.ec	$2b$10$yRRD3kK.aD2nWEx3NnUw.uNLSHQ3KZ0eNdmGatTvvzfBNcNcx2bzu	Admin ESPE	admin	\N	\N	2026-07-27 23:15:35.705895	2026-07-27 23:15:35.705895	\N	\N	\N	\N	\N
66b869e1-78d6-4f55-ad44-59d5d45ec4cb	ceandrade@espe.edu.ec	$2b$10$2FQ4nxZz7.iupfi3TH9PQO99uwxePjxNsngsI8aXalXJR.ucSnPD6	Carlos Eduardo Andrade Paredes	estudiante	\N	\N	2026-07-27 23:15:35.705895	2026-07-27 23:15:35.705895	L00394857	1	3	\N	1
142d53e9-b063-4f91-8e00-3d2c59fe4350	admin@espe.edu.ec	$2b$10$itzM4nQHYeUqc1jaL6JZmuSU8W9/KOFOjyAPr4DnqKMjIIk.lrR8i	Administrador ESPEConnect	admin	\N	\N	2026-07-27 23:16:01.500344	2026-07-27 23:16:01.500344	\N	\N	\N	\N	\N
\.


--
-- Name: asignaturas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asignaturas_id_seq', 45, true);


--
-- Name: carreras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carreras_id_seq', 1, true);


--
-- Name: categorias_objetos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categorias_objetos_id_seq', 1, false);


--
-- Name: disponibilidad_espacios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.disponibilidad_espacios_id_seq', 1, false);


--
-- Name: docentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.docentes_id_seq', 20, true);


--
-- Name: espacios_academicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.espacios_academicos_id_seq', 18, true);


--
-- Name: horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.horarios_id_seq', 198, true);


--
-- Name: matriculas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.matriculas_id_seq', 210, true);


--
-- Name: notificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notificaciones_id_seq', 2, true);


--
-- Name: nrc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nrc_id_seq', 58, true);


--
-- Name: objetos_perdidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.objetos_perdidos_id_seq', 1, false);


--
-- Name: periodos_academicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.periodos_academicos_id_seq', 1, true);


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.push_subscriptions_id_seq', 1, false);


--
-- Name: reservas_espacios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reservas_espacios_id_seq', 5, true);


--
-- Name: sedes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sedes_id_seq', 39, true);


--
-- Name: tipos_espacio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tipos_espacio_id_seq', 3, true);


--
-- Name: asignaturas asignaturas_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_codigo_key UNIQUE (codigo);


--
-- Name: asignaturas asignaturas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_pkey PRIMARY KEY (id);


--
-- Name: carreras carreras_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_codigo_key UNIQUE (codigo);


--
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (id);


--
-- Name: categorias_objetos categorias_objetos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias_objetos
    ADD CONSTRAINT categorias_objetos_pkey PRIMARY KEY (id);


--
-- Name: disponibilidad_espacios disponibilidad_espacios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disponibilidad_espacios
    ADD CONSTRAINT disponibilidad_espacios_pkey PRIMARY KEY (id);


--
-- Name: docentes docentes_nombre_completo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_nombre_completo_key UNIQUE (nombre_completo);


--
-- Name: docentes docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_pkey PRIMARY KEY (id);


--
-- Name: espacios_academicos espacios_academicos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.espacios_academicos
    ADD CONSTRAINT espacios_academicos_codigo_key UNIQUE (codigo);


--
-- Name: espacios_academicos espacios_academicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.espacios_academicos
    ADD CONSTRAINT espacios_academicos_pkey PRIMARY KEY (id);


--
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id);


--
-- Name: matriculas matriculas_id_usuario_id_nrc_id_periodo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_id_usuario_id_nrc_id_periodo_key UNIQUE (id_usuario, id_nrc, id_periodo);


--
-- Name: matriculas matriculas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_pkey PRIMARY KEY (id);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- Name: nrc nrc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nrc
    ADD CONSTRAINT nrc_pkey PRIMARY KEY (id);


--
-- Name: objetos_perdidos objetos_perdidos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.objetos_perdidos
    ADD CONSTRAINT objetos_perdidos_pkey PRIMARY KEY (id);


--
-- Name: periodos_academicos periodos_academicos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periodos_academicos
    ADD CONSTRAINT periodos_academicos_codigo_key UNIQUE (codigo);


--
-- Name: periodos_academicos periodos_academicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periodos_academicos
    ADD CONSTRAINT periodos_academicos_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions push_subscriptions_endpoint_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_endpoint_key UNIQUE (endpoint);


--
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: reservas_espacios reservas_espacios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas_espacios
    ADD CONSTRAINT reservas_espacios_pkey PRIMARY KEY (id);


--
-- Name: sedes sedes_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sedes
    ADD CONSTRAINT sedes_codigo_key UNIQUE (codigo);


--
-- Name: sedes sedes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sedes
    ADD CONSTRAINT sedes_pkey PRIMARY KEY (id);


--
-- Name: tipos_espacio tipos_espacio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_espacio
    ADD CONSTRAINT tipos_espacio_nombre_key UNIQUE (nombre);


--
-- Name: tipos_espacio tipos_espacio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_espacio
    ADD CONSTRAINT tipos_espacio_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_espacios_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_espacios_estado ON public.espacios_academicos USING btree (estado);


--
-- Name: idx_espacios_tipo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_espacios_tipo ON public.espacios_academicos USING btree (id_tipo);


--
-- Name: idx_horarios_dia; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_horarios_dia ON public.horarios USING btree (dia_semana);


--
-- Name: idx_horarios_espacio; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_horarios_espacio ON public.horarios USING btree (id_espacio);


--
-- Name: idx_matriculas_periodo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_matriculas_periodo ON public.matriculas USING btree (id_periodo);


--
-- Name: idx_matriculas_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_matriculas_usuario ON public.matriculas USING btree (id_usuario);


--
-- Name: idx_notificaciones_leido; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notificaciones_leido ON public.notificaciones USING btree (id_usuario, leido);


--
-- Name: idx_notificaciones_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notificaciones_usuario ON public.notificaciones USING btree (id_usuario);


--
-- Name: idx_nrc_asignatura; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nrc_asignatura ON public.nrc USING btree (id_asignatura);


--
-- Name: idx_nrc_periodo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nrc_periodo ON public.nrc USING btree (id_periodo);


--
-- Name: idx_objetos_categoria; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_objetos_categoria ON public.objetos_perdidos USING btree (id_categoria);


--
-- Name: idx_objetos_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_objetos_estado ON public.objetos_perdidos USING btree (estado);


--
-- Name: idx_objetos_tipo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_objetos_tipo ON public.objetos_perdidos USING btree (tipo);


--
-- Name: idx_push_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_push_usuario ON public.push_subscriptions USING btree (id_usuario);


--
-- Name: idx_reservas_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reservas_usuario ON public.reservas_espacios USING btree (id_usuario);


--
-- Name: uq_reserva_activa_exacta; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_reserva_activa_exacta ON public.reservas_espacios USING btree (id_espacio, fecha, hora_inicio, hora_fin) WHERE ((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aprobada'::character varying])::text[]));


--
-- Name: carreras carreras_id_sede_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_id_sede_fkey FOREIGN KEY (id_sede) REFERENCES public.sedes(id);


--
-- Name: matriculas matriculas_id_nrc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_id_nrc_fkey FOREIGN KEY (id_nrc) REFERENCES public.nrc(id);


--
-- Name: matriculas matriculas_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_academicos(id);


--
-- Name: matriculas matriculas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matriculas
    ADD CONSTRAINT matriculas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: notificaciones notificaciones_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: push_subscriptions push_subscriptions_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: reservas_espacios reservas_espacios_aprobado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas_espacios
    ADD CONSTRAINT reservas_espacios_aprobado_por_fkey FOREIGN KEY (aprobado_por) REFERENCES public.usuarios(id);


--
-- Name: reservas_espacios reservas_espacios_id_espacio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas_espacios
    ADD CONSTRAINT reservas_espacios_id_espacio_fkey FOREIGN KEY (id_espacio) REFERENCES public.espacios_academicos(id) ON DELETE CASCADE;


--
-- Name: reservas_espacios reservas_espacios_id_nrc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas_espacios
    ADD CONSTRAINT reservas_espacios_id_nrc_fkey FOREIGN KEY (id_nrc) REFERENCES public.nrc(id);


--
-- Name: reservas_espacios reservas_espacios_id_periodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas_espacios
    ADD CONSTRAINT reservas_espacios_id_periodo_fkey FOREIGN KEY (id_periodo) REFERENCES public.periodos_academicos(id);


--
-- Name: reservas_espacios reservas_espacios_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas_espacios
    ADD CONSTRAINT reservas_espacios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: usuarios usuarios_id_carrera_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_carrera_fkey FOREIGN KEY (id_carrera) REFERENCES public.carreras(id);


--
-- Name: usuarios usuarios_id_docente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.docentes(id);


--
-- Name: usuarios usuarios_id_periodo_activo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_periodo_activo_fkey FOREIGN KEY (id_periodo_activo) REFERENCES public.periodos_academicos(id);


--
-- PostgreSQL database dump complete
--

\unrestrict mmbwaPJ3A9q7OlU4iJdWZsiotympkHPzFkfYFylaW2mCloqwG2aEh1ATspkjHVe

