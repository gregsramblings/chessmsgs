var board = null

var $status = $('[data-status]')
var $lastMove = $('[data-last-move]')
var $modal = $('[data-modal]')
var $modalClose = $('[data-modal-close]')
var $modalOverlay = $('[data-modal-overlay]')
var $copyInput = $('[data-copy-input]')
var $modalCopyUrlBtn = $('[data-modal-copy-url]')
var $modalShareUrlBtn = $('[data-modal-share-url]')

// Buttons
var $flipOrientationBtn = $('[data-btn-flip-orientation]')
var $copyUrlBtn = $('[data-btn-copy-url]')

var $fen = $('#fen')
var $pgn = $('#pgn')

var queryString = window.location.search
var urlParams = new URLSearchParams(queryString)

var startFen = urlParams.get('fen')
var lastFrom = urlParams.get('from')
var lastTo = urlParams.get('to')

var gid = urlParams.get('gid') || $('#myBoard').attr('data-gid') || "Unknown"

var url = new URL(window.location)

var moveFrom = null
var moveTo = null

var moveComplete = false


var whiteSquareGreen = '#a9ffa9'
var blackSquareGreen = '#69af69'

var game

function removeGreenSquares() {
  $('#myBoard .square-55d63').css('background', '')
}

function GreenSquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGreen
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGreen
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
  GreenSquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    GreenSquare(moves[i].to)
  }
}

function onMouseoutSquare(square, piece) {
  removeGreenSquares()
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
  
  onMouseoverSquare(source, piece)
}

function onDrop(source, target) {

  removeGreenSquares()

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
  moveComplete = true

  $copyUrlBtn.show()

}

// update the board position after the piece snap for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
  $copyInput.val(window.location)
  setTimeout(() => {
    openCopyModal()
  }, 700)

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

  if (game.fen() == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") { // If initial board
      url.searchParams.delete('to')
      url.searchParams.delete('from')
      url.searchParams.delete('fen')
      url.searchParams.delete('gid')
  } else {
    url.searchParams.set('fen', game.fen())
    if (moveTo) {
      url.searchParams.set('to', moveTo)
      url.searchParams.set('from', moveFrom)
      url.searchParams.set('gid',gid)
    } 
  }    

  window.history.pushState({}, '', url)
  
  if (lastFrom) $lastMove.html(lastFrom + ' → ' + lastTo)

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

function openCopyModal() {
  $modal.addClass('modal--is-visible')
  $status.html("Moved " + moveFrom + " to " + moveTo)
  $lastMove.html(moveFrom + ' → ' + moveTo)
}

function closeCopyModal() {
  $modal.removeClass('modal--is-visible')
}

function undoMove() {
  board.position(startFen)
  game.load(startFen)
  if (lastTo) {
    moveTo = lastTo 
    moveFrom = lastFrom
    $lastMove.html(lastFrom + ' → ' + lastTo)
  } else {
    moveTo = null
    moveFrom = null
  }

  updateStatus()
  moveComplete = false

  $status.html("Move undone")

}

function initClickListeners() {

  $modalClose.on('click', () => {
    closeCopyModal()
    undoMove()
  })

  $flipOrientationBtn.on('click', board.flip)
  $copyUrlBtn.on('click', copyToClipboard)
  $modalCopyUrlBtn.on('click', () => {
    setTimeout(() => {
      closeCopyModal()
    }, 2000)
    copyToClipboard()  
  })
  $modalShareUrlBtn.on('click', () => {
    shareUrl().then(() => {
      setTimeout(() => {
        closeCopyModal()
      }, 200)
    }).catch(console.error);
  })
}

function copyToClipboard() {
  $status.html("Copied - Paste to opponent!")
  navigator.clipboard.writeText(window.location)
}

async function shareUrl() {
  if (!navigator.share) {
    throw new Error("Web Share not available in this browser :(");
  }
  var colorMoved = 'Moved '
  if (game.turn() === 'w') {
    // Next player is White. Last player was Black.
    colorMoved = 'Black moved '
  }
  if (game.turn() === 'b') {
    // Next player is Black. Last player was White.
    colorMoved = 'White moved '
  }

  return navigator.share({
    title: colorMoved + moveFrom + " to " + moveTo,
    url: window.location.href
  }).then(() => {
    console.log("Shared URL " + window.location);
    $status.html("Shared to opponent!")
  });
}

if (startFen) {
  game = new Chess(startFen) // Start at passed position
} else {
  startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  game = new Chess() // Default starting board
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  moveSpeed: 'slow'
}

board = Chessboard('myBoard', config)

// Block all touch events on the chess board so it doesn't cause scrolling while moving
jQuery('#myBoard').on('scroll touchmove touchend touchstart contextmenu', function(e) {
  e.preventDefault()
});

if (startFen) board.position(startFen, false)
if (game.turn() == "b") board.orientation('black')

updateStatus()
initClickListeners()

// Highlight last move
if (lastTo) GreenSquare(lastTo)
if (lastFrom) GreenSquare(lastFrom)

// Web Share capability
if (navigator.share) {
  $modalShareUrlBtn.css({'display': 'block'})
  console.debug("Activated Web Share")
}else{
  console.debug("Web Share not available")
}