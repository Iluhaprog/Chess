import { SIDE } from '../config.js';

function calculate(callback) {
    return function calc(figures) {
        const { x, y } = this.position;
        return callback(x, y, this.moveCounter, this.side, this, figures);
    }
}

function moveIsNotFigurePosition(move, figurePosition) {
    return move.x !== figurePosition.x || move.y !== figurePosition.y;
}

const hasBarier = (move, figures) => {
    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        const { x, y } = figure.position;
        if (x === move.x && y === move.y) {
            return true;
        }
    }
    return false;
}

const calculatePawn = calculate((x, y, moveCounter, side, figure, figures) => {
    const calculatedMoves = [];
    const pushMoves = factor => {
       const move = {x, y: y + 1 * factor};
        if (!hasBarier(move, figures)) {
            calculatedMoves.push({x, y: y + 1 * factor});
            if (!moveCounter) calculatedMoves.push({x, y: y + 2 * factor});
        }
    }

    side === SIDE.BLACK && pushMoves(1);
    side === SIDE.WHITE && pushMoves(-1);
    return calculatedMoves;
});

const calculateRook = calculate((x, y, moveCounter, side, figure, figures) => {
    const calculatedMoves = [];
    const pushMove = move => {
        calculatedMoves.push(move);
        if (hasBarier(move, figures)) return false;
        return true;
    }

    //move to right
    for (let i = x + 1; i < 8 && pushMove({x: i, y}); i++);
    //move to left
    for (let i = x - 1; i >= 0 && pushMove({x: i, y}); i--); 
    //move to top
    for (let i = y + 1; i < 8 && pushMove({x, y: i}); i++);
    //move to bottom
    for (let i = y - 1; i >= 0 && pushMove({x, y: i}); i--);

    return calculatedMoves.filter(move => {
        return moveIsNotFigurePosition(move, { x, y });
    });
});

const calculateKnight = calculate((x, y) => {
    const calculatedMoves = [];
    const moves = {
        m1 : { x: x - 1, y: y - 2 },
        m2 : { x: x - 2, y: y - 1 },
        m3 : { x: x - 2, y: y + 1 },
        m4 : { x: x - 1, y: y + 2 },
        m5 : { x: x + 1, y: y + 2 },
        m6 : { x: x + 2, y: y + 1 },
        m7 : { x: x + 2, y: y - 1 },
        m8 : { x: x + 1, y: y - 2 },
    };
    for (const move in moves) {
        const m = moves[move];
        if (m.x >= 0 && m.x < 8 && m.y >= 0 && m.y < 8) calculatedMoves.push(m);
    }
    return calculatedMoves;
});

const calculateElephant = calculate((x, y, moveCounter, side, figure, figures) => {
    const calculatedMoves = [];
    const pushMove = move => {
        calculatedMoves.push(move);
        if (hasBarier(move, figures)) return false;
        return true;
    }
    //move to top right
    for (let i = x + 1, j = y - 1; (i < 8 || j >= 0) && pushMove({x: i, y: j}); i++, j--);
    //move to top left
    for (let i = x - 1, j = y - 1; (i >= 0 || j >= 0) && pushMove({x: i, y: j}); i--, j--);
    //move to bottom right
    for (let i = x + 1, j = y + 1; (i < 8 || j < 8) && pushMove({x: i, y: j}); i++, j++);
    //move to bottom left
    for (let i = x - 1, j = y + 1; (i >= 0 || j < 8) && pushMove({x: i, y: j}); i--, j++);


    return calculatedMoves;
});

const calculateQueen = calculate((x, y, counter, side, figure, figures) => {
    figure.calculateRook = calculateRook;
    figure.calculateElephant = calculateElephant;
    const calculatedMoves = figure.calculateRook(figures);
    return calculatedMoves.concat(figure.calculateElephant(figures));
});

const calculateKing = calculate((x, y) => {
    const calculatedMoves = [];
    for (let i = x - 1; i < x + 2; i++) {
        if (y - 1 >= 0 && i >= 0 && i < 8) calculatedMoves.push({x: i, y: y - 1});
        if (i >= 0 && i < 8 && i !== x) calculatedMoves.push({x: i, y});
        if (y + 1 < 8 && i >= 0 && i < 8) calculatedMoves.push({x: i, y: y + 1});
    }
    return calculatedMoves;
});

const MoveCalculator = {
    calculatePawn,
    calculateRook,
    calculateKnight,
    calculateElephant,
    calculateQueen,
    calculateKing,
};

export default MoveCalculator;