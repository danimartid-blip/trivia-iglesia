import { db, MODO, lista } from "./db.js";
import { PREGUNTAS, FORMAS } from "./datos.js";

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

let juego = { estado: "lobby", q: -1 };
let players = {};
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
  if (!j) await db.set(ruta("juego"), { estado: "lobby", q: -1 });
  db.listen(ruta("juego"), (v) => { juego = v || { estado: "lobby", q: -1 }; alCambiarJuego(); });
  db.listen(ruta("players"), (v) => { players = v || {}; alCambiarJugadores(); });
  db.listen(ruta("res"), (v) => { res = v || {}; if (juego.estado === "resultado" || juego.estado === "fin") pintar(true); });
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
  await db.set(ruta("juego"), { estado: "pregunta", q, inicio: Math.round(db.now()), segundos: PREGUNTAS[q].segundos });
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
  if (juego.estado === "lobby") return iniciarPregunta(0);
  if (juego.estado === "pregunta") return revelar();
  if (juego.estado === "resultado") {
    return juego.q + 1 < PREGUNTAS.length ? iniciarPregunta(juego.q + 1) : db.update(ruta("juego"), { estado: "fin" });
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
  const clave = `${juego.estado}:${juego.q}`;
  if (!forzar && clave === vistaActual) return;
  vistaActual = clave;
  const v = { lobby: vistaLobby, pregunta: vistaPregunta, resultado: vistaResultado, fin: vistaFin }[juego.estado] || vistaLobby;
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
    ? ps.map((p) => `<span class="chip"><span class="emo">${p.emoji}</span>${p.animal}</span>`).join("")
    : `<span class="vacio">Esperando que alguien se una…</span>`;
  const btn = document.getElementById("principal");
  if (btn) btn.textContent = ps.length ? `Empezar con ${ps.length} jugando` : "Empezar";
}

function vistaPregunta() {
  const P = PREGUNTAS[juego.q];
  const cuerpo = P.opciones.map((o, i) => `<div class="tile op-${i}"><span class="forma">${FORMAS[i]}</span><span>${o}</span></div>`).join("");
  return `<div class="host q">
    <div class="host-top"><span class="eyebrow">Pregunta ${juego.q + 1} de ${PREGUNTAS.length}${P.tipo === "sondeo" ? " · Sondeo: no hay respuesta mala" : ""}</span>
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
  const ultima = juego.q + 1 >= PREGUNTAS.length;
  return `<div class="host q">
    <div class="host-top"><span class="eyebrow">Pregunta ${juego.q + 1} de ${PREGUNTAS.length} · Resultado</span></div>
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
    <div class="acciones"><button class="btn" id="principal">${ultima ? "Ver el podio" : "Siguiente"}</button></div>
  </div>`;
}

function vistaFin() {
  const orden = Object.values(players).sort((a, b) => b.puntos - a.puntos).slice(0, 3);
  const col = (p, pos) => p ? `<div class="col" style="animation-delay:${pos === 1 ? 600 : pos === 2 ? 300 : 0}ms">
      <span class="emo">${p.emoji}</span><span class="nom">${p.animal}</span><span class="pts">${p.puntos} pts</span>
      <div class="peldano">${pos}</div></div>` : "";
  const gana = orden[0];
  return `<div class="host"><div class="fin">
    <p class="eyebrow">Fin del juego</p>
    <h1>${gana ? `¡Gana ${gana.animal} ${gana.emoji}!` : "¡Gracias por jugar!"}</h1>
    <div class="podio">${col(orden[1], 2)}${col(orden[0], 1)}${col(orden[2], 3)}</div>
    <p class="vacio">Si eres ese personaje, levanta la mano… o quédate en secreto. 🤫</p>
    <div class="acciones"><button class="btn ghost" id="btnNueva">Partida nueva</button></div>
  </div></div>`;
}

arrancar();
