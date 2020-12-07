const {
  createCanvas,
  loadImage,
} = require('canvas');
const Frame = require('canvas-to-buffer');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

const {
  cols,
  white,
  black,
  defaultSize,
  defaultLight,
  defaultDark,
  deafultStyle,
  filePaths,
} = require('./config/index');

/**
 * Object constructor, initializes options.
 * @param {object} options Optional options
 * @param {number} size Pixel length of desired image
 * @param {string} light Color of light squares
 * @param {string} dark Color of dark squares
 * @param {style} style Desired style of pieces
 */
function ChessImageGenerator(options = {}) {
  this.chess = new Chess();

  this.size = options.size || defaultSize;
  this.light = options.light || defaultLight;
  this.dark = options.dark || defaultDark;
  this.style = options.style || deafultStyle;

  this.ready = false;
}

ChessImageGenerator.prototype = {
  /**
   * Loads PGN into chess.js object.
   * @param {string} pgn Chess game PGN
   */
  async loadPGN(pgn) {
    if (!this.chess.load_pgn(pgn)) {
      throw new Error('PGN could not be read successfully');
    } else {
      this.ready = true;
    }
  },

  /**
   * Loads FEN into chess.js object
   * @param {string} fen Chess position FEN
   */
  async loadFEN(fen) {
    if (!this.chess.load(fen)) {
      throw new Error('FEN could not be read successfully');
    } else {
      this.ready = true;
    }
  },

  /**
   * Loads position array into chess.js object
   * @param {Array<string>} array Chess position array
   */
  loadArray(array) {
    this.chess.clear();

    for (let i = 0; i < array.length; i += 1) {
      for (let j = 0; j < array[i].length; j += 1) {
        if (array[i][j] !== '' && black.includes(array[i][j].toLowerCase())) {
          this.chess.put(
            {
              type: array[i][j].toLowerCase(),
              color: white.includes(array[i][j]) ? 'w' : 'b',
            },
            (cols[j] + (8 - i)),
          );
        }
      }
    }
    this.ready = true;
  },

  /**
   * Generates buffer image based on position
   * @returns {Buffer} Image buffer
   */
  async generateBuffer() {
    if (!this.ready) {
      throw new Error('Load a position first');
    }

    const canvas = createCanvas(this.size, this.size);
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.rect(
      0,
      0,
      this.size,
      this.size,
    );
    ctx.fillStyle = this.light;
    ctx.fill();

    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
       
        if ((i + j) % 2 === 0) {
          ctx.beginPath();
          ctx.rect(
            ((this.size / 8) * ((7-j)+1))  - (this.size / 8),
            ((this.size / 8) * (i)) ,
            (this.size / 8) ,
            (this.size / 8) 
          );
          ctx.fillStyle = this.dark;
          ctx.fill();
        }
         
        const piece = this.chess.get(cols[7 - j] + ((7 - i) + 1));
         if (piece && piece.type !== '' && black.includes(piece.type.toLowerCase())) {
          const image = `resources/${this.style}/${filePaths[`${piece.color}${piece.type}`]}.png`;
          const imageFile = await loadImage(path.join(__dirname, image));
          await ctx.drawImage(
            imageFile,
            ((this.size / 8) * ((7-j)+1))  - (this.size / 8),
            ((this.size / 8) * (i)) ,
            (this.size / 8) ,
            (this.size / 8) 
          );
        }
      }
    }

    const frame = new Frame(canvas, {
      image: {
        types: [
          'png',
        ],
      },
    });
    return frame.toBuffer();
  },


  /**
   * Customized version of generateBuffer() specific to ChessMsgs
   * @returns {Buffer} Image buffer
   */
  async generateCustomBuffer(aspectMultiplier) {
    if (!this.ready) {
      throw new Error('Load a position first');
    }
    const imageWidth = this.size * aspectMultiplier;
    var padding = 0;

    const canvas = createCanvas(imageWidth, this.size);
    const ctx = canvas.getContext('2d');
    // ctx.fillStyle = "rgb(200,40,40)";
    // ctx.fillRect (0, 0, imageWidth, this.size);

    if(aspectMultiplier > 1.0) padding = 12;

    const boardSize = this.size - (padding*2)
    const xOffset = (imageWidth - this.size) / 2;

    ctx.beginPath();
    ctx.rect(
      xOffset+padding,
      0+padding,
      boardSize,
      boardSize,
    );
    ctx.fillStyle = this.light;
    ctx.fill();

    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
       
        if ((i + j) % 2 === 0) {
          ctx.beginPath();
          ctx.rect(
            ((boardSize / 8) * ((7-j)+1))  - (boardSize / 8) + xOffset + padding,
            ((boardSize / 8) * (i)) + padding,
            (boardSize / 8) ,
            (boardSize / 8) 
          );
          ctx.fillStyle = this.dark;
          ctx.fill();
        }
         
        const piece = this.chess.get(cols[7 - j] + ((7 - i) + 1));
         if (piece && piece.type !== '' && black.includes(piece.type.toLowerCase())) {
          const image = `resources/${this.style}/${filePaths[`${piece.color}${piece.type}`]}.png`;
          const imageFile = await loadImage(path.join(__dirname, image));
          await ctx.drawImage(
            imageFile,
            ((boardSize / 8) * ((7-j)+1))  - (boardSize / 8) + xOffset + padding,
            ((boardSize / 8) * (i)) + padding,
            (boardSize / 8) ,
            (boardSize / 8) 
          );
        }
      }
    }

    const frame = new Frame(canvas, {
      image: {
        types: [
          'png',
        ],
      },
    });
    return frame.toBuffer();
  },




  /**
   * Generates PNG image based on position
   * @param {string} pngPath File name
   */
  async generatePNG(pngPath) {
    if (!this.ready) {
      throw new Error('Load a position first');
    }

    const buffer = await this.generateBuffer();

    fs.open(pngPath, 'w', (err, fd) => {
      if (err) {
        throw new Error(`could not open file: ${err}`);
      }

      fs.write(fd, buffer, 0, buffer.length, null, (writeError) => {
        if (writeError) {
          throw new Error(`error writing file: ${writeError}`);
        }
        fs.close(fd, () => pngPath);
      });
    });
  },
};

module.exports = ChessImageGenerator;


 