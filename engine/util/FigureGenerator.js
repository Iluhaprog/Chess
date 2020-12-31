import Figure from '../Figure.js';
import { FIGURE } from '../config.js';

const genFigure = figure => (side, x, y) => new Figure({
    name: figure.name,
    side: side,
    position: { x, y },
    calculateMoveMethod: figure.calculateMoveMethod,
});

const genPawn = genFigure(FIGURE.PAWN);
const genRook = genFigure(FIGURE.ROOK);
const genKnight = genFigure(FIGURE.KNIGHT);
const genElephant = genFigure(FIGURE.ELEPHANT);
const genQueen = genFigure(FIGURE.QUEEN);
const genKing = genFigure(FIGURE.KING);

const FigureGenerator = {
    genPawn,
    genRook,
    genKing,
    genKnight,
    genElephant,
    genQueen,
};

export default FigureGenerator;