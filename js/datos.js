// El juego va por rondas. Cada ronda tiene su propio ganador, y al terminar cada una
// se barajan los personajes y los puntos vuelven a cero.
// "sondeo" = no hay respuesta mala y no suma puntos.
// La correcta de las trivias está repartida a propósito (no siempre la primera).
export const RONDAS = [
  {
    titulo: "La Biblia",
    sub: "Diez preguntas para ver quién se sabe a sus personajes.",
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
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Quién se convirtió en estatua de sal por mirar atrás?",
        opciones: ["La esposa de Lot", "Sara", "Agar"],
        dato: "Fue la esposa de Lot, que miró atrás al huir de Sodoma (Génesis 19.26), a pesar de que les habían pedido no hacerlo.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Qué comía Juan el Bautista en el desierto?",
        opciones: ["Pan y pescado", "Langostas y miel silvestre", "Dátiles y leche"],
        dato: "Juan el Bautista comía langostas y miel silvestre en el desierto, y se vestía con pelo de camello (Mateo 3.4).",
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
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Cuál de estos NO es fruto del Espíritu (Gálatas 5)?",
        opciones: ["Popularidad", "Dominio propio", "Mansedumbre"],
        dato: "El fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre y dominio propio (Gálatas 5.22-23). La popularidad no está en la lista.",
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
        texto: "Lutero se hizo famoso por clavar 95… en una puerta.",
        opciones: ["Sopaipillas", "Tesis", "Memes"],
        dato: "Fueron 95 tesis, en 1517. Por eso se recuerda cada 31 de octubre.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "Lutero protestó con sus 95 tesis contra la venta de…",
        opciones: ["Biblias en alemán", "Entradas a la catedral", "Indulgencias"],
        dato: "Las indulgencias prometían rebajar el castigo por los pecados a cambio de dinero. Lutero dijo que el perdón no se compra: viene de Dios (1517).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "Según Efesios 2:8-9, ¿cómo somos salvos?",
        opciones: ["Por nuestras buenas obras", "Por gracia, mediante la fe", "Por pertenecer a una iglesia"],
        dato: "“Por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios”. Es la base de “sola gracia” y “sola fe”.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Qué significa “Sola Scriptura”?",
        opciones: ["Solo la fe", "Solo la Escritura", "Solo Cristo"],
        dato: "Sola Scriptura: la Biblia es la autoridad final. Las otras “solas” son fe, gracia, Cristo y la gloria de Dios.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Cuál de estas NO es una de las cinco “solas” de la Reforma?",
        opciones: ["Sola Ecclesia (solo la Iglesia)", "Sola Gratia (solo la gracia)", "Soli Deo Gloria (solo a Dios la gloria)"],
        dato: "Las cinco solas son: solo la Escritura, solo la fe, solo la gracia, solo Cristo y solo a Dios la gloria. “Sola Ecclesia” no existe.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "¿A qué idioma tradujo Lutero la Biblia?",
        opciones: ["Latín", "Inglés", "Alemán"],
        dato: "Lutero tradujo el Nuevo Testamento al alemán para que la gente común pudiera leerlo (1522).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Qué invento ayudó a difundir las ideas de la Reforma?",
        opciones: ["La imprenta", "La radio", "El telégrafo"],
        dato: "La imprenta permitió reproducir Biblias y folletos como nunca antes.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "La Biblia “Reina-Valera” se llama así por…",
        opciones: ["Una reina de España", "Una ciudad llamada Valera", "Sus traductores, Reina y Valera"],
        dato: "Casiodoro de Reina la tradujo en 1569 (la “Biblia del Oso”) y Cipriano de Valera la revisó en 1602.",
      },
      {
        tipo: "trivia", segundos: 25, correcta: 1,
        texto: "¿En qué ciudad partió el avivamiento pentecostal chileno en 1909, con el pastor Willis Hoover?",
        opciones: ["Santiago", "Valparaíso", "Concepción"],
        dato: "Fue en Valparaíso, en 1909, con el pastor Willis Hoover.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Desde qué año es feriado el 31 de octubre en Chile?",
        opciones: ["1990", "2008", "2015"],
        dato: "La Ley 20.299, de 2008, creó el Día Nacional de las Iglesias Evangélicas y Protestantes.",
      },
    ],
  },
  {
    titulo: "Sondeos para conocernos",
    sub: "Aquí no hay respuesta mala. Solo sinceridad jeje.",
    preguntas: [
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿En qué piensas cuando te distraes en la prédica?",
        opciones: ["Que me pidan orar en voz alta", "Que me suene el celular", "Que pregunten “¿alguien quiere compartir?”"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces cuando el predicador dice “ya termino”?",
        opciones: ["Miro la hora", "Sé que faltan 20 minutos", "Me acomodo en la silla"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Cómo cantas en el culto?",
        opciones: ["Como un ángel", "Con entusiasmo y poca afinación", "Muevo los labios y confío en el de al lado"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué no puede faltar en el compartir de la iglesia?",
        opciones: ["Su buen quequito", "Su buen café", "Su buen pancito"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces cuando ves al hermano de al lado durmiendo?",
        opciones: ["Al final del culto lo reprendo", "Toso o meto ruido", "Me guardo el recuerdo solamente"],
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
