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
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "¿Quién fue el hombre más viejo de la Biblia?",
        opciones: ["Noé", "Adán", "Matusalén"],
        dato: "Matusalén vivió 969 años (Génesis 5.27). Noé vivió 950 y Adán 930.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Cuál fue el primer milagro de Jesús, según Juan?",
        opciones: ["Convertir agua en vino", "Multiplicar los panes", "Sanar a un ciego"],
        dato: "Fue en unas bodas en Caná de Galilea, cuando convirtió el agua en vino (Juan 2.1-11).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Qué oficio tenía Pablo?",
        opciones: ["Pescador", "Fabricante de tiendas", "Carpintero"],
        dato: "Pablo era fabricante de tiendas, igual que sus amigos Aquila y Priscila, y con ese trabajo se sostenía mientras predicaba (Hechos 18.3).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Cuál es el capítulo más corto de la Biblia?",
        opciones: ["Salmo 117", "Salmo 23", "Juan 3"],
        dato: "El Salmo 117 tiene solo 2 versículos: es un llamado a alabar al Señor. El más largo es el Salmo 119, con 176.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Qué ave le llevó a Noé una ramita de olivo?",
        opciones: ["El cuervo", "La paloma", "El águila"],
        dato: "La paloma volvió con una hoja de olivo en el pico, señal de que las aguas ya bajaban (Génesis 8.11).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "¿Qué profeta fue alimentado por cuervos?",
        opciones: ["Eliseo", "Jeremías", "Elías"],
        dato: "Dios envió cuervos para llevarle pan y carne a Elías junto al arroyo de Querit (1 Reyes 17.1-6).",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Qué comía Juan el Bautista en el desierto?",
        opciones: ["Pan y pescado", "Langostas y miel silvestre", "Dátiles y leche"],
        dato: "Juan el Bautista comía langostas y miel silvestre en el desierto, y se vestía con pelo de camello (Mateo 3.4).",
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
    ],
  },
  {
    titulo: "La Reforma y la iglesia en Chile",
    sub: "De Lutero al feriado de hoy, sin ponernos pesados.",
    preguntas: [
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
        texto: "¿Desde qué año es feriado el 31 de octubre en Chile?",
        opciones: ["1990", "2008", "2015"],
        dato: "La Ley 20.299, de 2008, creó el Día Nacional de las Iglesias Evangélicas y Protestantes.",
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
        tipo: "trivia", segundos: 20, correcta: 0,
        texto: "¿Cuál de estas NO es una de las cinco “solas” de la Reforma?",
        opciones: ["Sola Ecclesia (solo la Iglesia)", "Sola Gratia (solo la gracia)", "Soli Deo Gloria (solo a Dios la gloria)"],
        dato: "Las cinco solas son: solo la Escritura, solo la fe, solo la gracia, solo Cristo y solo a Dios la gloria. “Sola Ecclesia” no existe.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 1,
        texto: "¿Por qué recordamos el 31 de octubre?",
        opciones: ["Porque ese día nació Lutero", "Porque ese día de 1517 Lutero publicó sus 95 tesis", "Porque ese día llegó el primer misionero a Chile"],
        dato: "El 31 de octubre de 1517 se toma como el comienzo de la Reforma. En Chile es feriado desde 2008.",
      },
      {
        tipo: "trivia", segundos: 20, correcta: 2,
        texto: "En la Dieta de Worms (1521), ¿qué le pidieron a Lutero?",
        opciones: ["Que tradujera la Biblia", "Que fundara una nueva iglesia", "Que se retractara de sus escritos"],
        dato: "Se negó a retractarse si no lo convencían con la Escritura. Después se escondió en el castillo de Wartburg, donde tradujo el Nuevo Testamento.",
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
        opciones: ["Miro la hora", "Sé que faltan 20 minutos", "Me acomodo en la silla"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué no puede faltar en el compartir de la iglesia?",
        opciones: ["Su buen quequito", "Su buen café", "Su buen pancito"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces cuando dicen “abran su Biblia en…”?",
        opciones: ["La busco en el celular", "La saco, bien subrayada", "Espero que la proyecten"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces cuando ves al hermano de al lado durmiendo?",
        opciones: ["Al final del culto lo reprendo", "Toso o meto ruido", "Me guardo el recuerdo solamente"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Cuál es tu técnica para no dormirte en la predicación?",
        opciones: ["Tomo apuntes", "Cambio de posición cada cinco minutos", "Miro fijo al pastor y asiento con la cabeza"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces con el último pedazo de queque?",
        opciones: ["Lo ofrezco tres veces y lo acepto", "Se lo dejo al que llegue tarde", "Ya me lo comí hace rato"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué Biblia usas?",
        opciones: ["La Reina-Valera de toda la vida", "La que me regalaron, no sé cuál es", "La del celular"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué tan puntual eres para llegar al culto?",
        opciones: ["Llego diez minutos antes", "Llego justo a la hora", "Llego con la primera canción empezada"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué haces con los mensajes del grupo de WhatsApp de la iglesia?",
        opciones: ["Respondo con un pulgar arriba", "Ignoro :(", "Leo todo y no escribo nada"],
      },
      {
        tipo: "sondeo", segundos: 15,
        texto: "¿Qué es lo primero que haces al entrar al templo?",
        opciones: ["Busco dónde sentarme", "Miro quién llegó", "Busco si hay café"],
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
