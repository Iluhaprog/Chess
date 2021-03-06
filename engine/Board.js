import FigureGenerator from './util/FigureGenerator.js';
import { FIGURES_LENGTH, SIDE, BEGIN_POSITION_Y_WHITE, BEGIN_POSITION_Y_BLACK } from './config.js';

class Board {
	constructor() {
		this.whiteFigures = [];
		this.blackFigures = [];
		this.allFigures = [];
		this.moves = [];
	}

	addMove(move) {
		this.moves.push(move);
	}

	addFigures({white, black}) {
		this.whiteFigures.push(white);
		this.blackFigures.push(black);
	}

	genFigures(name, x, yB, yW, index) {
		this.addFigures({
			white: FigureGenerator[`gen${name}`](SIDE.WHITE, x, yW, index + name + SIDE.WHITE), 
			black: FigureGenerator[`gen${name}`](SIDE.BLACK, x, yB, index + name + SIDE.BLACK),
		});	
	}

	initFiguresByMoves(moves) {
		this.initFigures();

		this.moves = moves;
		for (const move of moves) {
			for(let i = 0; i < this.allFigures.length; i++) {
				const figure = this.allFigures[i];
				if (move.id == figure.id) {
					this.allFigures[i].position = move;
				}
				if (move.id === figure.id && move.killed) {
					this.allFigures = this.allFigures.slice(0, i).concat(this.allFigures.slice(i + 1));
				}
			}
		}
	}

	initFigures() {
		for (let i = 0; i <= FIGURES_LENGTH; i++) {
			const x = i < 8 ? i : FIGURES_LENGTH - i;
			if (i < 8) {
				this.genFigures('Pawn', x, BEGIN_POSITION_Y_WHITE, BEGIN_POSITION_Y_BLACK, i);
			} else if ( i === 9 || i === FIGURES_LENGTH ) {
				this.genFigures('Rook', x, 0, 7, i);
			} else if ( i === 10 || i === FIGURES_LENGTH - 1) {
				this.genFigures('Knight', x, 0, 7, i);
			} else if ( i === 11 || i === FIGURES_LENGTH - 2) {
				this.genFigures('Elephant', x, 0, 7, i);
			} else if ( i === 12 ) {
				this.genFigures('King', x, 0, 7, i);
			} else if (i === 13) {
				this.genFigures('Queen', x, 0, 7, i);
			}
		}
		this.allFigures = this.whiteFigures.concat(this.blackFigures);
	}
}

export { Board };