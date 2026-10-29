// Servidor estático mínimo para probar en tu computador:  node serve.mjs  →  http://localhost:5173
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL(".", import.meta.url));
const tipos = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml" };

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let ruta = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
  if (!ruta || ruta.endsWith("/")) ruta += "index.html";
  try {
    const datos = await readFile(join(raiz, ruta));
    res.writeHead(200, { "Content-Type": tipos[extname(ruta)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(datos);
  } catch {
    res.writeHead(404); res.end("No encontrado");
  }
}).listen(5173, () => console.log("Trivia en http://localhost:5173"));
