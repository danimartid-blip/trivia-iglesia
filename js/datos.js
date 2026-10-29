// El juego va por rondas. Cada ronda tiene su propio ganador, y al terminar cada una
// se barajan los personajes y los puntos vuelven a cero.
// "sondeo" = no hay respuesta mala y no suma puntos.
// La correcta de las trivias está repartida a propósito (no siempre la primera).
export const RONDAS = [
  {
    titulo: "La Biblia",
    sub: "Siete preguntas para ver quién se sabe a sus personajes.",
    preguntas: [
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Quién se subió a un árbol para ver pasar a Jesús?",
        opciones: ["Nicodemo", "Zaqueo", "Bartimeo"],
        dato: "Zaqueo era jefe de los cobradores de impuestos y se subió a un sicómoro. Jesús se invitó a comer a su casa (Lucas 19).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "¿Quién fue el hombre más viejo de la Biblia?",
        opciones: ["Noé", "Adán", "Matusalén"],
        dato: "Matusalén vivió 969 años (Génesis 5.27). Noé vivió 950 y Adán 930.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Quién perdió su fuerza por un mal corte de pelo?",
        opciones: ["Sansón", "Absalón", "Esaú"],
        dato: "Sansón perdió su fuerza cuando le cortaron el cabello (Jueces 16).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Qué animal habló en la Biblia, además de la serpiente?",
        opciones: ["El gallo de Pedro", "La burra de Balaam", "El cuervo de Elías"],
        dato: "La burra de Balaam habló para avisarle que había un ángel en el camino (Números 22).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "¿Quién se quedó dormido en plena predicación y se cayó por una ventana?",
        opciones: ["Jonás", "Silas", "Eutico"],
        dato: "Eutico se durmió en la ventana mientras Pablo predicaba y cayó del tercer piso (Hechos 20.9). Pablo lo levantó con vida.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Qué libro de la Biblia no menciona ni una vez el nombre de Dios?",
        opciones: ["Ester", "Rut", "Jonás"],
        dato: "Ester no nombra a Dios ni una vez, aunque su mano se nota en toda la historia.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Cuál es el capítulo más largo de la Biblia?",
        opciones: ["Salmo 23", "Salmo 119", "Isaías 53"],
        dato: "El Salmo 119 tiene 176 versículos. El más corto es el Salmo 117, con solo 2.",
      },
    ],
  },
  {
    titulo: "La Reforma y la iglesia en Chile",
    sub: "De Lutero al feriado de hoy, sin ponernos pesados.",
    preguntas: [
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Desde qué año es feriado el 31 de octubre en Chile?",
        opciones: ["1990", "2008", "2015"],
        dato: "La Ley 20.299, de 2008, creó el Día Nacional de las Iglesias Evangélicas y Protestantes.",
      },
      {
        tipo: "trivia", segundos: 15, correcta: 1,
        texto: "Lutero se hizo famoso por clavar 95… en una puerta.",
        opciones: ["Sopaipillas", "Tesis", "Memes"],
        dato: "Fueron 95 tesis, en 1517. Por eso se recuerda cada 31 de octubre.",
      },
      {
        tipo: "trivia", segundos: 15, correcta: 2,
        texto: "¿A qué idioma tradujo Lutero la Biblia?",
        opciones: ["Latín", "Inglés", "Alemán"],
        dato: "Lutero tradujo el Nuevo Testamento al alemán para que la gente común pudiera leerlo (1522).",
      },
      {
        tipo: "trivia", segundos: 15, correcta: 0,
        texto: "¿Qué invento ayudó a difundir las ideas de la Reforma?",
        opciones: ["La imprenta", "La radio", "El telégrafo"],
        dato: "La imprenta permitió reproducir Biblias y folletos como nunca antes.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Qué significa “Sola Scriptura”?",
        opciones: ["Solo la fe", "Solo la Escritura", "Solo Cristo"],
        dato: "Sola Scriptura: la Biblia es la autoridad final. Las otras “solas” son fe, gracia, Cristo y la gloria de Dios.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "La Biblia “Reina-Valera” se llama así por…",
        opciones: ["Una reina de España", "Una ciudad llamada Valera", "Sus traductores, Reina y Valera"],
        dato: "Casiodoro de Reina la tradujo en 1569 (la “Biblia del Oso”) y Cipriano de Valera la revisó en 1602.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿En qué ciudad partió el avivamiento pentecostal chileno en 1909, con el pastor Willis Hoover?",
        opciones: ["Santiago", "Valparaíso", "Concepción"],
        dato: "Fue en Valparaíso, en 1909, con el pastor Willis Hoover.",
      },
    ],
  },
  {
    titulo: "Sondeos para conocernos",
    sub: "Aquí no hay respuesta mala. Solo sinceridad jeje.",
    preguntas: [
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces cuando el predicador dice “ya termino”?",
        opciones: ["Miro la hora", "Sé que faltan 20 minutos", "Aprovecho y pienso en la once"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Cuál es tu peor pesadilla en el culto?",
        opciones: ["Que me pidan orar en voz alta", "Que me suene el celular", "Que pregunten “¿alguien quiere compartir?”"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Cómo cantas en el culto?",
        opciones: ["Como un ángel", "Con entusiasmo y poca afinación", "Muevo los labios y confío en el de al lado"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Dónde te sientas en el templo?",
        opciones: ["Adelante, para ver todo", "En el medio", "Atrás, cerca de la puerta"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces cuando dicen “abran su Biblia en…”?",
        opciones: ["La busco en el celular", "La saco, bien subrayada", "Miro al de al lado"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué no puede faltar en una once evangélica?",
        opciones: ["Pan amasado", "Marraqueta con palta", "El kuchen de la hermana"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces primero al llegar a una convivencia?",
        opciones: ["Busco la mesa de comida", "Saludo a todos", "Me ofrezco a ayudar y me escapo"],
      },
    ],
  },
];

// Lista plana que usa el juego. Cada pregunta sabe a qué ronda pertenece.
export const PREGUNTAS = RONDAS.flatMap((r, ronda) => r.preguntas.map((p) => ({ ...p, ronda })));

export const FORMAS = ["▲", "●", "■", "◆"];

// Cada jugador recibe un personaje bíblico al azar: así en la pantalla nadie queda expuesto.
// (Se deja fuera a Jesús a propósito, para que nunca salga "Casi…" o "Se acabó el tiempo" con su nombre.)
export const PERSONAJES = [
  ["David", "🎵"], ["Pablo", "✉️"], ["Pedro", "🎣"], ["Moisés", "🌊"], ["Noé", "🌈"],
  ["Abraham", "🏕️"], ["Sansón", "💪"], ["Daniel", "🦁"], ["Jonás", "🐋"], ["Ester", "👸"],
  ["Rut", "🌾"], ["José", "🧥"], ["Elías", "🔥"], ["Débora", "🌴"], ["Gedeón", "🎺"],
  ["Josué", "🧱"], ["Salomón", "👑"], ["Goliat", "🛡️"], ["Zaqueo", "🌳"], ["María", "🌸"],
  ["Marta", "🍞"], ["Mateo", "💰"], ["Juan", "🦅"], ["Santiago", "🐚"], ["Andrés", "🐟"],
  ["Tomás", "🔍"], ["Felipe", "🚶"], ["Lucas", "🩺"], ["Marcos", "🏃"], ["Timoteo", "🎓"],
  ["Bernabé", "🤝"], ["Silas", "⛓️"], ["Priscila", "🧵"], ["Lidia", "💜"], ["Nehemías", "🏗️"],
  ["Job", "🙏"], ["Jacob", "🌠"], ["Isaac", "🐑"], ["Samuel", "👂"], ["Eva", "🍎"],
  ["Adán", "🌱"], ["Natanael", "🍃"], ["Esteban", "🕊️"],
];
