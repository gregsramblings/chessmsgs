exports.createImage = (req, res) => {

	var fen = req.query.fen;
	var ChessImageGenerator = require('chess-image-generator');
	var imageGenerator = new ChessImageGenerator();
	if(fen == null) fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	imageGenerator.loadFEN(fen);

	createImage(imageGenerator).then((i) => {
		res.setHeader('Content-Type', 'image/png');
		res.end(i);
	})
};


async function createImage(img) {
	const i = img.generateBuffer();
	return i;
}

