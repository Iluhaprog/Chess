import MoveCalculator from './util/MoveCalculator.js';

function Figure(name, method) {
	this.name = name;
	this.calculateMoveMethod = method;
}

const PAWN = new Figure('pawn', MoveCalculator.calculatePawn);
const ROOK = new Figure('rook', MoveCalculator.calculateRook);
const KNIGHT = new Figure('knight', MoveCalculator.calculateKnight);
const ELEPHANT = new Figure('elephant', MoveCalculator.calculateElephant);
const QUEEN = new Figure('queen', MoveCalculator.calculateQueen);
const KING = new Figure('king', MoveCalculator.calculateKing);

const BLACK = 'black';
const WHITE = 'white'; 

const FIGURES_LENGTH = 16;
const SIDE = { BLACK, WHITE }
const FIGURE = {
	PAWN,
	ROOK,
	KNIGHT,
	ELEPHANT,
	QUEEN,
	KING,
};

const BEGIN_POSITION_Y_WHITE = 1;
const BEGIN_POSITION_Y_BLACK = 6;


const BLACK_COLOR = '#6e6e6e';
const WHITE_COLOR = '#e8e8e8';
const CALC_MOVE_COLOR = 'rgba(106, 230, 92, 0.6)';
const KILL_MOVE_COLOR = 'rgba(235, 86, 75, 0.6)'


function ImagePosition(x) {
	this.white = { x: x - 5, y: 55 };
	this.black = { x: x - 5, y: -5 };
}

const IMAGE = {
	QUEEN: new ImagePosition(0),
	KING: new ImagePosition(60),
	ROOK: new ImagePosition(120),
	KNIGHT: new ImagePosition(180),
	ELEPHANT: new ImagePosition(240),
	PAWN: new ImagePosition(300),
}

export {
	FIGURES_LENGTH,
	FIGURE,
	SIDE,
	BEGIN_POSITION_Y_BLACK,
	BEGIN_POSITION_Y_WHITE,
	BLACK_COLOR,
	WHITE_COLOR,
	CALC_MOVE_COLOR,
	KILL_MOVE_COLOR,
	IMAGE,
};