var compression = require('compression')
var express = require('express')
var app = express()
var requestIp = require('request-ip');

app.use(compression())
app.use(requestIp.mw())

var fs = require('fs')

var indexFileContent = fs.readFileSync('public/index.html', 'utf8')
var ChessImageGenerator = require('./chess-image-generator')

var imageGenerator = new ChessImageGenerator({
	size: 400,
	highlight: "rgba(119, 225, 129, 0.8)"
});
var nanoid = require('nanoid')

async function createImage(img, aspectMultiplier) {
	const i = img.generateBuffer(aspectMultiplier)
	return i
}
app.get('/', (req, res) => {
	var fen = req.query.fen
	if (fen) {
		var from = req.query.from
		var to = req.query.to
		var gid = req.query.gid
		console.log("GAME:" + gid + "|" + from + "|" + to + "|" + fen + "|")
		// World's tiniest template engine:
		var modifiedFileContent = indexFileContent.replace(/{{url}}/g, "https://chessmsgs.com" + req.url)
			.replace(/{{imgUrl}}/g, "https://chessmsgs.com/fenimg/v5/" + encodeURI(fen) + "+" + from + "+" + to + ".png")

	} else {
		fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
		var modifiedFileContent = indexFileContent.replace(/{{url}}/g, "https://chessmsgs.com")
			.replace(/{{imgUrl}}/g, "https://chessmsgs.com/img/chessmsgs-site-banner.png?v2")
	}

	
	if(req.url == '/') {
		modifiedFileContent = modifiedFileContent.replace(/{{gid}}/g, nanoid.nanoid())
	}

	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
	res.header('Expires', '-1')
	res.header('Pragma', 'no-cache')
	res.send(modifiedFileContent)
})

app.get('/fenimg/v*/*.png/', (req, res) => {
	// Dynamically set aspect ratio based on which service is requesting the image
	if(req.get('User-Agent').search("Facebot Twitterbot") >= 0) fenImageAspectRatio = 1.0 // Checking for Apple iMessage (weird string for Apple)
	else if(req.get('User-Agent').search("Slack") >= 0) fenImageAspectRatio = 1.0 // Checking for Slack
	else fenImageAspectRatio = 2.1 // Everything else looks best as 2.1

	var boardInfo = decodeURIComponent(req.url.substr(11)).split('.')[0];
	var fen  = boardInfo.split('+')[0]
	var from = boardInfo.split('+')[1]
	var to 	 = boardInfo.split('+')[2]
	
	if(fen == '') fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // New game board

	// Flip board if black's turn
	if(fen.split(" ")[1] == "w") {
		imageGenerator.flipped = false
	} else {
		imageGenerator.flipped = true
	}
	imageGenerator.loadFEN(fen);	

	if(from != '') imageGenerator.highlightSquares([from, to]);

	createImage(imageGenerator,fenImageAspectRatio).then((i) => {
		res.setHeader('Content-Type', 'image/png');
	    res.setHeader("Cache-Control", "public, max-age=604800"); // Set cache for 7 days

		res.end(i);
	})
})


app.use(express.static('public', {maxAge: 31557600000 }))

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`chessmsgs: listening on port ${port}`)
})
