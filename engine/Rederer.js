import { BLACK_COLOR, WHITE_COLOR, IMAGE, CALC_MOVE_COLOR} from './config.js';

class Renderer {
    constructor(w, h, board) {
        this.c = document.createElement('canvas');
        this.ctx = this.c.getContext('2d');
        this.c.width = w;
        this.c.height = h;
        this.w = w;
        this.h = h;
        this.cellSize = this.w / 8;
        this.board = board;
        this.allFigures = this.board.whiteFigures.concat(this.board.blackFigures);
        this.selectedFigure = null;
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

    findFigureByCoords(coords) {
        for(let i = 0; i < this.board.whiteFigures.length; i++) {
            const figureW = this.board.whiteFigures[i];
            const figureB = this.board.blackFigures[i];
            const wPos = figureW.position;
            const bPos = figureB.position;
            const matchForWhite = this.match(wPos, coords);
            const matchForBlack = this.match(bPos, coords);
            if (matchForWhite) {
                return figureW;
            }
            if (matchForBlack) {
                return figureB;
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

    handleClick(e) {
        const coords = this.getCoordsByClick(e);
        const figure = this.findFigureByCoords(coords);
        if (figure) {
            this.drawMoves(figure);
            this.selectedFigure = figure;
        }
        if(this.selectedFigure) {
            const selectedMove = this.findMoveByCoords(coords);
            if (selectedMove) {
                this.moveFigure(selectedMove);
            }
        }
    }

    moveFigure(move) {
        this.selectedFigure.position = move;
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
        for (let i = 0; i < this.board.whiteFigures.length; i++) {
            const figureW = this.board.whiteFigures[i];
            const figureB = this.board.blackFigures[i];
            const image = new Image(360, 120);
            image.src = './imgs/ChessPiecesArray.png';
            image.onload = () => {
                const xW = figureW.position.x * this.cellSize;
                const yW = figureW.position.y * this.cellSize;
                const xB = figureB.position.x * this.cellSize;
                const yB = figureB.position.y * this.cellSize;
                this.drawFigure(figureW, xW, yW, image);
                this.drawFigure(figureB, xB, yB, image);
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
            this.ctx.fillStyle = CALC_MOVE_COLOR;
            this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        }
        this.drawFigures();
    }
}

export default Renderer;