import MoveCalculator from './MoveCalculator.js';

function matchWith(move) {
    const { x, y } = move;
    return this.position.x === x && this.position.y === y;
}

function getForbiddenMoves(king = {}, figures = {}) {
    const enemyFigures = figures.filter(figure => king.side !== figure.side);
    const kingMoves = king.calculateMove(figures);
    const allEnemyMoves = [];
    const result = [];
    for (let i = 0; i < enemyFigures.length; i++) {
        const enemyFigure = enemyFigures[i];
        let moves = enemyFigure.calculateMove(figures);
        if (enemyFigure.name === 'pawn') {
            const { x, y } = enemyFigure.position
            moves = MoveCalculator.shadowCalcPawn(x, y, enemyFigure.moveCounter, enemyFigure.side, figures);
        }
        allEnemyMoves.push(...moves);
    }
    for (const kingMove of kingMoves) {
        for(const enemyMove of allEnemyMoves) {
            if (enemyMove.x === kingMove.x && enemyMove.y === kingMove.y) {
                result.push(kingMove);
            }
        }
    }
    return result;
}

function getShahMove(king = {}, figures = []) {
    king.matchWith = matchWith;
    const enemyFigures = figures.filter(figure => king.side !== figure.side);
    let result = [];
    for (let i = 0; i < enemyFigures.length; i++) {
        const enemyFigure = enemyFigures[i];
        const moves = enemyFigure.calculateMove(figures);
        const matchingMoves = moves.filter(move => king.matchWith(move));
        result = [...result, ...matchingMoves];
    }
    return result;
}

function isShah(king) {
    const forbiddenMoves = king.forbiddenMoves;
    const { x, y } = king.position;
    for (const forbiddenMove of forbiddenMoves) {
        if (forbiddenMove.x === x && forbiddenMove.y === y) {
            return true;
        }
    }
    return false;
}

function checkKing(king) {
    return { shah: isShah(king) };
}

export { getShahMove, getForbiddenMoves, checkKing };