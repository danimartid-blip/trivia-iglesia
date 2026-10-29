import { db, MODO, lista } from "./db.js";
import { PREGUNTAS, RONDAS, FORMAS, PERSONAJES } from "./datos.js";

const app = document.getElementById("app");

if (MODO === "sin-config") {
  app.innerHTML = `<div class="host"><div class="error" style="font-size:20px">
    Falta conectar Firebase. Abre <b>js/firebase-config.js</b> y pega los datos de tu proyecto
    (están los pasos en el README). Para probar sin Firebase, agrega <b>?local=1</b> al final de la dirección.</div></div>`;
  throw new Error("Firebase sin configurar");
}
if (MODO === "local") document.body.insertAdjacentHTML("beforeend", `<div class="badge-prueba">MODO PRUEBA (local)</div>`);

const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const nuevoCodigo = () => Array.from({ length: 4 }, () => ALFABETO[Math.floor(Math.random() * ALFABETO.length)]).join("");

let sala = localStorage.getItem("trivia_sala");
if (!sala) { sala = nuevoCodigo(); localStorage.setItem("trivia_sala", sala); }

let juego = { estado: "lobby", q: -1, ronda: 0 };
let players = {};
let ganadores = {};
let res = {};
let resp = {};
let vistaActual = "";
let desuscribirResp = null;
let respQ = null;
let revelando = false;
const ruta = (p) => `rooms/${sala}/${p}`;

const urlJugar = () => {
  const u = new URL("jugar.html", location.href);
  u.search = `?sala=${sala}${MODO === "local" ? "&local=1" : ""}`;
  return u.href;
};

/* ---------------- estado ---------------- */

async function arrancar() {
  const j = await db.get(ruta("juego"));
  if (!j) await db.set(ruta("juego"), { estado: "lobby", q: -1, ronda: 0 });
  db.listen(ruta("juego"), (v) => { juego = v || { estado: "lobby", q: -1, ronda: 0 }; alCambiarJuego(); });
  db.listen(ruta("players"), (v) => { players = v || {}; alCambiarJugadores(); });
  db.listen(ruta("ganadores"), (v) => { ganadores = v || {}; if (juego.estado === "fin") pintar(true); });
  db.listen(ruta("res"), (v) => { res = v || {}; if (juego.estado === "resultado") pintar(true); });
  setInterval(tick, 200);
  addEventListener("keydown", (e) => {
    if (["Enter", " ", "ArrowRight"].includes(e.key) && !e.target.closest("button, input")) {
      e.preventDefault();
      document.getElementById("principal")?.click();
    }
  });
}

function alCambiarJuego() {
  if (juego.estado === "pregunta" && respQ !== juego.q) {
    desuscribirResp?.();
    respQ = juego.q;
    resp = {};
    desuscribirResp = db.listen(ruta(`resp/${juego.q}`), (v) => { resp = v || {}; actualizarCuenta(); revisarTodos(); });
  }
  pintar();
}

function alCambiarJugadores() {
  pintarAnimales();
  actualizarCuenta();
  const btn = document.getElementById("principal");
  if (btn && juego.estado === "lobby") btn.disabled = Object.keys(players).length === 0;
}

const nJugadores = () => Object.keys(players).length;

function actualizarCuenta() {
  const el = document.getElementById("cuenta");
  if (el) el.textContent = `${Object.keys(resp).length} de ${nJugadores()} respondieron`;
}

function revisarTodos() {
  if (juego.estado === "pregunta" && nJugadores() > 0 && Object.keys(resp).length >= nJugadores()) {
    setTimeout(() => { if (juego.estado === "pregunta") revelar(); }, 900);
  }
}

function tick() {
  if (juego.estado !== "pregunta") return;
  const P = PREGUNTAS[juego.q];
  const resto = P.segundos - (db.now() - juego.inicio) / 1000;
  const barra = document.getElementById("barra");
  if (barra) barra.style.width = `${Math.max(0, Math.min(100, (resto / P.segundos) * 100))}%`;
  const seg = document.getElementById("seg");
  if (seg) seg.textContent = Math.max(0, Math.ceil(resto));
  if (resto <= 0) revelar();
}

/* ---------------- acciones ---------------- */

async function iniciarPregunta(q) {
  revelando = false;
  await db.remove(ruta(`resp/${q}`));
  await db.set(ruta("juego"), { estado: "pregunta", q, ronda: PREGUNTAS[q].ronda, inicio: Math.round(db.now()), segundos: PREGUNTAS[q].segundos });
}

const irAIntro = (ronda) => db.set(ruta("juego"), { estado: "intro", q: -1, ronda });
const primeraDe = (ronda) => PREGUNTAS.findIndex((p) => p.ronda === ronda);
const hayTrivia = (ronda) => RONDAS[ronda].preguntas.some((p) => p.tipo === "trivia");
const esFinDeRonda = (q) => q + 1 >= PREGUNTAS.length || PREGUNTAS[q + 1].ronda !== PREGUNTAS[q].ronda;
const clasificacion = (ps) => Object.values(ps).sort((a, b) => b.puntos - a.puntos);

async function cerrarRonda(ronda) {
  const orden = clasificacion((await db.get(ruta("players"))) || {});
  const g = orden[0] && orden[0].puntos > 0 ? { animal: orden[0].animal, emoji: orden[0].emoji, puntos: orden[0].puntos } : null;
  if (g) await db.set(ruta(`ganadores/${ronda}`), g);
  await db.set(ruta("juego"), { estado: "ronda-fin", q: juego.q, ronda });
}

// Nuevos personajes para todos y puntos en cero: así el ganador de una ronda no se puede rastrear en la siguiente.
async function barajar() {
  const actuales = (await db.get(ruta("players"))) || {};
  const idx = PERSONAJES.map((_, i) => i).sort(() => Math.random() - 0.5);
  const upd = {};
  const tomados = {};
  Object.keys(actuales).forEach((pid, k) => {
    const par = idx[k] !== undefined ? PERSONAJES[idx[k]] : [`Visita ${k + 1}`, "🙂"];
    if (idx[k] !== undefined) tomados[idx[k]] = pid;
    upd[`${pid}/animal`] = par[0];
    upd[`${pid}/emoji`] = par[1];
    upd[`${pid}/puntos`] = 0;
    upd[`${pid}/ultimo`] = 0;
  });
  await db.update(ruta("players"), upd);
  await db.set(ruta("tomados"), Object.keys(tomados).length ? tomados : null);
}

async function revelar() {
  if (revelando || juego.estado !== "pregunta") return;
  revelando = true;
  const q = juego.q;
  const P = PREGUNTAS[q];
  const respuestas = (await db.get(ruta(`resp/${q}`))) || {};
  const actuales = (await db.get(ruta("players"))) || {};
  const conteos = P.opciones.map(() => 0);
  const upd = {};
  for (const pid of Object.keys(actuales)) {
    const r = respuestas[pid];
    let pts = 0;
    if (r && conteos[Number(r.op)] !== undefined) {
      conteos[Number(r.op)]++;
      if (P.tipo === "trivia" && Number(r.op) === P.correcta) {
        const fr = Math.min(1, Math.max(0, r.t / (P.segundos * 1000)));
        pts = Math.round(1000 - 500 * fr);
      }
    }
    upd[`${pid}/ultimo`] = pts;
    upd[`${pid}/puntos`] = (actuales[pid].puntos || 0) + pts;
  }
  await db.update(ruta("players"), upd);
  const despues = (await db.get(ruta("players"))) || {};
  const top = Object.values(despues)
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, 5)
    .map((p) => ({ animal: p.animal, emoji: p.emoji, puntos: p.puntos }));
  await db.set(ruta(`res/${q}`), { conteos, correcta: P.tipo === "trivia" ? P.correcta : -1, top });
  await db.update(ruta("juego"), { estado: "resultado" });
}

async function siguiente() {
  const e = juego.estado;
  if (e === "lobby") return irAIntro(0);
  if (e === "intro") return iniciarPregunta(primeraDe(juego.ronda));
  if (e === "pregunta") return revelar();
  if (e === "resultado") {
    if (!esFinDeRonda(juego.q)) return iniciarPregunta(juego.q + 1);
    const r = PREGUNTAS[juego.q].ronda;
    if (hayTrivia(r)) return cerrarRonda(r);
    return r + 1 < RONDAS.length ? irAIntro(r + 1) : db.set(ruta("juego"), { estado: "fin", q: juego.q, ronda: r });
  }
  if (e === "ronda-fin") {
    if (juego.ronda + 1 < RONDAS.length) { await barajar(); return irAIntro(juego.ronda + 1); }
    return db.set(ruta("juego"), { estado: "fin", q: juego.q, ronda: juego.ronda });
  }
}

async function nuevaPartida() {
  if (!confirm("¿Empezar una partida nueva? Se borran los jugadores y los puntos de esta.")) return;
  desuscribirResp?.();
  localStorage.setItem("trivia_sala", nuevoCodigo());
  location.reload();
}

/* ---------------- vistas ---------------- */

function pintar(forzar = false) {
  const clave = `${juego.estado}:${juego.q}:${juego.ronda}`;
  if (!forzar && clave === vistaActual) return;
  vistaActual = clave;
  const v = { lobby: vistaLobby, intro: vistaIntro, pregunta: vistaPregunta, resultado: vistaResultado, "ronda-fin": vistaRondaFin, fin: vistaFin }[juego.estado] || vistaLobby;
  app.innerHTML = v();
  document.getElementById("principal")?.addEventListener("click", siguiente);
  document.getElementById("btnNueva")?.addEventListener("click", nuevaPartida);
  document.getElementById("btnCerrar")?.addEventListener("click", revelar);
  if (juego.estado === "lobby") { dibujarQR(); pintarAnimales(); alCambiarJugadores(); }
  if (juego.estado === "pregunta") { actualizarCuenta(); tick(); }
}

function vistaLobby() {
  return `<div class="host">
    <div class="host-top"><span class="eyebrow">Trivia del Día · Día de las Iglesias Evangélicas y Protestantes</span>
      <button class="btn ghost" id="btnNueva" style="font-size:14px;padding:8px 14px">Partida nueva</button></div>
    <div class="lobby">
      <div class="qrbox"><div id="qr"></div></div>
      <div>
        <p class="eyebrow">Únete desde tu celular</p>
        <h1>Escanea el QR y juega</h1>
        <p class="sub">o entra a <b>${urlJugar().replace(/^https?:\/\//, "").split("?")[0]}</b> y escribe el código</p>
        <div class="codigo">${sala}</div>
        <div class="animales" id="animales"></div>
        <div class="acciones">
          <button class="btn" id="principal" disabled>Empezar</button>
          <span class="vacio" id="nota">Cada uno recibe un personaje de la Biblia al azar: solo tú sabes cuál eres.</span>
        </div>
      </div>
    </div></div>`;
}

function dibujarQR() {
  const el = document.getElementById("qr");
  if (!el || typeof QRCode === "undefined") { if (el) el.textContent = urlJugar(); return; }
  el.innerHTML = "";
  new QRCode(el, { text: urlJugar(), width: 480, height: 480, colorDark: "#0e0e0c", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
}

function pintarAnimales() {
  const el = document.getElementById("animales");
  if (!el) return;
  const ps = Object.values(players);
  el.innerHTML = ps.length
    ? Object.entries(players).map(([id, p]) => `<span class="chip"><span class="emo">${p.emoji}</span>${p.animal}<button class="quitar" data-quitar="${id}" title="Quitar a ${p.animal}" aria-label="Quitar a ${p.animal}">✕</button></span>`).join("")
    : `<span class="vacio">Esperando que alguien se una…</span>`;
  const btn = document.getElementById("principal");
  if (btn) btn.textContent = ps.length ? `Empezar con ${ps.length} jugando` : "Empezar";
}

// en el lobby se puede quitar a un jugador que sobra (por ejemplo, un celular que entró dos veces)
async function quitarJugador(id) {
  const p = players[id];
  if (!p || juego.estado !== "lobby") return;
  if (!confirm(`¿Quitar a ${p.animal}? Su personaje queda libre.`)) return;
  const tomados = (await db.get(ruta("tomados"))) || {};
  await db.remove(ruta(`players/${id}`));
  for (const k of Object.keys(tomados)) if (tomados[k] === id) await db.remove(ruta(`tomados/${k}`));
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-quitar]");
  if (b) quitarJugador(b.dataset.quitar);
});

function etiqueta(q) {
  const r = PREGUNTAS[q].ronda;
  const enRonda = PREGUNTAS.filter((p) => p.ronda === r);
  const n = PREGUNTAS.slice(0, q + 1).filter((p) => p.ronda === r).length;
  return `Ronda ${r + 1} de ${RONDAS.length} · ${RONDAS[r].titulo} · Pregunta ${n} de ${enRonda.length}`;
}

function vistaIntro() {
  const r = juego.ronda;
  const R = RONDAS[r];
  const n = R.preguntas.length;
  return `<div class="host"><div class="fin">
    <p class="eyebrow">Ronda ${r + 1} de ${RONDAS.length}</p>
    <h1>${R.titulo}</h1>
    <p class="sub">${R.sub}</p>
    <p class="vacio">${n} preguntas · ${hayTrivia(r) ? "suman puntos y hay ganador" : "sin puntos, para reírnos un rato"}</p>
    ${r > 0 ? `<p class="dato">🔀 Se barajaron los personajes: mira tu celular para ver quién eres ahora. Los puntos volvieron a cero.</p>` : ""}
    <div class="acciones"><button class="btn" id="principal">Empezar la ronda</button></div>
  </div></div>`;
}

function vistaRondaFin() {
  const r = juego.ronda;
  const orden = clasificacion(players).slice(0, 3);
  const col = (p, pos) => p ? `<div class="col" style="animation-delay:${pos === 1 ? 600 : pos === 2 ? 300 : 0}ms">
      <span class="emo">${p.emoji}</span><span class="nom">${p.animal}</span><span class="pts">${p.puntos} pts</span>
      <div class="peldano">${pos}</div></div>` : "";
  const g = orden[0] && orden[0].puntos > 0 ? orden[0] : null;
  const empate = g && orden[1] && orden[1].puntos === g.puntos;
  const hay = r + 1 < RONDAS.length;
  return `<div class="host"><div class="fin">
    <p class="eyebrow">Ronda ${r + 1} · ${RONDAS[r].titulo}</p>
    <h1>${g ? (empate ? "¡Empate en la cima!" : `¡Gana ${g.animal} ${g.emoji}!`) : "Nadie sumó puntos esta ronda"}</h1>
    ${g ? `<div class="podio">${col(orden[1], 2)}${col(orden[0], 1)}${col(orden[2], 3)}</div>
    <p class="vacio">${empate ? "¡Los empatados ya pueden levantar la mano!" : `¡${g.animal}, ahora puedes levantar la mano!`} 🙌 Un aplauso para ${empate ? "ellos" : "tu personaje"} 👏</p>` : ""}
    <div class="acciones"><button class="btn" id="principal">${hay ? `Barajar personajes y seguir con la ronda ${r + 2}` : "Terminar"}</button></div>
  </div></div>`;
}

function vistaPregunta() {
  const P = PREGUNTAS[juego.q];
  const cuerpo = P.opciones.map((o, i) => `<div class="tile op-${i}"><span class="forma">${FORMAS[i]}</span><span>${o}</span></div>`).join("");
  return `<div class="host q">
    <div class="host-top"><span class="eyebrow">${etiqueta(juego.q)}${P.tipo === "sondeo" ? " · Sondeo: no hay respuesta mala" : ""}</span>
      <span class="cuenta" id="cuenta"></span></div>
    <h2 class="pregunta">${P.texto}</h2>
    <div class="tiles" style="--n:${P.opciones.length}">${cuerpo}</div>
    <div class="barra"><i id="barra"></i></div>
    <div class="acciones"><span class="seg" id="seg"></span>
      <button class="btn ghost" id="btnCerrar">Cerrar ahora</button></div>
  </div>`;
}

function vistaResultado() {
  const P = PREGUNTAS[juego.q];
  const r = res[juego.q] || { conteos: [], top: [] };
  const conteos = lista(r.conteos);
  const total = conteos.reduce((a, b) => a + b, 0) || 1;
  const trivia = P.tipo === "trivia";
  const cuerpo = P.opciones.map((o, i) => {
    const c = conteos[i] || 0;
    const clases = trivia ? (i === P.correcta ? "correcta" : "dim") : "";
    return `<div class="tile op-${i} ${clases}"><span class="forma">${FORMAS[i]}</span><span>${o}</span>
      <span class="conteo">${c}</span><span class="relleno" style="width:${Math.round((c / total) * 100)}%"></span></div>`;
  }).join("");
  const top = lista(r.top);
  const finRonda = esFinDeRonda(juego.q);
  const rr = P.ronda;
  const textoBoton = !finRonda ? "Siguiente"
    : hayTrivia(rr) ? "Ver al ganador de la ronda"
    : rr + 1 < RONDAS.length ? `Seguir con la ronda ${rr + 2}` : "Terminar";
  return `<div class="host q">
    <div class="host-top"><span class="eyebrow">${etiqueta(juego.q)} · Resultado</span></div>
    <h2 class="pregunta">${P.texto}</h2>
    <div class="res-grid">
      <div style="display:flex;flex-direction:column;gap:1.6vw">
        <div class="tiles" style="--n:${P.opciones.length}">${cuerpo}</div>
        ${P.dato ? `<p class="dato">${P.dato}</p>` : ""}
      </div>
      <div class="top"><h3>${trivia ? "Los primeros" : "Puntos hasta ahora"}</h3>
        <ol>${top.length ? top.map((t, i) => `<li style="animation-delay:${i * 80}ms"><span class="n">${i + 1}</span><span>${t.emoji} ${t.animal}</span><span class="p">${t.puntos}</span></li>`).join("") : "<li>—</li>"}</ol>
      </div>
    </div>
    <div class="acciones"><button class="btn" id="principal">${textoBoton}</button></div>
  </div>`;
}

function vistaFin() {
  const filas = RONDAS.map((R, r) => ({ R, r, g: ganadores[r] })).filter((x) => x.g);
  return `<div class="host"><div class="fin">
    <p class="eyebrow">Fin del juego</p>
    <h1>¡Gracias por jugar!</h1>
    ${filas.length ? `<div class="recap">${filas.map(({ R, r, g }, i) => `<div class="fila" style="animation-delay:${i * 200}ms">
      <span class="rn">Ronda ${r + 1} · ${R.titulo}</span><span class="gan">${g.emoji} ${g.animal}</span><span class="pts">${g.puntos} pts</span></div>`).join("")}</div>
    <p class="vacio">¡Ahora sí! ${[...new Set(filas.map((x) => x.g.animal))].join(", ")}: levanten la mano y reciban su aplauso 🙌👏</p>` : ""}
    <div class="acciones"><button class="btn ghost" id="btnNueva">Partida nueva</button></div>
  </div></div>`;
}

arrancar();
