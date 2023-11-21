class Ship {
    constructor(length = 1, isHorizontal = true) {
        this.length = length;
        this.isHorizontal = isHorizontal;
        this.hitCount = 0;
    }

    isSunk() {
        return this.hitCount >= this.length
    }

    hit() {
        this.hitCount++;
    }
}

class Gameboard {
    constructor(columns=5, rows=5) {
        this.board = this.#createBoard(columns, rows)
        /** this.board representation
         * 0 - no ship, not searched
         * 1 - no ship, searched
         * 2 - ship, found
         * other - reference to ship
         */
    }

    #createBoard(columns, rows) {
        const board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = 0;
            }
        }

        return board
    }

    placeShip(ship, x, y) { //x - the leftmost piece of ship, y - the topmost piece of ship
        if (!ship) {
            throw new Error("Ship required")
        } else if (x === undefined || y === undefined) {
            throw new Error("Coordinates required")
        }
        else if (ship.isHorizontal && x + ship.length < this.board[0].length) {
            for (let i = 0; i < ship.length; i++) {
                this.board[0][x + i] = ship;
            }
        } else if (!ship.isHorizontal && y + ship.length < this.board.length) {
            for (let i = 0; i < ship.length; i++) {
                this.board[y + i][x] = ship;
            }
        } else {
            throw new Error("Invalid coordinates")
        }
    }
}

module.exports = {Ship, Gameboard}