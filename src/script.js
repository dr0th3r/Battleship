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

    //add validation for adjecent squares
    placeShip(ship, x, y) { //x - the leftmost piece of ship, y - the topmost piece of ship
        if (!ship) {
            throw new Error("Ship required")
        } else if (x === undefined || y === undefined) {
            throw new Error("Coordinates required")
        } else if (typeof x !== "number" || typeof y !== "number") {
            throw new Error("Coordinates must be numbers")
        } else if (ship.isHorizontal && x - 1 + ship.length < this.board[0].length) {
            for (let i = 0; i < ship.length; i++) {
                this.board[y][x + i] = ship;
            }
        } else if (!ship.isHorizontal && y - 1 + ship.length < this.board.length) {
            for (let i = 0; i < ship.length; i++) {
                this.board[y + i][x] = ship;
            }
        } else {
            throw new Error("Invalid coordinates")
        }
    }

    recieveAttack(x, y) {
        if (x === undefined || y === undefined  
            || typeof x !== "number" || typeof y !== "number"
            || x >= this.board[0].length || y >= this.board.length
        ) {
            throw new Error("Invalid coordinates") //add proper description handling later
        }
        let field = this.board[y][x];

        if (field === 1 || field === 2) {
            throw new Error("Already attacked");
        } else if (field === 0) {
            this.board[y][x] = 1
        } else { //field === ship
            this.board[y][x]?.hit();
            this.board[y][x] = 2;
        }

    }

    allShipsSunk() {
        for (const row of this.board) {
            for (const column of row) {
                if (column instanceof Ship) return false;
            }
        }

        return true;
    }
}


module.exports = {Ship, Gameboard}