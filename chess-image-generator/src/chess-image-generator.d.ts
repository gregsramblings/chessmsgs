export = ChessImageGenerator;
/**
 *
 * @typedef {object} Options
 * @property {number} [size] Pixel length of desired image
 * @property {string} [light] Color of light squares
 * @property {string} [dark] Color of dark squares
 * @property {"merida"|"alpha"|"cheq"} [style] Desired style of pieces
 * @property {boolean} [flipped] Whether the board is to be flipped or not
 */
/**
 * Object constructor, initializes options.
 * @param {Options} [options] Optional options

 */
declare function ChessImageGenerator(options?: Options): void;
declare class ChessImageGenerator {
  /**
   *
   * @typedef {object} Options
   * @property {number} [size] Pixel length of desired image
   * @property {string} [light] Color of light squares
   * @property {string} [dark] Color of dark squares
   * @property {"merida"|"alpha"|"cheq"} [style] Desired style of pieces
   * @property {boolean} [flipped] Whether the board is to be flipped or not
   */
  /**
     * Object constructor, initializes options.
     * @param {Options} [options] Optional options
    
     */
  constructor(options?: Options);
  chess: any;
  size: number;
  light: string;
  dark: string;
  style: "merida" | "alpha" | "cheq";
  ready: boolean;
  /**
   * Loads PGN into chess.js object.
   * @param {string} pgn Chess game PGN
   */
  loadPGN(pgn: string): Promise<void>;
  /**
   * Loads FEN into chess.js object
   * @param {string} fen Chess position FEN
   */
  loadFEN(fen: string): Promise<void>;
  /**
   * Loads position array into chess.js object
   * @param {string[][]} array Chess position array
   */
  loadArray(array: string[][]): void;
  /**
   * Generates buffer image based on position
   * @returns {Promise<Buffer>} Image buffer
   */
  generateBuffer(): Promise<any>;
  /**
   * Generates PNG image based on position
   * @param {string} pngPath File name
   */
  generatePNG(pngPath: string): Promise<void>;
}
declare namespace ChessImageGenerator {
  export { Options };
}
type Options = {
  /**
   * Pixel length of desired image
   */
  size?: number;
  /**
   * Color of light squares
   */
  light?: string;
  /**
   * Color of dark squares
   */
  dark?: string;
  /**
   * Desired style of pieces
   */
  style?: "merida" | "alpha" | "cheq";
  /**
   * Whether the board is to be flipped or not
   */
  flipped?: boolean
};
