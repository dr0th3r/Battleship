const COUNT_OF_3x1_SHIPS = 1;

const COUNT_OF_1x2_SHIPS = 2;

const COUNT_OF_1x1_SHIPS = 3;

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
    constructor(columns=5, rows=5, boardContainer, setupListeners = false, game = null) {
        this.board = this.#createBoard(columns, rows);
        /** this.board representation
         * 0 - no ship, not searched
         * 1 - no ship, searched
         * 2 - ship, found
         * other - reference to ship
        */
    
        this.boardContainer = boardContainer;
        this.interactable = true;
        this.setupListeners = setupListeners;
        this.game;
        this.game = game;

        this.renderBoard();
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

    setupBoard() {
        const rowCount = this.board.length;
        const columnCount = this.board[0].length;

        let i = 0;
        while (i < COUNT_OF_1x1_SHIPS) {
            const x_coord = Math.floor(Math.random() * columnCount);
            const y_coord = Math.floor(Math.random() * rowCount);

            const ship = new Ship(1, true);

            if (ship.isHorizontal && x_coord - 1 + ship.length < columnCount) {
                this.placeShip(ship, x_coord, y_coord)
                i++;
            } else if (!ship.isHorizontal && y_coord - 1 + ship.length < rowCount) {
                this.placeShip(ship, x_coord, y_coord);
                i++;
            }
        } 


        i = 0;
        while (i < COUNT_OF_1x2_SHIPS) {
            const x_coord = Math.floor(Math.random() * columnCount);
            const y_coord = Math.floor(Math.random() * rowCount);

            const ship = new Ship(2, true);

            if (ship.isHorizontal && x_coord - 1 + ship.length < columnCount) {
                this.placeShip(ship, x_coord, y_coord)
                i++;
            } else if (!ship.isHorizontal && y_coord - 1 + ship.length < rowCount) {
                this.placeShip(ship, x_coord, y_coord);
                i++;
            }
        }
        
        this.renderBoard();

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

    renderBoard() {
        this.boardContainer.innerHTML = "";

        const rowCount = this.board.length;
        const columnCount = this.board[0].length;

        this.boardContainer.style = `
            display: grid;
            grid-template-columns: repeat(${columnCount}, 100px)
        `

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < columnCount; j++) {
                const fieldEl = this.createField(this.board[i][j]);
                this.boardContainer.append(fieldEl);
                
                if (this.setupListeners) {
                    fieldEl.addEventListener("click", () => {
                        if (this.interactable) {
                            const hit = this.recieveAttack(j, i);
                            console.log(hit);
                            !hit && this.game.takeTurn();
                        }
                    })
                }
            }
        }
    }

    createField(field) {
        const fieldEl = document.createElement("div");
        fieldEl.className = "field";

        if (field === 1 || field === 2) {
            fieldEl.className = "field red";
        } else if (field instanceof Ship) {
            fieldEl.className = "field ship";
        }

        return fieldEl;
    }

    recieveAttack(x, y) {
        if (x === undefined || y === undefined  
            || isNaN(x) || isNaN(y)
            || typeof x !== "number" || typeof y !== "number"
            || x >= this.board[0].length || y >= this.board.length
        ) {
            throw new Error("Invalid coordinates") //add proper description handling later
        }
        let field = this.board[y][x];

        if (field === 1 || field === 2) {
            throw new Error("Already attacked");
        } else if (field === 0) {        
            this.board[y][x] = 1;

            this.renderBoard(); //optimize later
    
            if (this.allShipsSunk() && this.setupListeners) {
                setTimeout(() => {
                    console.log(this.game.gameStatusEl);
                    this.game.gameStatusEl.innerText = "Victory";
                    this.game.startGame();
                }, 0);
            } else if (this.allShipsSunk()) {
                setTimeout(() => {
                    console.log(this.game.gameStatusEl);
                    this.game.gameStatusEl.innerText = "Defeat";
                    this.game.startGame();
                    return false;
                }, 0)
            }

            return false;
        } else { //field === ship
            this.board[y][x]?.hit();
            this.board[y][x] = 2;

            this.renderBoard(); //optimize later
    
            if (this.allShipsSunk() && this.setupListeners) {
                setTimeout(() => {
                    console.log(this.game.gameStatusEl);
                    this.game.gameStatusEl.innerText = "Victory";
                    this.game.startGame();
                }, 0);
            } else if (this.allShipsSunk()) {
                setTimeout(() => {
                    console.log(this.game.gameStatusEl);
                    this.game.gameStatusEl.innerText = "Defeat";
                    this.game.startGame();
                    return false;
                }, 0)
            }


            return true;
        }
    }

    allShipsSunk() {
        for (const row of this.board) {
            for (const field of row) {
                if (field instanceof Ship) return false;
            }
        }

        return true;
    }
}

class Player {
    constructor(gameboard) {
        this.gameboard = gameboard;
    }

    isOnTurn() {
        this.gameboard.interactable = true;
    }
    isNotOnTurn() {
        this.gameboard.interactable = false;
    }
}

class Computer {
    constructor(maxX, maxY) { //refactor later with using of inheritance
        this.alreadyShot = [];
        if (!maxX || !maxY || typeof maxX !== "number" || typeof maxY !== "number") 
            throw new Error("maxX and maxY must be passed as 2 integers")
        this.maxX = maxX;
        this.maxY = maxY;
    }

    getRandomCoordinations() {
        let randomCoords;

        do {
            randomCoords = 
            `${Math.floor(Math.random() * this.maxX)}_${Math.floor(Math.random() * this.maxY)}`
        } while(this.alreadyShot.includes(randomCoords))

        this.alreadyShot.push(randomCoords);

        
        return randomCoords.split("_").map(coord => Number(coord));
    }
}

//game setup
const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");
const gameStatusEl = document.getElementById("game-status")

const rowCount = 5
const columnCount = 5



class Game {
    constructor(gameStatusEl) {
        this.player;
        this.pc;
        this.playerGameboard;
        this.playerOnTurn;
        this.gameStatusEl = gameStatusEl;
    }

    takeTurn() {
        this.playerOnTurn = !this.playerOnTurn;
        if (this.playerOnTurn) {
            this.player.isOnTurn();
        } else {
            this.player.isNotOnTurn();
            while (this.playerGameboard.recieveAttack(...this.pc.getRandomCoordinations()));
            this.takeTurn();
        }
    }

    startGame() {
        const playerGameboard = new Gameboard(rowCount, columnCount, playerBoard, false, this);
        const computerGameboard = new Gameboard(rowCount, columnCount, computerBoard, true, this);

        const player = new Player(playerGameboard);
        const pc = new Computer(rowCount, columnCount);

        playerGameboard.setupBoard();
        computerGameboard.setupBoard(); 
        
        this.player = player;
        this.pc = pc;
        this.playerGameboard = playerGameboard;
        this.playerOnTurn = true;
    }
}

const game = new Game(gameStatusEl);
game.startGame();



module.exports = {Ship, Gameboard}