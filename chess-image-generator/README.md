<div align="center">
    <img width="400" align="center"src="https://raw.githubusercontent.com/andyruwruw/chess-image-generator/master/documentation/logo.svg"/><br/>
</div>

<p align="center">Create PNG or Buffers of Chess Positions.</p>

<p align="center" style="margin: 0px auto; margin-top: 15px; max-width: 600px">
    <a href="https://www.npmjs.com/package/chess-image-generator"><img src="https://img.shields.io/npm/v/chess-image-generator"></a>
    <a href="#"><img src="https://img.shields.io/npm/dt/chess-image-generator"/></a>
</p>

# Overview

chess-image-generator creates a **PNG file** or **PNG Buffer** from either a:
- FEN
- PGN
- array data

Passed in options allow you to choose:
- size of the canvas
- colors of board
- style of pieces

Output to either:
- a PNG to given path
- PNG Buffer

# Documentation

- [Installation](#installation)
- [Loading in a Chess Position](#loading-in-a-chess-position)
    - [FEN](#loading-by-fend)
    - [PGN](#loading-by-pgn)
    - [Array of Characters](#loading-by-array)
- [Generating Images](#generate-an-image)
    - [into PNG](#generate-a-png)
    - [into Buffer](#generate-a-buffer)
- [Image Customization](#image-customization)
    - [Canvas Size](#canvas-size)
    - [Board Colors](#board-colors)
    - [Piece Style](#piece-style)
- [Dependencies](#dependencies)


# Installation

Install via node:

    $ npm i -S chess-image-generator

Then import the package and instantiate:
```
var ChessImageGenerator = require('chess-image-generator');

var imageGenerator = new ChessImageGenerator();
```
or pass in [options for customization](#image-customization):
```
var ChessImageGenerator = require('chess-image-generator');

var imageGenerator = new ChessImageGenerator({
    size: 720,
    light: 'rgb(200, 200, 200)',
    dark: '#333333',
    style: 'merida'
});
```

Load in your chess position with [one of three methods](#loading-in-a-chess-position) depending on the format of your board position, and [export to PNG file or Buffer](#generate-an-image).

# Loading in a Chess Position

Once you've created an instance of the chess-image-generator, you can load a chess position using one of three formats.

### Available Formats
- [Forsyth–Edwards Notation (FEN)](#loading-by-fend)
- [Portable Game Notation (PGN)](#loading-by-pgn)
- [Array of Characters](#loading-by-array)

# Loading By FEN

```
.loadFEN(fen)
```
| Parameter    | Type     | Description          |
|---------|----------|----------------------|
| fen | `string` | Board FEN. |

FEN appears in the follow [format](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation): 

```
r2qk2r/p1p5/bpnbp2p/1N1p1p2/P2P1p1N/2PQ2P1/1P2PPBP/R4RK1 b kq - 1 13
```
Each piece is notated by a character.

| Char           | Value                   | Example            |
|----------------|-------------------------|--------------------|
| Uppercase Char | *White Pieces*          | *K, Q, R, B, N, P* |
| Lowercase Char | *Black Pieces*          | *k, q, r, b, n, p* |
| Slash          | *New Row*               | */*                |
| Numbers        | *Count of blank spaces* |  *3, 1, 4*         |

# Loading by PGN

```
.loadPGN(pgn)
```

| Parameter    | Type     | Description          |
|---------|----------|----------------------|
| pgn | **string** | Game PGN. |


PGN appears in the follow [format](https://en.wikipedia.org/wiki/Portable_Game_Notation):

```
[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {This opening is called the Ruy Lopez.}
4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15. Nb1 h6 16. Bh4 c5 17. dxe5
Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21. Nc4 Nxc4 22. Bxc4 Nb6
23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7 27. Qe3 Qg5 28. Qxg5
hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33. f3 Bc8 34. Kf2 Bf5
35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5 40. Rd6 Kc5 41. Ra6
Nf2 42. g4 Bd3 43. Re6 1/2-1/2
```

[Chess.com's Published-Data API](https://www.chess.com/news/view/published-data-api) returns games in this format. If you want to use their API check out the [chess-web-api](https://www.npmjs.com/package/chess-web-api) wrapper I created for it!.

# Loading by Array

```
.loadArray(array)
```
| Parameter    | Type     | Description          |
|---------|----------|----------------------|
| array | `array of arrays` | Board array with characters. |

Array should be passed with the following format:

```
[
    ['r','n','b','q','k','b','n','r',],
    ['p','p','p','p','p','p','p','p',],
    [' ',' ',' ',' ',' ',' ',' ',' ',],
    [' ',' ',' ',' ',' ',' ',' ',' ',],
    [' ',' ',' ',' ',' ',' ',' ',' ',],
    [' ',' ',' ',' ',' ',' ',' ',' ',],
    ['P','P','P','P','P','P','P','P',],
    ['R','N','B','Q','K','B','N','R',],
]
```

Piece notation follows the same rules as [FEN](#loading-by-fen).

| Char           | Value                   | Example            |
|----------------|-------------------------|--------------------|
| Uppercase Char | *White Pieces*          | *K, Q, R, B, N, P* |
| Lowercase Char | *Black Pieces*          | *k, q, r, b, n, p* |

# Generate an Image

After you've loaded a chess position into an instance of the chess-image-generator, use the following functions to generate your image with one of two outputs:
- [PNG with Path](#generate-a-png)
- [PNG Buffer](#generate-a-buffer)

# Generate a PNG
```
.generatePNG(path)
```

The path should be relative to where it is called and include the end name of the PNG.

A new PNG file will be generated with position.

| Parameter    | Type     | Description          |
|---------|----------|----------------------|
| path | **string** | Path of where to save PNG, relative to method call. |

| Return Type     | Return Description          |
|----------|----------------------|
| `string` | Path to PNG |

# Generate a Buffer

```
.generateBuffer()
```

The buffer will be returned from the function. Use promises or async await to ensure its completion.

| Return Type     | Return Description          |
|----------|----------------------|
| `Buffer` | PNG Buffer |

# Image Customization

You have three options for customization of the resulting PNG:
- [Canvas Size](#canvas-size)
- [Board Colors](#board-colors)
- [Piece Style](#piece-style)

These customizations are passed to the constructor when you create an instance of chess-image-generator:

```
var imageGenerator = new ChessImageGenerator({
    size: 720,
    light: 'rgb(200, 200, 200)',
    dark: '#333333',
    style: 'merida'
});
```

# Canvas Size

| Option | Type     | Default | Example          |
|----------|----------|---------|------------------|
| size     | `number` | *480*    | *250, 800, 1200* |

Canvas size determines in **pixels** how large the resulting PNG will be.

### Example:
```
var imageGenerator = new ChessImageGenerator({
    size: 1200,
});
```
The resulting PNG's will be 1200px by 1200px.

# Board Colors

| Option | Type     | Default | Example          |
|----------|----------|---------|------------------|
| light     | `string` | *"rgb(181, 136, 99)"* | *"rgb(250,250,250)", "white", "#ffffff"* |
| dark     | `string` | *"rgb(181, 136, 99)"* | *"rgb(0,0,0)", "black", "#000000"* |

Light and dark determines the colors of both the light and dark squares respectively.

Colors can be passed in a variety of formats:

| Color Type             | Example                      |
|------------------------|------------------------------|
| Hexadecimal Color      | *"#00FF00"*                  |
| RGB Color              | *"rgb(20, 20, 20)"*          |
| RGBA Color             | *"rgba(20, 20, 20, .8)"*     |
| HSL Color              | *"hsl(120, 100%, 50%)"*      |
| HSLA Color             | *"hsla(120, 60%, 70%, 0.3)"* |
| Predefined Color Names | *"blue"*                     |

## Default Coloring:
<p align="">
    <img width="300" src="./documentation/colors1.png">
</p>

## Customized Coloring:
<p align="">
    <img width="300" src="./documentation/colors2.png">
</p>

### Example:

```
var imageGenerator = new ChessImageGenerator({
    light: 'rgb(200, 200, 200)',
    dark: 'rgb(20, 20, 20)',
});
```


# Piece Style

| Option | Type     | Default | Example          |
|----------|----------|---------|------------------|
| style     | *string* | *"merida""* | *"alpha", "cheq"* |

The piece style determines the used style of pieces to create the image.

## Style Choices:
- alpha

<div style="flex">
    <img width="60" src="./src/resources/alpha/BlackKing.png">
    <img width="60" src="./src/resources/alpha/WhiteQueen.png">
    <img width="60" src="./src/resources/alpha/BlackRook.png">
    <img width="60" src="./src/resources/alpha/WhiteKnight.png">
    <img width="60" src="./src/resources/alpha/BlackBishop.png">
    <img width="60" src="./src/resources/alpha/WhitePawn.png">
</div>

- cburnett

<div style="flex">
    <img width="60" src="./src/resources/cburnett/BlackKing.png">
    <img width="60" src="./src/resources/cburnett/WhiteQueen.png">
    <img width="60" src="./src/resources/cburnett/BlackRook.png">
    <img width="60" src="./src/resources/cburnett/WhiteKnight.png">
    <img width="60" src="./src/resources/cburnett/BlackBishop.png">
    <img width="60" src="./src/resources/cburnett/WhitePawn.png">
</div>

- cheq

<div style="flex">
    <img width="60" src="./src/resources/cheq/BlackKing.png">
    <img width="60" src="./src/resources/cheq/WhiteQueen.png">
    <img width="60" src="./src/resources/cheq/BlackRook.png">
    <img width="60" src="./src/resources/cheq/WhiteKnight.png">
    <img width="60" src="./src/resources/cheq/BlackBishop.png">
    <img width="60" src="./src/resources/cheq/WhitePawn.png">
</div>

- leipzig

<div style="flex">
    <img width="60" src="./src/resources/leipzig/BlackKing.png">
    <img width="60" src="./src/resources/leipzig/WhiteQueen.png">
    <img width="60" src="./src/resources/leipzig/BlackRook.png">
    <img width="60" src="./src/resources/leipzig/WhiteKnight.png">
    <img width="60" src="./src/resources/leipzig/BlackBishop.png">
    <img width="60" src="./src/resources/leipzig/WhitePawn.png">
</div>

- merida 

<div style="flex">
    <img width="60" src="./src/resources/merida/BlackKing.png">
    <img width="60" src="./src/resources/merida/WhiteQueen.png">
    <img width="60" src="./src/resources/merida/BlackRook.png">
    <img width="60" src="./src/resources/merida/WhiteKnight.png">
    <img width="60" src="./src/resources/merida/BlackBishop.png">
    <img width="60" src="./src/resources/merida/WhitePawn.png">
</div>

All images were found at [Marcel van Kervinck](https://marcelk.net/chess/pieces/)! Thanks :)


### Example:

```
var imageGenerator = new ChessImageGenerator({
    style: alpha,
});
```

# Dependencies

- [canvas](https://www.npmjs.com/package/canvas)
- [canvas-to-buffer](https://www.npmjs.com/package/canvas-to-buffer)
- [chess.js](https://www.npmjs.com/package/chess.js)
- [fs](https://www.npmjs.com/package/fs)
- [path](https://www.npmjs.com/package/path)

---

## Hope you make some cool stuff!
![dog](https://media.giphy.com/media/100QWMdxQJzQC4/giphy.gif)
### - Andrew Young