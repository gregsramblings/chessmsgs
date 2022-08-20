const ChessImageGenerator = require(".");

const imageGenerator = new ChessImageGenerator({
    padding: [288, 44, 268, 44],
    size: 1316,
    light: '#ccc',
    dark: '#aaa'
  });
  
var fen = `r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1`;
imageGenerator.loadFEN(fen);
imageGenerator.generatePNG("test.png");
