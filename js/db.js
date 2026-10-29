// Capa de datos. Tiene dos motores con la misma interfaz:
//  - Firebase Realtime Database (el real, funciona entre celulares por internet).
//  - Local (?local=1): todo en el navegador, para probar con varias pestañas sin Firebase.
import { firebaseConfig } from "./firebase-config.js";

const params = new URLSearchParams(location.search);
export const LOCAL = params.get("local") === "1";
export const SIN_CONFIG = !LOCAL && !firebaseConfig.databaseURL;
export const MODO = LOCAL ? "local" : SIN_CONFIG ? "sin-config" : "firebase";

async function crearFirebase() {
  const V = "10.14.1";
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const m = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-database.js`);
  const d = m.getDatabase(initializeApp(firebaseConfig));
  let offset = 0;
  m.onValue(m.ref(d, ".info/serverTimeOffset"), (s) => { offset = s.val() || 0; });
  return {
    listen: (path, cb) => m.onValue(m.ref(d, path), (s) => cb(s.val())),
    get: async (path) => (await m.get(m.ref(d, path))).val(),
    set: (path, v) => m.set(m.ref(d, path), v),
    update: (path, o) => m.update(m.ref(d, path), o),
    remove: (path) => m.remove(m.ref(d, path)),
    claim: async (path, v) => {
      const r = await m.runTransaction(m.ref(d, path), (cur) => (cur === null ? v : undefined));
      return r.committed;
    },
    now: () => Date.now() + offset,
  };
}

function crearLocal() {
  const KEY = "trivia_local_db";
  const leer = () => JSON.parse(localStorage.getItem(KEY) || "{}");
  const guardar = (o) => localStorage.setItem(KEY, JSON.stringify(o));
  const partes = (p) => p.split("/").filter(Boolean);
  const getAt = (o, p) => partes(p).reduce((a, k) => (a == null ? undefined : a[k]), o);
  const setAt = (o, p, v) => {
    const ks = partes(p);
    let cur = o;
    ks.slice(0, -1).forEach((k) => { if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {}; cur = cur[k]; });
    const ult = ks[ks.length - 1];
    if (v === null || v === undefined) delete cur[ult]; else cur[ult] = v;
  };
  const oyentes = new Set();
  const disparar = () => {
    const o = leer();
    oyentes.forEach((l) => {
      const v = getAt(o, l.path);
      const s = JSON.stringify(v === undefined ? null : v);
      if (s !== l.ultimo) { l.ultimo = s; l.cb(JSON.parse(s)); }
    });
  };
  addEventListener("storage", (e) => { if (e.key === KEY) disparar(); });
  const escribir = (fn) => { const o = leer(); fn(o); guardar(o); disparar(); };
  return {
    listen(path, cb) {
      const l = { path, cb, ultimo: undefined };
      oyentes.add(l);
      queueMicrotask(disparar);
      return () => oyentes.delete(l);
    },
    get: async (path) => { const v = getAt(leer(), path); return v === undefined ? null : v; },
    set: async (path, v) => escribir((o) => setAt(o, path, v)),
    update: async (path, upd) => escribir((o) => Object.entries(upd).forEach(([k, v]) => setAt(o, `${path}/${k}`, v))),
    remove: async (path) => escribir((o) => setAt(o, path, null)),
    claim: async (path, v) => {
      let ok = false;
      escribir((o) => { if (getAt(o, path) == null) { setAt(o, path, v); ok = true; } });
      return ok;
    },
    now: () => Date.now(),
  };
}

export const db = MODO === "firebase" ? await crearFirebase() : MODO === "local" ? crearLocal() : null;

// Firebase devuelve objetos con claves "0","1"... cuando guardas listas; esto lo normaliza.
export const lista = (v) => (Array.isArray(v) ? v : Object.values(v || {}));
