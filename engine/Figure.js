import { genId } from './util/id.js';

class Figure {
	constructor({id = genId(), name, side, position, calculateMoveMethod}){
		this._id = id;
		this._name = name;
		this._side = side;
		this._position = position;
		this.calculateMove = calculateMoveMethod;
	}

	set position(position) {
		this._position = position;
	} 

	get position() {
		return this._position;
	}

	set name(name) {
		this._name = name;
	}

	get name() {
		return this._name;
	}

	set side(side) {
		this._side = side;
	}

	get side() {
		return this._side;
	}
}

export default Figure;