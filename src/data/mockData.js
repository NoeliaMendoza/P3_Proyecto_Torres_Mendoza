export const INITIAL_ESPACIOS = [
  {
    id: 1,
    nombre: 'Laboratorio de Computación Avanzada 101',
    tipo: 'Laboratorio',
    edificio: 'Edificio G - Sistemas',
    piso: 'Piso 1',
    capacidad: 35,
    estado: 'disponible',
    horario: '07:00 - 21:00',
    equipamiento: ['Computadores i7 16GB RAM', 'Proyector 4K', 'Aire Acondicionado', 'Pizarra Inteligente'],
    imagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    descripcion: 'Espacio equipado con estaciones de trabajo de alto rendimiento orientadas al desarrollo de software y computación gráfica.'
  },
  {
    id: 2,
    nombre: 'Auditorio General Coronel de la Torre',
    tipo: 'Auditorio',
    edificio: 'Edificio Central',
    piso: 'Piso 2',
    capacidad: 250,
    estado: 'ocupado',
    horario: '08:00 - 18:00',
    equipamiento: ['Sistema Audio Pro', 'Microfonía Inalámbrica', 'Escenario Principal', 'Proyector Doble'],
    imagen: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    descripcion: 'Auditorio institucional ideal para conferencias magistrales, simposios y eventos académicos de gran escala.'
  },
  {
    id: 3,
    nombre: 'Aula Inteligente 304',
    tipo: 'Aula',
    edificio: 'Edificio B - Ciencias Básicas',
    piso: 'Piso 3',
    capacidad: 40,
    estado: 'disponible',
    horario: '07:00 - 20:00',
    equipamiento: ['Pantalla Táctil 75"', 'Sillas Ergonómicas Móviles', 'Tomas Electrónicas por Asiento'],
    imagen: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    descripcion: 'Diseñada con mobiliario flexible para metodologías de aprendizaje activo y trabajo colaborativo.'
  },
  {
    id: 4,
    nombre: 'Sala de Estudio Grupal 02',
    tipo: 'Sala de Estudio',
    edificio: 'Biblioteca Central',
    piso: 'Piso 2',
    capacidad: 8,
    estado: 'disponible',
    horario: '08:00 - 20:00',
    equipamiento: ['TV 55" HDMI', 'Pizarra Acrílica Móvil', 'Aislamiento Acústico'],
    imagen: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    descripcion: 'Cubículo privado insonorizado para preparación de proyectos, trabajos grupales y tutorías.'
  },
  {
    id: 5,
    nombre: 'Laboratorio de Electrónica y Mechatrónica',
    tipo: 'Laboratorio',
    edificio: 'Edificio F - Ingenierías',
    piso: 'Piso 1',
    capacidad: 25,
    estado: 'mantenimiento',
    horario: '07:00 - 19:00',
    equipamiento: ['Osciloscopios Digitales', 'Fuentes Reguladas DC', 'Impresoras 3D', 'Estaciones de Soldadura'],
    imagen: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    descripcion: 'Laboratorio técnico con mesas de prueba para circuitos analógicos, digitales y desarrollo de prototipos.'
  },
  {
    id: 6,
    nombre: 'Sala de Videoconferencias Ejecutiva',
    tipo: 'Sala de Reuniones',
    edificio: 'Edificio Administrativo A',
    piso: 'Piso 4',
    capacidad: 16,
    estado: 'disponible',
    horario: '08:00 - 17:00',
    equipamiento: ['Sistema Logitech Rally 4K', 'Micrófonos Array de Techo', 'Doble Monitor 65"'],
    imagen: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    descripcion: 'Espacio de alta tecnología para conferencias web internacionales, defensas de tesis y reuniones directivas.'
  }
];

export const INITIAL_OBJETOS = [
  {
    id: 1,
    nombre: 'Mochila Targus Negra con Computadora',
    categoria: 'Mochilas y Bolsos',
    tipo: 'perdido',
    estado: 'Perdido',
    fecha: '2026-07-25',
    lugar: 'Biblioteca Central - 2do Piso',
    descripcion: 'Mochila negra con cierre rojo. Contiene cuaderno de apuntes y cargador de laptop.',
    imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    reportante_nombre: 'Carlos Andrade',
    reportante_contacto: 'ceandrade@espe.edu.ec'
  },
  {
    id: 2,
    nombre: 'Calculadora Científica Casio FX-991EX',
    categoria: 'Electrónica',
    tipo: 'encontrado',
    estado: 'En custodia',
    fecha: '2026-07-26',
    lugar: 'Edificio G - Aula 102',
    descripcion: 'Calculadora color negro con tapa solar. Olvidada sobre el escritorio del docente.',
    imagen: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?auto=format&fit=crop&w=800&q=80',
    reportante_nombre: 'Recepción Edificio G',
    reportante_contacto: 'recepcion_g@espe.edu.ec'
  },
  {
    id: 3,
    nombre: 'Carnet Estudiantil ESPE',
    categoria: 'Documentos',
    tipo: 'encontrado',
    estado: 'En custodia',
    fecha: '2026-07-27',
    lugar: 'Cafetería Central',
    descripcion: 'Carnet de estudiante a nombre de Mateo Morales, Ingeniería Mecánica.',
    imagen: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    reportante_nombre: 'Seguridad Campus',
    reportante_contacto: 'seguridad@espe.edu.ec'
  },
  {
    id: 4,
    nombre: 'Audífonos Inalámbricos Sony WH-1000XM4',
    categoria: 'Electrónica',
    tipo: 'perdido',
    estado: 'Perdido',
    fecha: '2026-07-24',
    lugar: 'Canchas Polideportivas',
    descripcion: 'Audífonos over-ear color negro en funda de transporte rígida.',
    imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    reportante_nombre: 'Sofia Vargas',
    reportante_contacto: 'stvargas@espe.edu.ec'
  },
  {
    id: 5,
    nombre: 'Llaves de Vehículo con Llavero Institucional',
    categoria: 'Accesorios',
    tipo: 'encontrado',
    estado: 'En custodia',
    fecha: '2026-07-26',
    lugar: 'Estacionamiento de Estudiantes',
    descripcion: 'Juego de 3 llaves con control remoto y llavero acrílico verde de la ESPE.',
    imagen: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    reportante_nombre: 'Guardia Portón 2',
    reportante_contacto: 'seguridad_p2@espe.edu.ec'
  }
];

export const INITIAL_NOTIFICACIONES = [
  {
    id: 1,
    titulo: 'Reserva Aprobada',
    mensaje: 'Tu solicitud para el Laboratorio de Computación Avanzada 101 ha sido confirmada para hoy de 15:00 a 17:00.',
    fecha: 'Hace 15 min',
    categoria: 'reserva',
    leido: false
  },
  {
    id: 2,
    titulo: 'Objeto Coincidente Registrado',
    mensaje: 'Se ha reportado un Carnet Estudiantil en Cafetería Central que coincide con tus alertas.',
    fecha: 'Hace 1 hora',
    categoria: 'objeto',
    leido: false
  },
  {
    id: 3,
    titulo: 'Recordatorio de Actividad',
    mensaje: 'Mañana tienes una reserva programada en Sala de Estudio Grupal 02 a las 09:00 AM.',
    fecha: 'Hace 4 horas',
    categoria: 'sistema',
    leido: true
  },
  {
    id: 4,
    titulo: 'Actualización de Mantenimiento',
    mensaje: 'El Laboratorio F-101 ha ingresado en mantenimiento preventivo hasta el 29 de Julio.',
    fecha: 'Hace 1 día',
    categoria: 'sistema',
    leido: true
  }
];

export const MOCK_STUDENT_PROFILE = {
  nombre: 'Carlos Eduardo Andrade Paredes',
  idEspe: 'L00394857',
  correo: 'ceandrade@espe.edu.ec',
  carrera: 'Ingeniería en Software',
  departamento: 'Departamento de Ciencias de la Computación',
  semestre: '7mo Semestre',

  campus: 'Sangolquí - Matriz',
  rol: 'estudiante',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  telefono: '+593 99 876 5432',
  fechaIngreso: 'Octubre 2022'
};

export const MOCK_RESERVAS_HISTORIAL = [
  {
    id: 'RES-8492',
    espacioNombre: 'Laboratorio de Computación Avanzada 101',
    fecha: '2026-07-27',
    horario: '15:00 - 17:00',
    estado: 'Aprobada',
    motivo: 'Desarrollo de Proyecto Integrador de Software Web'
  },
  {
    id: 'RES-7210',
    espacioNombre: 'Sala de Estudio Grupal 02',
    fecha: '2026-07-20',
    horario: '10:00 - 12:00',
    estado: 'Completada',
    motivo: 'Estudio para examen de Inteligencia Artificial'
  },
  {
    id: 'RES-6104',
    espacioNombre: 'Aula Inteligente 304',
    fecha: '2026-07-12',
    horario: '14:00 - 16:00',
    estado: 'Completada',
    motivo: 'Tutoría de Algoritmos Avanzados'
  }
];
