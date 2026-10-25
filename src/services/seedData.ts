import { 
  UserProfile, 
  Package, 
  PackageMovement, 
  SessionRecord, 
  PersonalNote, 
  SelfCareResource, 
  ServiceOrGathering, 
  ReferralLead 
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-seres',
    email: 'centroseresmed@gmail.com',
    fullName: 'Administradora SERES',
    phone: '',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PACKAGES: Package[] = [];
export const INITIAL_PACKAGE_MOVEMENTS: PackageMovement[] = [];
export const INITIAL_SESSIONS: SessionRecord[] = [];
export const INITIAL_PERSONAL_NOTES: PersonalNote[] = [];

export const INITIAL_SELF_CARE_RESOURCES: SelfCareResource[] = [
  {
    id: 'res-001',
    title: 'Respiración Consciente: Calma y Regulación Somática',
    slug: 'respiracion-consciente-calma',
    category: 'breathing',
    categoryLabel: 'Respiración consciente',
    description: 'Una práctica de ritmo respiratorio equilibrado para invitar al sistema nervioso a desacelerar suavemente y recobrar presencia.',
    practicalGoal: 'Favorecer una sensación de arraigo y relajación neuromuscular sin forzar el aire.',
    approxDurationMinutes: 5,
    stepByStepInstructions: [
      'Siéntate con la espalda cómoda y los pies apoyados con solidez en el piso.',
      'Lleva una mano suave sobre el pecho y la otra sobre la parte baja de tu vientre.',
      'Inhala de manera fluida y suave por la nariz durante 4 segundos.',
      'Exhala de forma pausada por la boca o nariz durante 4 a 6 segundos, soltando el peso de los hombros.',
      'Repite durante 8 a 10 ciclos completos manteniendo una actitud de curiosidad y descanso.'
    ],
    precautions: 'No fuerces la retención de aire ni inhales más de lo que sientas natural. Si experimentas mareo, regresa a tu ritmo espontáneo.',
    tags: ['Regulación', 'Calma', 'Respiración diafragmática', 'Pausa'],
    imageUrl: '/src/assets/images/seres_mindful_breathing_1792882554222.jpg',
    integrationQuestion: '¿Qué parte de tu cuerpo se siente un poco más espaciosa o relajada ahora?',
    isPublished: true,
  },
  {
    id: 'res-002',
    title: 'Descompresión Suave de Cervicales y Cintura Escapular',
    slug: 'descompresion-cervicales-escapular',
    category: 'movement',
    categoryLabel: 'Movimiento y estiramientos',
    description: 'Movimientos microscópicos y fluidos para aliviar la sensación de carga en cuello, trapecios y hombros tras periodos sentados.',
    practicalGoal: 'Aumentar la fluidez y el rango de movimiento suave sin crear dolor ni tirones bruscos.',
    approxDurationMinutes: 7,
    stepByStepInstructions: [
      'Colócate de pie o sentada con la columna erguida pero sin rigidez.',
      'Dibuja círculos muy lentos con ambos hombros hacia atrás, sintiendo cómo las escápulas resbalan sobre la espalda.',
      'Inclina con extrema suavidad la oreja derecha hacia el hombro derecho; deja que el brazo izquierdo descanse pesado hacia el suelo.',
      'Mantén 3 respiraciones tranquilas sin empujar la cabeza con las manos.',
      'Regresa lentamente al centro y repite hacia el lado izquierdo con la misma ternura.'
    ],
    precautions: 'Evita movimientos bruscos o tirones. No dejes caer la cabeza hacia atrás si tienes antecedentes cervicales o mareos.',
    tags: ['Cuello', 'Escápulas', 'Postura', 'Oficina'],
    imageUrl: '/src/assets/images/seres_movement_stretch_1792882554555.jpg',
    integrationQuestion: '¿Cómo cambia la sensación de ligereza en tu mirada al liberar la base del cráneo?',
    isPublished: true,
  },
  {
    id: 'res-003',
    title: 'Enraizamiento y Descanso de Espalda en el Suelo',
    slug: 'enraizamiento-descanso-suelo',
    category: 'body_connection',
    categoryLabel: 'Conexión corporal',
    description: 'Postura constructiva de descanso en el suelo para liberar compresión lumbar y permitir que el cuerpo sea sostenido por la gravedad.',
    practicalGoal: 'Descargar el tono muscular involuntario en la pelvis, sacro y columna vertebral.',
    approxDurationMinutes: 10,
    stepByStepInstructions: [
      'Tiéndete boca arriba sobre una alfombrilla o manta firme.',
      'Flexiona las rodillas y apoya las plantas de los pies en el suelo, separadas al ancho de tus caderas.',
      'Permite que los brazos descansen a los lados del torso con las palmas hacia arriba.',
      'Siente conscientemente cada punto de contacto: talones, sacro, parte media de la espalda y cabeza.',
      'Permanece aquí durante varios minutos, dejando que la respiración mueva suavemente el abdomen.'
    ],
    precautions: 'Si sientes molestia en el cuello, coloca una toalla doblada pequeña debajo de la cabeza para mantener la línea neutra.',
    tags: ['Espalda baja', 'Descanso', 'Gravedad', 'Arraigo'],
    imageUrl: '/src/assets/images/seres_hero_wellness_1792882552902.jpg',
    integrationQuestion: '¿Pudiste percibir cómo la tierra sostiene tu peso sin que tengas que hacer ningún esfuerzo?',
    isPublished: true,
  },
  {
    id: 'res-004',
    title: 'Espacio de Reconocimiento y Acompañamiento Emocional',
    slug: 'reconocimiento-acompanamiento-emocional',
    category: 'emotional_awareness',
    categoryLabel: 'Reconocimiento y acompañamiento emocional',
    description: 'Una guía respetuosa para notar las sensaciones presentes en el cuerpo sin juzgarlas, analizarlas ni apresurarse a cambiarlas.',
    practicalGoal: 'Cultivar presencia amable hacia lo que surge en el momento, sin diagnóstico ni exigencias.',
    approxDurationMinutes: 8,
    stepByStepInstructions: [
      'Ponte en una posición acogedora y regálate permiso para detener lo que estabas haciendo.',
      'Pregúntate con suavidad: "¿Qué sensaciones físicas están presentes en este instante en mi cuerpo?"',
      'Nota si hay calor, frescura, opresión o ligereza, sin intentar corregir nada.',
      'Pon una mano en señal de saludo cálido sobre la zona donde sientas mayor sensación.',
      'Inhala y exhala despacio permitiendo que la sensación tenga espacio para ser.'
    ],
    precautions: 'Esta práctica no sustituye atención médica ni psicológica.',
    tags: ['Amabilidad', 'Presencia', 'Autocompasión', 'Escucha'],
    imageUrl: '/src/assets/images/seres_mindful_breathing_1792882554222.jpg',
    integrationQuestion: '¿Qué palabra describe con mayor honestidad tu estado interior en este instante?',
    isPublished: true,
  },
  {
    id: 'res-005',
    title: 'Pausa Consciente: 3 Respiraciones de Regreso a Casa',
    slug: 'pausa-3-respiraciones',
    category: 'conscious_pauses',
    categoryLabel: 'Pausas conscientes',
    description: 'Un micro-recurso de 3 minutos diseñado para intercalar entre reuniones, llamadas o tareas cotidianas.',
    practicalGoal: 'Romper la inercia del piloto automático y reanudar actividades con mayor claridad.',
    stepByStepInstructions: [
      'Aparta las manos del teclado o pantalla.',
      'Respiración 1: Inhala notando el aire fresco en la nariz. Exhala soltando la mandíbula y el entrecejo.',
      'Respiración 2: Inhala sintiendo la expansión del pecho. Exhala dejando caer los hombros 2 centímetros.',
      'Respiración 3: Inhala notando la vida en todo tu cuerpo. Exhala con gratitud hacia ti misma.',
      'Retoma lo que hacías con un ritmo sereno.'
    ],
    approxDurationMinutes: 3,
    precautions: 'Ideal para realizar 2 a 3 veces al día durante la jornada laboral.',
    tags: ['Micro-pausa', 'Trabajo', 'Reset rápido', 'Mandíbula'],
    imageUrl: '/src/assets/images/seres_movement_stretch_1792882554555.jpg',
    integrationQuestion: '¿Puedes continuar con tu próxima tarea sin acelerarte?',
    isPublished: true,
  },
];

export const INITIAL_SERVICES: ServiceOrGathering[] = [
  {
    id: 'srv-001',
    title: 'Terapia Somática Integrativa',
    itemType: 'service',
    description: 'Un abordaje corporal profundo que combina escucha terapéutica, contacto consciente y reajuste miofascial para integrar experiencias físicas y emocionales.',
    durationText: '75 minutos',
    priceText: 'Consultar opciones de bono',
    imageUrl: '/src/assets/images/seres_massage_therapy_1792882552968.jpg',
    contactActionUrl: 'https://wa.me/?text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%20la%20Terapia%20Som%C3%A1tica%20Integrativa%20en%20SERES',
    isPublished: true,
  },
  {
    id: 'srv-002',
    title: 'Masaje Descontracturante Profundo y Reajuste Postural',
    itemType: 'service',
    description: 'Trabajo focalizado en cadenas musculares con sobrecarga crónica, cuello, hombros, lumbares y pelvis, devolviendo espacio y movilidad a los tejidos.',
    durationText: '60 minutos',
    priceText: 'Sesión individual o bonos',
    imageUrl: '/src/assets/images/seres_movement_stretch_1792882554555.jpg',
    contactActionUrl: 'https://wa.me/?text=Hola%2C%20quisiera%20consultar%20disponibilidad%20para%20Masaje%20Descontracturante%20en%20SERES',
    isPublished: true,
  },
  {
    id: 'srv-003',
    title: 'Terapia Cráneo-Sacral y Regulación Nerviosa',
    itemType: 'service',
    description: 'Manipulación sutil del sistema cráneo-sacral para calmar el sistema nervioso, aliviar cefaleas tensionales y fatiga profunda.',
    durationText: '60 minutos',
    priceText: 'Sesión individual o paquetes',
    imageUrl: '/src/assets/images/seres_hero_wellness_1792882552902.jpg',
    contactActionUrl: 'https://wa.me/?text=Hola%2C%20quisiera%20m%C3%A1s%20detalles%20de%20la%20Terapia%20Cr%C3%A1neo-Sacral%20en%20SERES',
    isPublished: true,
  },
  {
    id: 'srv-004',
    title: 'Encuentro Mensual: Círculo de Presencia y Movimiento Consciente',
    itemType: 'gathering',
    description: 'Espacio grupal reducido de exploración corporal, movilidad suave guiada, respiración y silencio compartido en nuestra sala principal.',
    durationText: '2 horas',
    scheduledAt: '2026-11-14T10:00:00Z',
    priceText: 'Aportación consciente / Cupos limitados',
    imageUrl: '/src/assets/images/seres_mindful_breathing_1792882554222.jpg',
    contactActionUrl: 'https://wa.me/?text=Hola%2C%20deseo%20reservar%20plaza%20para%20el%20Encuentro%20Mensual%20de%20Presencia%20en%20SERES',
    isPublished: true,
  },
];

export const INITIAL_REFERRALS: ReferralLead[] = [];
