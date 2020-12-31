import { Board } from "./engine/Board.js";
import Renderer from "./engine/Rederer.js";

const b = new Board();

const rederer = new Renderer(560, 560, b);
rederer.init();
rederer.drawBoard();
rederer.drawFigures();