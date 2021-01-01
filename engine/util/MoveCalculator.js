import { SIDE } from '../config.js';

function calculate(callback) {
    return function calc() {
        const { x, y } = this.position;
        return callback(x, y, this.moveCounter, this.side, this);
    }
}

function moveIsNotFigurePosition(move, figurePosition) {
    return move.x !== figurePosition.x || move.y !== figurePosition.y;
}

const calculatePawn = calculate((x, y, moveCounter, side) => {
    const calculatedMoves = [];
    const pushMoves = factor => {
        calculatedMoves.push({x, y: y + 1 * factor});
        if (!moveCounter) calculatedMoves.push({x, y: y + 2 * factor});
    }

    side === SIDE.BLACK && pushMoves(1);
    side === SIDE.WHITE && pushMoves(-1);
    return calculatedMoves;
});

const calculateRook = calculate((x, y) => {
    const calculatedMoves = [];
    for(let i = 0; i < 8; i++) {
        calculatedMoves.push({ x: i, y });
        calculatedMoves.push({ x, y: i });
    }
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

const calculateElephant = calculate((x, y) => {
    const calculatedMoves = [];
    let term = 1;
    const pushMove = y => {
        if (x + term < 8) calculatedMoves.push({ x: x + term, y });
        if (x - term >= 0) calculatedMoves.push({ x: x - term, y });
        term++;
    }
    const calc = (factor, condition)  => {
        for (let i = y + 1 * factor; condition(i); i += 1 * factor) {
            pushMove(i);
        }
    }
    calc(-1, i => i >= 0);
    term = 1;
    calc(1, i => i < 8);
    return calculatedMoves;
});

const calculateQueen = calculate((x, y, counter, side, figure) => {
    figure.calculateRook = calculateRook;
    figure.calculateElephant = calculateElephant;
    const calculatedMoves = figure.calculateRook();
    return calculatedMoves.concat(figure.calculateElephant());
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