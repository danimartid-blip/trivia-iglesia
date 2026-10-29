// Preguntas del juego. "sondeo" = no hay respuesta mala, no suma puntos.
// La correcta de las trivias está repartida a propósito (no siempre la primera).
export const PREGUNTAS = [
  {
    tipo: "sondeo", segundos: 15,
    texto: "¿Qué dura más en una iglesia?",
    opciones: ["El “último canto”", "El “ya casi termino” del predicador", "La hora de peticiones de oración"],
  },
  {
    tipo: "trivia", segundos: 20, correcta: 2,
    texto: "¿Quién se quedó dormido en plena predicación y se cayó por una ventana?",
    opciones: ["Jonás", "Zaqueo", "Eutico"],
    dato: "Eutico se durmió en la ventana mientras Pablo predicaba y cayó del tercer piso (Hechos 20.9). Pablo lo levantó con vida.",
  },
  {
    tipo: "trivia", segundos: 20, correcta: 1,
    texto: "¿Qué animal habló en la Biblia, además de la serpiente?",
    opciones: ["El gallo de Pedro", "La burra de Balaam", "El cuervo de Elías"],
    dato: "La burra de Balaam habló para avisarle que había un ángel en el camino (Números 22).",
  },
  {
    tipo: "trivia", segundos: 20, correcta: 0,
    texto: "¿Quién perdió su fuerza por un mal corte de pelo?",
    opciones: ["Sansón", "Absalón", "Esaú"],
    dato: "Sansón perdió su fuerza cuando le cortaron el cabello (Jueces 16).",
  },
  {
    tipo: "trivia", segundos: 20, correcta: 2,
    texto: "¿Qué libro de la Biblia no menciona ni una vez el nombre de Dios?",
    opciones: ["Rut", "Jonás", "Ester"],
    dato: "Ester no nombra a Dios ni una vez, aunque su mano se nota en toda la historia.",
  },
  {
    tipo: "trivia", segundos: 15, correcta: 1,
    texto: "Lutero se hizo famoso por clavar 95… en una puerta.",
    opciones: ["Sopaipillas", "Tesis", "Memes"],
    dato: "Fueron 95 tesis, en 1517. Por eso se recuerda cada 31 de octubre.",
  },
  {
    tipo: "trivia", segundos: 20, correcta: 0,
    texto: "¿Cuál es el libro más largo de la Biblia, por número de capítulos?",
    opciones: ["Salmos", "Isaías", "Génesis"],
    dato: "Salmos tiene 150 capítulos. Isaías tiene 66 y Génesis 50.",
  },
  {
    tipo: "trivia", segundos: 20, correcta: 1,
    texto: "¿En qué ciudad partió el avivamiento pentecostal chileno en 1909, con el pastor Willis Hoover?",
    opciones: ["Santiago", "Valparaíso", "Concepción"],
    dato: "Fue en Valparaíso, en 1909, con el pastor Willis Hoover.",
  },
  {
    tipo: "sondeo", segundos: 15,
    texto: "¿A qué hora llegas de verdad al culto?",
    opciones: ["10 minutos antes", "Justo a la hora", "Con el primer canto ya empezado"],
  },
  {
    tipo: "sondeo", segundos: 15,
    texto: "En una convivencia, ¿cuántas sopaipillas o pasteles te comes realmente?",
    opciones: ["Una, de cortesía", "Dos o tres", "Perdí la cuenta"],
  },
];

export const FORMAS = ["▲", "●", "■", "◆"];

// Cada jugador recibe un animal al azar: así en la pantalla nadie queda expuesto.
export const ANIMALES = [
  ["Zorro", "🦊"], ["Pingüino", "🐧"], ["León", "🦁"], ["Tigre", "🐯"], ["Oso", "🐻"],
  ["Panda", "🐼"], ["Koala", "🐨"], ["Mono", "🐵"], ["Conejo", "🐰"], ["Ratón", "🐭"],
  ["Vaca", "🐮"], ["Cerdo", "🐷"], ["Rana", "🐸"], ["Pulpo", "🐙"], ["Delfín", "🐬"],
  ["Ballena", "🐳"], ["Tiburón", "🦈"], ["Búho", "🦉"], ["Águila", "🦅"], ["Pato", "🦆"],
  ["Cisne", "🦢"], ["Flamenco", "🦩"], ["Loro", "🦜"], ["Mariposa", "🦋"], ["Abeja", "🐝"],
  ["Caracol", "🐌"], ["Tortuga", "🐢"], ["Cocodrilo", "🐊"], ["Jirafa", "🦒"], ["Elefante", "🐘"],
  ["Hipopótamo", "🦛"], ["Rinoceronte", "🦏"], ["Camello", "🐪"], ["Llama", "🦙"], ["Canguro", "🦘"],
  ["Lobo", "🐺"], ["Ciervo", "🦌"], ["Caballo", "🐴"], ["Erizo", "🦔"], ["Cangrejo", "🦀"],
];
