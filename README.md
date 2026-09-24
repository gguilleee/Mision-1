
# Tres en raya

Mini-juego de tres en raya hecho con HTML, CSS y JavaScript 

## Cómo jugar

Abre index.html en el navegador. X empieza siempre. Al hacer click en una casilla vacía se coloca la ficha del turno. Cuando alguien completa una fila, columna o diagonal, se muestra el ganador y se resaltan las tres casillas. El botón Reiniciar partida vuelve a empezar sin perder el marcador.

Bonus — modo oscuro: pulsa la tecla D tres veces seguidas (en menos de 1 segundo) para activar/desactivar el modo oscuro.

## Estructura

index.html   → estructura de la página 
style.css    → estilos, incluida la variante de modo oscuro con CSS 
script.js    → toda la lógica del juego


## Decisiones técnicas principales

- El tablero se representa como un array de 9 posiciones (board), no como 9 variables sueltas.

- Las 9 casillas del DOM se generan  en createBoard() a partir de ese array, en vez de escribirlas a mano en el HTML.

- Los clicks se gestionan con delegación de eventos: un único listener en #board en vez de 9 listeners individuales.

- No hay ningún onclick ni atributo de evento en el HTML; todos los listeners se añaden desde script.js.



## Uso de IA

Usé Claude para generar el proyecto completo (HTML, CSS y JS), pidiéndole que me explicara cada parte antes de escribirla. Donde más necesitaba ayuda era en la lógica de JavaScript (representar el tablero, comprobar el ganador, gestionar los eventos sin handlers inline), así que le pedí que fuera explicando eso paso a paso.

Prompts que usé (resumidos):
1. Le pedí ideas de mini-juegos sencillos para una primera tarea de DOM puro, pidiéndole que me explicara el código antes de generarlo.
2. Tras elegir tres en raya, le pedí que, además del tablero, añadiera el anuncio de quién gana la partida.

Cómo lo verifiqué: abrí index.html en el navegador y probé todas las combinaciones ganadoras, el empate, que no se pueda pinchar una casilla ya ocupada, el reinicio y la tecla secreta del modo oscuro. Repasé script.js función por función hasta poder explicar qué hace cada una.


## Autopsia

1. Delegación de eventos vs. un listener por casilla. Elegí un único addEventListener('click') en #board que revisa event.target.closest('.cell'), en vez de añadir un listener a cada una de las 9 casillas al crearlas. Descarté la segunda opción porque añade más código repetido y, si el tablero se regenera, habría que recordar volver a enganchar los 9 listeners cada vez; con delegación el listener vive en el contenedor y no depende de cuántas casillas haya.

2. Regenerar el tablero completo en cada resetGame() vs solo vaciar el contenido de las casillas existentes. createBoard() hace boardEl.innerHTML = '' y vuelve a crear los 9 botones desde cero al reiniciar. Descarté la alternativa de reutilizar los mismos 9 nodos y solo limpiar su textContent/clases, que habría sido ligeramente más eficiente (menos creación de nodos). Preferí regenerar porque el código queda más simple — una única función responsable de "construir el tablero a partir del estado"
