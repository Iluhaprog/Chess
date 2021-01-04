import { Board } from "./engine/Board.js";
import Scene from "./engine/Scene.js";

const board = new Board();
board.initFigures();

const scene = new Scene(560, 560, board);
scene.init();
scene.addAction(move => console.log(move));
scene.drawBoard();
scene.drawFigures();