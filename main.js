import { Board } from "./engine/Board.js";
import Scene from "./engine/Scene.js";

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

const scene = new Scene(560, 560, board);
scene.init();
scene.addAction(move => console.log(move));
scene.drawBoard();
scene.drawFigures();