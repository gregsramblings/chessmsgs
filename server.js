var compression = require('compression')
var express = require('express')
var app = express()
app.use(compression())

var fs = require('fs')
var indexFileContent = fs.readFileSync('public/index.html', 'utf8')
var ChessImageGenerator = require('chess-image-generator');
var imageGenerator = new ChessImageGenerator({
	size: 256
});

async function createImage(img) {
	const i = img.generateBuffer();
	return i;
}

app.get('/', (req, res) => {
	// World's tiniest template engine:
	var fen = req.query.fen
	if (!fen) fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
	var modifiedFileContent = indexFileContent.replace(/{{url}}/g, "https://chessmsgs.com" + req.url)
		.replace(/{{imgUrl}}/g, "https://chessmsgs.com/fenimg/" + encodeURI(fen) + ".png")

	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
	res.header('Expires', '-1')
	res.header('Pragma', 'no-cache')
	res.send(modifiedFileContent)
})

app.get('/fenimg/*.png/', (req, res) => {

	var fen = decodeURIComponent(req.url.substr(8)).split('.')[0];
	
	console.log("FEN:" + fen);
	if(fen == '') fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // New game board

	imageGenerator.loadFEN(fen);	

	createImage(imageGenerator).then((i) => {
		res.setHeader('Content-Type', 'image/png');
	    res.setHeader("Cache-Control", "public, max-age=604800"); // Set cache for 7 days

		res.end(i);
	})
})

app.use(express.static('public'))

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`chessmsgs: listening on port ${port}`)
})