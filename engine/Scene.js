import { BLACK_COLOR, WHITE_COLOR, IMAGE, CALC_MOVE_COLOR, KILL_MOVE_COLOR, SIDE } from './config.js';
import { checkKing, getForbiddenMoves, getShahMove } from '../engine/util/KingAnalizator.js';

class Scene {
    constructor(w, h, board) {
        this.c = document.createElement('canvas');
        this.ctx = this.c.getContext('2d');
        this.c.width = w;
        this.c.height = h;
        this.w = w;
        this.h = h;
        this.cellSize = this.w / 8;
        this.board = board;
        this.allFigures = this.board.allFigures;
        this.selectedFigure = null;
        this.toggler = true;
        this.moveIs;
        this._actions = [];
    }

    getCoordsByClick(event) {
        const x = event.x - this.c.parentNode.offsetLeft - this.c.offsetLeft;
        const y = event.y - this.c.parentNode.offsetTop - this.c.offsetTop;
        return { x, y };
    }

    init() {
        const el = document.createElement('div');
        el.appendChild(this.c);
        document.body.appendChild(el);
        this.c.onclick = e => this.handleClick(e);
    }

    match(pos, coords) {
        const size = this.cellSize;
        const matchByX = pos.x * size <= coords.x && coords.x <= size * (pos.x + 1); 
        const matchByY = pos.y * size <= coords.y && coords.y <= size * (pos.y + 1);
        return matchByX && matchByY;
    }

    getKing() {
        for (const figure of this.allFigures) {
            if (figure.name === 'king' && figure.side === this.moveIs) {
                const shahMoves = getShahMove(figure, this.allFigures);
                const forbiddenMoves = getForbiddenMoves(figure, this.allFigures);
                figure.forbiddenMoves.push(...shahMoves);
                figure.forbiddenMoves.push(...forbiddenMoves);
                return figure;
            }
        }
    }

    findFigureByCoords(coords) {
        for(let i = 0; i < this.allFigures.length; i++) {
            const figure = this.allFigures[i];
            const pos = figure.position;
            const match = this.match(pos, coords);
            this.moveIs = this.toggler ? SIDE.WHITE : SIDE.BLACK;
            const king = this.getKing();
            const { shah } = checkKing(king);
            if (match && figure.side === this.moveIs && !shah) {
                return figure;
            }
            if (shah && figure.name === 'king' && match && figure.side === this.moveIs) { 
                return figure;
            }
        }
        return null;
    }

    findMoveByCoords(coords) {
        const moves = this.selectedFigure.calculateMove(this.allFigures);
        for (let i = 0; i < moves.length; i++) {
            const moveIsMatch = this.match(moves[i], coords);
            if (moveIsMatch) return moves[i]; 
        }
        return null;
    }

    findKillCellByCoords(coords) {
        const moves = this.selectedFigure.calculateMove(this.allFigures);
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].isKill) {
                const moveIsMatch = this.match(moves[i], coords);
                if (moveIsMatch) return moves[i]; 
            }
        }
        return null;
    }
    
    addAction(func) {
        this._actions.push(func);
    }

    get actions() {
        return this._actions;
    }

    runActions(move) {
        this._actions.forEach(action => action(move));
    }

    handleClick(e) {
        const coords = this.getCoordsByClick(e);
        const figure = this.findFigureByCoords(coords);
        let isKill = false;
        if(this.selectedFigure) {
            const killMove = this.findKillCellByCoords(coords);
            const selectedMove = this.findMoveByCoords(coords);
            if (killMove) {
                this.kill(killMove);
                isKill = true;
            }
            if (selectedMove) {
                this.moveFigure(selectedMove);
                this.toggler = !this.toggler;
            }
            this.selectedFigure = null;
        }
        if (figure) {
            this.selectedFigure = figure;
            !isKill && this.drawMoves(figure);
        }
    }

    kill(killMove) {
        const arr = this.allFigures;
        let killedFigure = {};
        for (const el of arr) {
            if (el.position.x === killMove.x && el.position.y === killMove.y) {
                killedFigure = el;
                break;
            }
        }
        this.allFigures = this.allFigures.filter(f => f.id !== killedFigure.id);
        const moveInfo = {...killMove, id: killedFigure.id, killed: true};
        delete moveInfo.isKill;
        this.runActions(moveInfo);
        this.board.addMove(moveInfo);
        this.drawBoard();
        this.drawFigures();
    }

    moveFigure(move) {
        const moveInfo = {...move, id: this.selectedFigure.id}
        delete moveInfo.isKill;
        this.runActions(moveInfo);
        this.selectedFigure.position = move;
        this.board.addMove(moveInfo);
        this.drawBoard();
        this.drawFigures();
    }

    drawBoard() {
        for (let i = 0; i < 8; i++) {
            let color = i % 2 ? 0 : 1;
            for (let j = 0; j < 8; j++) {
                this.ctx.fillStyle = color ? WHITE_COLOR : BLACK_COLOR;
                this.ctx.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize );
                color = !color;
            }
        }
    }

    drawFigure(figure, x, y, image) {
        const position = IMAGE[figure.name.toUpperCase()];
        const figureImagePosition = position[figure.side];
        const size = this.cellSize;
        this.ctx.drawImage(image, figureImagePosition.x, figureImagePosition.y, size, size, x, y, size, size);
    }

    drawFigures() {
        for (let i = 0; i < this.allFigures.length; i++) {
            const figure = this.allFigures[i];
            const image = new Image(360, 120);
            image.src = './imgs/ChessPiecesArray.png';
            image.onload = () => {
                const x = figure.position.x * this.cellSize;
                const y = figure.position.y * this.cellSize;
                this.drawFigure(figure, x, y, image);
                this.drawKillCells();
            }
        }
    }

    drawMoves(figure) {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.drawBoard();
        const calculatedMoves = figure.calculateMove(this.allFigures);
        for (let i = 0; i < calculatedMoves.length; i++) {
            const move = calculatedMoves[i];
            const x = move.x * this.cellSize;
            const y = move.y * this.cellSize;
            this.ctx.fillStyle = move.isKill ? KILL_MOVE_COLOR : CALC_MOVE_COLOR;
            this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        }
        this.drawFigures();
    }

    drawKillCells() {
        if (this.selectedFigure) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            const moves = this.selectedFigure.calculateMove(this.allFigures);
            for (const move of moves) {
                if (move.isKill) {
                    this.ctx.fillRect(move.x * this.cellSize, move.y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
    }
}

export default Scene;