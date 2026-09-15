
// ESTADO DEL JUEGO
// Representamos el tablero como un array de 9 posiciones.
// null = vacío, 'X' o 'O' = casilla ocupada.

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let scores = { X: 0, O: 0 };

// Las 8 combinaciones que hacen ganar (filas, columnas, diagonales)
const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
  [0, 4, 8], [2, 4, 6]             // diagonales
];


// REFERENCIAS AL DOM
// Las guardamos una vez al principio para no buscarlas
// repetidamente cada vez que algo cambia.

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const turnMarkerEl = document.getElementById('turn-marker');
const resetBtn = document.getElementById('reset-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');


// CREACIÓN DEL TABLERO
// Generamos las 9 casillas dinámicamente a partir del array
// 'board', en vez de escribirlas a mano en el HTML.

function createBoard() {
  boardEl.innerHTML = ''; // limpiamos por si se reinicia la partida

  board.forEach((value, index) => {
    const cellBtn = document.createElement('button');
    cellBtn.classList.add('cell');
    cellBtn.dataset.index = index; // guardamos la posición en el propio nodo
    boardEl.appendChild(cellBtn);
  });
}


// RENDERIZADO
// Sincroniza lo que se ve en pantalla con el array 'board'.
// Se llama cada vez que el estado cambia.

function renderBoard() {
  const cells = boardEl.querySelectorAll('.cell');

  cells.forEach((cell, index) => {
    const value = board[index];
    cell.textContent = value ?? '';
    cell.classList.remove('mark-x', 'mark-o');

    if (value === 'X') cell.classList.add('mark-x');
    if (value === 'O') cell.classList.add('mark-o');

    // Deshabilitamos la casilla si ya tiene ficha o si la partida terminó
    cell.disabled = value !== null || gameOver;
  });
}


// COMPROBAR GANADOR
// Recorre las combinaciones ganadoras y comprueba si las tres
// casillas de alguna combinación tienen el mismo valor (no nulo).
// Devuelve la combinación ganadora o null si nadie ha ganado aún.

function checkWinner(currentBoard) {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (
      currentBoard[a] &&
      currentBoard[a] === currentBoard[b] &&
      currentBoard[a] === currentBoard[c]
    ) {
      return combo;
    }
  }
  return null;
}

function isBoardFull(currentBoard) {
  return currentBoard.every(cell => cell !== null);
}

// ---------------------------------------------------------
// MANEJO DE CLICK EN UNA CASILLA (delegación de eventos)
// En vez de poner un listener por cada una de las 9 casillas,
// escuchamos los clicks en el contenedor #board y miramos
// event.target para saber cuál se pulsó.

function handleBoardClick(event) {
  const clickedCell = event.target.closest('.cell');
  if (!clickedCell || gameOver) return;

  const index = Number(clickedCell.dataset.index);
  if (board[index] !== null) return; // casilla ya ocupada

  board[index] = currentPlayer;

  const winningCombo = checkWinner(board);

  if (winningCombo) {
    endGame(`¡Ha ganado ${currentPlayer}!`, winningCombo);
  } else if (isBoardFull(board)) {
    endGame('Empate.');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.innerHTML = `Turno de <span id="turn-marker">${currentPlayer}</span>`;
  }

  renderBoard();
}


// FIN DE PARTIDA

function endGame(message, winningCombo = null) {
  gameOver = true;
  statusEl.textContent = message;

  if (winningCombo) {
    scores[currentPlayer]++;
    updateScoreboard();

    // Resaltamos las 3 casillas ganadoras
    const cells = boardEl.querySelectorAll('.cell');
    winningCombo.forEach(index => cells[index].classList.add('winning'));
  }
}

function updateScoreboard() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
}

// ---------------------------------------------------------
// REINICIAR PARTIDA
// ---------------------------------------------------------
function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  statusEl.innerHTML = `Turno de <span id="turn-marker">${currentPlayer}</span>`;
  createBoard();
  renderBoard();
}


// BONUS: MODO OSCURO CON TECLA SECRETA
// Al pulsar la tecla "D" tres veces seguidas en menos de 1s,
// se activa/desactiva el modo oscuro.

let dPressCount = 0;
let dPressTimer = null;

function handleSecretKey(event) {
  if (event.key.toLowerCase() !== 'd') return;

  dPressCount++;
  clearTimeout(dPressTimer);

  if (dPressCount === 3) {
    document.body.classList.toggle('dark-mode');
    dPressCount = 0;
  } else {
    // si no llega a 3 pulsaciones en 1 segundo, se reinicia el contador
    dPressTimer = setTimeout(() => { dPressCount = 0; }, 1000);
  }
}

// EVENT LISTENERS

boardEl.addEventListener('click', handleBoardClick);
resetBtn.addEventListener('click', resetGame);
document.addEventListener('keydown', handleSecretKey);


// INICIO

createBoard();
renderBoard();
