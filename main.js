import { Board } from "./engine/Board.js";
import Renderer from "./engine/Rederer.js";

const board = new Board();

const moves = [
    {
        x: 2,
        y: 2,
        id: '1Pawnwhite',
    },
    {
        x: 3,
        y: 3,
        id: '0Pawnblack',
        killed: true,
    },
    {
        x: 0,
        y: 4,
        id: '13Queenwhite',
        killed: true,
    }
];

board.initFiguresByMoves(moves);
console.log(board);

const rederer = new Renderer(560, 560, board);
rederer.init();
rederer.drawBoard();
rederer.drawFigures();