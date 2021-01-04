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

function normalizeMoves(moves, side, figures) {
    const result = [];
    for (let i = 0; i < moves.length; i++) {
        let isSelf = false;
        const move = moves[i];
        move.isKill = false;
        for (let j = 0; j < figures.length; j++) {
            const { x, y } = figures[j].position;
            if (x === move.x && y === move.y && figures[j].side) {
                move.isKill = true;
            }
            if (x === move.x && y === move.y && figures[j].side === side) {
                isSelf = true;
                break;
            }
        }
        !isSelf && result.push(move);
    }
    return result;
}

function normalizeMovesPawn(moves, figure, figures) {
    let result = new Set();
    for (const move of moves) {
        for (const f of figures) {
            const { x, y } = f.position;
            if (move.x === x && move.y === y && f.side !== figure.side && move.x !== figure.position.x && move.isKill) {
                result.add(move);
            }
            if (!move.isKill) {
                result.add(move);
            }
        }
    }
    result = Array.from(result);
    for (let i = 0; i < result.length; i++) {
        const move = moves[i];
        for (const f of figures) {
            const { x, y } = f.position;
            if (!move.isKill && x === move.x && y === move.y) {
                result[i] = {};
            }
        }
    }
    return result;
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
    const pushMoves = (factorX, factorY, isKill = false) => {
        const move = {x: x + 1 * factorX, y: y + 1 * factorY, isKill};
        calculatedMoves.push(move);
        if (!moveCounter && !hasBarier(move, figures) && !factorX) calculatedMoves.push({x, y: y + 2 * factorY});
    }

    side === SIDE.BLACK && pushMoves(0, 1);
    side === SIDE.WHITE && pushMoves(0, -1);
    side === SIDE.BLACK && pushMoves(-1, 1, true);
    side === SIDE.BLACK && pushMoves(1, 1, true);
    side === SIDE.WHITE && pushMoves(-1, -1, true);
    side === SIDE.WHITE && pushMoves(1, -1, true);
    return normalizeMovesPawn(calculatedMoves, figure, figures);
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

    return normalizeMoves(calculatedMoves.filter(move => {
        return moveIsNotFigurePosition(move, { x, y });
    }), side, figures);
});

const calculateKnight = calculate((x, y, moveCounter, side, figure, figures) => {
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
    return normalizeMoves(calculatedMoves, side, figures);
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


    return normalizeMoves(calculatedMoves, side, figures);
});

const calculateQueen = calculate((x, y, counter, side, figure, figures) => {
    figure.calculateRook = calculateRook;
    figure.calculateElephant = calculateElephant;
    const calculatedMoves = figure.calculateRook(figures);
    return calculatedMoves.concat(figure.calculateElephant(figures));
});

const calculateKing = calculate((x, y, counter, side, figure, figures) => {
    const calculatedMoves = [];
    for (let i = x - 1; i < x + 2; i++) {
        if (y - 1 >= 0 && i >= 0 && i < 8) calculatedMoves.push({x: i, y: y - 1});
        if (i >= 0 && i < 8 && i !== x) calculatedMoves.push({x: i, y});
        if (y + 1 < 8 && i >= 0 && i < 8) calculatedMoves.push({x: i, y: y + 1});
    }
    return normalizeMoves(calculatedMoves, side, figures);
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