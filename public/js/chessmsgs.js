var board = null

var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var $lastMove = $('#lastMove')

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

var startFen = urlParams.get('fen')
var lastFrom = urlParams.get('from')
var lastTo = urlParams.get('to')

var url = new URL(window.location)

var moveFrom = null
var moveTo = null

var moveComplete = false;


var whiteSquareGrey = '#a9ffa9'
var blackSquareGrey = '#69af69'

var game;

if (startFen) {
  $("#title").hide();
  $("#instructions").hide();
  $("#showInstructionsBtn").show();
}


function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '')
}


function greySquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}


function onMouseoverSquare(square, piece) {
  if (moveComplete) return false

  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}


function onMouseoutSquare(square, piece) {
  removeGreySquares()
}


function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false
  if (moveComplete) return false
  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
  disableBodyScroll(targetElement);
  onMouseoverSquare(source, piece)
}


function onDrop(source, target) {

  enableBodyScroll(targetElement);
  removeGreySquares()

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for now

  })

  // illegal move
  if (move === null) return 'snapback'
  console.log(source + "->" + target)
  
  moveFrom = source
  moveTo = target
  
  updateStatus()
  moveComplete = true;
  $('#copyToClipboardBtn').show();

}


// update the board position after the piece snap for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}


function updateStatus() {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }

  }

  if (game.fen() != "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    url.searchParams.set('fen', game.fen());
    if (moveFrom) url.searchParams.set('from', moveFrom);
    if (moveTo) url.searchParams.set('to', moveTo);

    window.history.pushState({}, '', url);
  }

  if (lastFrom) $lastMove.html(lastFrom + ' → ' + lastTo)


  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}


function copyToClipboard() {
  navigator.clipboard.writeText(window.location)
  $status.html("Copied! Now paste message to opponent.")

}


function showInstructions() {
  $('#title').show()
  $('#instructions').show()
  $('#showInstructionsBtn').hide()
}

if (startFen) {
  game = new Chess(startFen) // Start at passed position
} else {
  game = new Chess() // Default starting board
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)

if (startFen) board.position(startFen, false)
if (game.turn() == "b") board.orientation('black')

updateStatus()

// Highlight last move
if (lastTo) greySquare(lastTo)
if (lastFrom) greySquare(lastFrom)
setTimeout(removeGreySquares, 3000)

// Total hack to workaround Chrome iOS bug
const disableBodyScroll = bodyScrollLock.disableBodyScroll;
const enableBodyScroll = bodyScrollLock.enableBodyScroll;
const targetElement = document.querySelector('#dummy');
enableBodyScroll(targetElement);

$('#showInstructionsBtn').on('click', showInstructions)
$('#flipOrientationBtn').on('click', board.flip)
$('#copyToClipboardBtn').on('click', copyToClipboard)
