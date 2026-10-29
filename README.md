# Trivia del Día

Trivia en vivo para la reunión del Día de las Iglesias Evangélicas y Protestantes.
El anfitrión proyecta la pantalla, la gente entra escaneando un QR y juega desde su celular.
Cada jugador recibe un animal al azar: en el proyector nadie ve nombres, y cada uno ve en privado si acertó.

- `anfitrion.html` — pantalla del proyector (QR, preguntas, resultados, podio).
- `jugar.html` — pantalla del celular (se abre con el QR).
- `js/datos.js` — **las preguntas** (se pueden editar) y la lista de animales.
- `js/firebase-config.js` — datos de tu proyecto de Firebase.

Sin cuentas ni apps para los jugadores. Solo necesitan internet (datos móviles o wifi, no tienen que estar en la misma red).

## 1. Conectar Firebase (una sola vez, ~10 minutos)

Firebase es el "buzón" gratis de Google donde llegan las respuestas en vivo.

1. Entra a https://console.firebase.google.com con tu cuenta de Google.
2. **Agregar proyecto** → ponle un nombre (ej. `trivia-iglesia`) → desactiva Google Analytics → **Crear**.
3. Menú izquierdo: **Compilación → Realtime Database → Crear base de datos**. Elige cualquier ubicación y **modo de prueba**.
4. En la pestaña **Reglas**, borra lo que haya, pega esto y toca **Publicar**:

   ```json
   {
     "rules": {
       "rooms": {
         "$sala": { ".read": true, ".write": true }
       }
     }
   }
   ```

5. Rueda dentada ⚙ → **Configuración del proyecto → General → Tus apps → ícono web `</>`** → registra la app (cualquier nombre, sin Hosting). Te muestra un bloque `firebaseConfig`.
6. Copia esos valores en `js/firebase-config.js`. **`databaseURL` es el más importante**: si no aparece en el bloque, cópialo de la parte de arriba de la página de Realtime Database (empieza con `https://` y termina en `firebaseio.com`).

## 2. Probar en tu computador

```
node serve.mjs
```

Abre http://localhost:5173/anfitrion.html. Para probar **sin Firebase**, agrega `?local=1` al final (funciona entre pestañas del mismo navegador).

## 3. Publicar en GitHub Pages

Sube la carpeta a un repositorio y activa Pages (**Settings → Pages → Branch: main, carpeta / (root)**).
La dirección queda como `https://TU-USUARIO.github.io/trivia-iglesia/anfitrion.html`.

## El día del evento

1. En el computador del proyector abre `anfitrion.html`. Aparece el QR y un código de 4 letras.
2. La gente escanea el QR (o entra a `jugar.html` y escribe el código).
3. Cuando estén todos, toca **Empezar**. Con Espacio o Enter pasas a la siguiente.
4. La pregunta se cierra sola cuando todos responden o se acaba el tiempo.

Prueba todo con 2 o 3 celulares **antes** del domingo. Después de la actividad puedes borrar el proyecto de Firebase.
