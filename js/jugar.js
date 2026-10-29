import { db, MODO } from "./db.js";
import { PREGUNTAS, RONDAS, FORMAS, PERSONAJES } from "./datos.js";

const app = document.getElementById("app");
const params = new URLSearchParams(location.search);
const sala = (params.get("sala") || "").toUpperCase().trim();
const store = MODO === "local" ? sessionStorage : localStorage;

if (MODO === "local") document.body.insertAdjacentHTML("beforeend", `<div class="badge-prueba">MODO PRUEBA</div>`);

const mensaje = (html) => { app.innerHTML = html; };

if (MODO === "sin-config") {
  mensaje(`<div class="error">Esta trivia todavía no está conectada. Avísale a quien la organiza.</div>`);
  throw new Error("Firebase sin configurar");
}

if (!sala) {
  mensaje(`<div class="centro"><div class="gigante">🎲</div><h1>Trivia del Día</h1>
    <p>Escribe el código que aparece en la pantalla.</p>
    <input class="entrada" id="cod" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="ABCD">
    <button class="btn" id="ir">Entrar</button></div>`);
  const ir = () => {
    const c = document.getElementById("cod").value.trim().toUpperCase();
    if (c.length === 4) location.search = `?sala=${c}${MODO === "local" ? "&local=1" : ""}`;
  };
  document.getElementById("ir").addEventListener("click", ir);
  document.getElementById("cod").addEventListener("keydown", (e) => { if (e.key === "Enter") ir(); });
}

const ruta = (p) => `rooms/${sala}/${p}`;
let pid = null;
let yo = null;
let juego = null;
let players = {};
let miResp = null;
let res = null;
let escuchando = null;
let enviando = false;
let desResp = null;
let desRes = null;

async function unirse() {
  const j = await db.get(ruta("juego"));
  if (!j) {
    mensaje(`<div class="error">No encontré la sala <b>${sala}</b>. Revisa el código en la pantalla.</div>
      <a class="btn ghost" style="text-align:center;text-decoration:none" href="jugar.html${MODO === "local" ? "?local=1" : ""}">Probar otro código</a>`);
    return;
  }
  pid = store.getItem(`trivia_pid_${sala}`);
  let existente = pid ? await db.get(ruta(`players/${pid}`)) : null;
  if (!existente) {
    // el id se guarda ANTES de pedir personaje: si la página se recarga a medio camino
    // (señal lenta, volver atrás), el mismo celular recupera su personaje y no toma otro
    if (!pid) { pid = Math.random().toString(36).slice(2, 10); store.setItem(`trivia_pid_${sala}`, pid); }
    yo = await asignarAnimal(pid);
  } else {
    yo = existente;
  }
  db.listen(ruta("juego"), (v) => { juego = v; alCambiarJuego(); });
  db.listen(ruta("players"), (v) => { players = v || {}; yo = players[pid] || yo; pintar(); });
  setInterval(tick, 250);
}

async function asignarAnimal(id) {
  const orden = PERSONAJES.map((_, i) => i).sort(() => Math.random() - 0.5);
  let animal = null;
  // si este celular ya había reservado uno y se cortó antes de guardarse, lo recupera
  const tomados = (await db.get(ruta("tomados"))) || {};
  const previo = Object.keys(tomados).find((k) => tomados[k] === id);
  if (previo !== undefined && PERSONAJES[previo]) animal = PERSONAJES[previo];
  if (!animal) for (const i of orden) {
    if (await db.claim(ruta(`tomados/${i}`), id)) { animal = PERSONAJES[i]; break; }
  }
  const [nombre, emoji] = animal || [`Visita ${Math.floor(Math.random() * 90 + 10)}`, "🙂"];
  const datos = { animal: nombre, emoji, puntos: 0, ultimo: 0 };
  await db.set(ruta(`players/${id}`), datos);
  return datos;
}

function alCambiarJuego() {
  if (!juego) return;
  if (escuchando !== juego.q) {
    escuchando = juego.q;
    miResp = null;
    res = null;
    desResp?.(); desRes?.();
    if (juego.q >= 0) {
      desResp = db.listen(ruta(`resp/${juego.q}/${pid}`), (v) => { miResp = v; pintar(); });
      desRes = db.listen(ruta(`res/${juego.q}`), (v) => { res = v; pintar(); });
    }
  }
  pintar();
}

/* ---------------- acciones ---------------- */

async function responder(i) {
  if (enviando || miResp || !juego || juego.estado !== "pregunta") return;
  const P = PREGUNTAS[juego.q];
  const t = Math.max(0, Math.round(db.now() - juego.inicio));
  if (t > P.segundos * 1000 + 1500) return;
  enviando = true;
  navigator.vibrate?.(25);
  try { await db.set(ruta(`resp/${juego.q}/${pid}`), { op: i, t }); }
  finally { enviando = false; }
}

function tick() {
  if (!juego || juego.estado !== "pregunta") return;
  const P = PREGUNTAS[juego.q];
  const resto = P.segundos - (db.now() - juego.inicio) / 1000;
  const b = document.getElementById("barra");
  if (b) { b.style.width = `${Math.max(0, Math.min(100, (resto / P.segundos) * 100))}%`; b.parentElement.classList.toggle("poco", resto < 5); }
}

/* ---------------- vistas ---------------- */

const puesto = () => {
  const orden = Object.values(players).map((p) => p.puntos || 0).sort((a, b) => b - a);
  const mis = (players[pid]?.puntos) || 0;
  return { n: orden.indexOf(mis) + 1, de: orden.length };
};

function cabecera() {
  return `<div class="player-top"><span class="chip"><span class="emo">${yo.emoji}</span>${yo.animal}</span>
    <span class="puntos">${(players[pid]?.puntos) || 0} pts</span></div>`;
}

function pintar() {
  if (!yo || !juego) return;
  let html = cabecera();
  const P = PREGUNTAS[juego.q];

  if (juego.estado === "lobby") {
    html += `<div class="centro"><div class="gigante">${yo.emoji}</div>
      <h1>Eres ${yo.animal}</h1>
      <span class="secreto">🤫 Solo tú sabes quién eres</span>
      <p>En la pantalla solo se ve tu personaje. Espera a que empiece el juego.</p></div>`;
  } else if (juego.estado === "pregunta" && P) {
    if (miResp) {
      html += `<p class="pregunta-m">${P.texto}</p>`;
      html += P.opciones.map((o, i) => `<div class="op op-${i} ${i === Number(miResp.op) ? "elegida" : "apagada"}"><span class="forma">${FORMAS[i]}</span><span>${o}</span></div>`).join("");
      html += `<div class="centro" style="padding:14px"><p>✓ Respuesta enviada. Espera a los demás…</p></div>`;
    } else {
      html += `<div class="barra"><i id="barra"></i></div><p class="pregunta-m">${P.texto}</p>`;
      html += P.opciones.map((o, i) => `<button class="op op-${i}" data-i="${i}"><span class="forma">${FORMAS[i]}</span><span>${o}</span></button>`).join("");
      if (P.tipo === "sondeo") html += `<p class="eyebrow" style="text-align:center;margin-top:8px">Sondeo: no hay respuesta mala</p>`;
    }
  } else if (juego.estado === "resultado" && P) {
    const pts = (players[pid]?.ultimo) || 0;
    const { n, de } = puesto();
    let cuerpo;
    if (P.tipo === "sondeo") {
      cuerpo = miResp
        ? `<div class="gigante">🗳️</div><h2>¡Gracias!</h2><p>Tu voto quedó registrado.</p>`
        : `<div class="gigante">⏰</div><h2>Se pasó el tiempo</h2><p>Esta no suma ni resta puntos.</p>`;
    } else if (!miResp) {
      cuerpo = `<div class="gigante">⏰</div><h2 class="mal">Se acabó el tiempo</h2><p>La respuesta era <b>${P.opciones[P.correcta]}</b>.</p>`;
    } else if (Number(miResp.op) === P.correcta) {
      cuerpo = `<div class="gigante">🎉</div><h2 class="ok">¡Correcto!</h2><div class="pts">+${pts}</div>`;
    } else {
      cuerpo = `<div class="gigante">🙈</div><h2 class="mal">Casi…</h2><p>La respuesta era <b>${P.opciones[P.correcta]}</b>.</p>`;
    }
    html += `<div class="resultado">${cuerpo}${de > 1 && P.tipo === "trivia" ? `<p>Vas en el puesto <b>${n}</b> de ${de}. Solo tú ves esto.</p>` : ""}</div>`;
  } else if (juego.estado === "intro") {
    const R = RONDAS[juego.ronda];
    html += `<div class="centro"><p class="eyebrow">Ronda ${juego.ronda + 1} de ${RONDAS.length}</p>
      <h1>${R.titulo}</h1><p>${R.sub}</p>
      ${juego.ronda > 0 ? `<div class="gigante">${yo.emoji}</div><h2>Ahora eres ${yo.animal}</h2>
      <span class="secreto">🔀 Tu personaje cambió y tus puntos volvieron a cero</span>` : ""}</div>`;
  } else if (juego.estado === "ronda-fin") {
    const { n, de } = puesto();
    const hayPuntos = ((players[pid]?.puntos) || 0) > 0;
    html += `<div class="resultado"><div class="gigante">${n === 1 && hayPuntos ? "🏆" : "🙌"}</div>
      <h2>${n === 1 && hayPuntos ? "¡Ganaste la ronda!" : "Terminó la ronda"}</h2>
      ${hayPuntos ? `<p>Quedaste en el puesto <b>${n}</b> de ${de}. Solo tú ves esto.</p>` : ""}
      ${n === 1 && hayPuntos ? `<p>¡Ahora puedes levantar la mano, ${yo.animal}! 🙌</p>` : ""}
      <p>Mira la pantalla: viene un cambio de personaje.</p></div>`;
  } else if (juego.estado === "fin") {
    html += `<div class="resultado"><div class="gigante">🙌</div><h2>¡Gracias por jugar!</h2>
      <p>Mira la pantalla para ver a los ganadores de cada ronda.</p></div>`;
  }

  app.innerHTML = html;
  app.querySelectorAll("button.op").forEach((b) => b.addEventListener("click", () => responder(Number(b.dataset.i))));
  tick();
}

if (sala) unirse();
