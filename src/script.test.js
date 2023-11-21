const {Ship, Gameboard} = require("./script")

//Ship

test("Ship assigns length", () => {
    const ship = new Ship(2);
    expect(ship.length).toBe(2);
})

test("Ship assigns rotation", () => {
    const ship = new Ship(2, 3);
    expect(ship.isHorizontal).toBeTruthy();
})

test("Ship assigns hit count", () => {
    const ship = new Ship();
    expect(ship.hitCount).toBe(0);
})

test("Ship can be hit", () => {
    const ship = new Ship();
    ship.hit();

    expect(ship.hitCount).toBe(1);
})

test("Ship can be sunk", () => {
    const ship = new Ship(); //default length is 1
    ship.hit();

    expect(ship.isSunk()).toBeTruthy();
})

//Gameboard

test("Gameboard creates board", () => {
    const gameboard = new Gameboard(2, 3);

    expect(gameboard.board).toEqual([
        [0, 0],
        [0, 0],
        [0, 0]
    ])
})

//Gameboard - placing ship

test("Gameboard places ship", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(2, true);

    gameboard.placeShip(ship, 0, 0)
    expect(gameboard.board).toEqual([
        [ship, ship, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ])
})

test("Gameboard must have correct coordinates (ship fits onto the boat)", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(2, false);

    expect(() => gameboard.placeShip(ship, 0, 4)).toThrow("Invalid coordinates")
})

test("Gameboard must have correct coordinates (not letter)", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(2, false);

    expect(() => gameboard.placeShip(ship, "a", "b")).toThrow("Coordinates must be numbers")
})


test("Gameboard must have coordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship();

    expect(() => gameboard.placeShip(ship)).toThrow("Coordinates required")
})

test("Gameboard must have ship", () => {
    const gameboard = new Gameboard();
    const ship = new Ship();
    expect(() => gameboard.placeShip()).toThrow("Ship required")
})

//Gameboard - recieve attack

test("recieveAttack coordinates are undefined", () => {
    const gameboard = new Gameboard();
    
    expect(() => gameboard.recieveAttack()).toThrow("Invalid coordinates")
})

test("recieveAttack coorinates aren't numbers", () => {
    const gameboard = new Gameboard();

    expect(() => gameboard.recieveAttack("a", "b")).toThrow("Invalid coordinates")
})

test("recieveAttack coordinates are out of range", () => {
    const gameboard = new Gameboard(4, 4);

    expect(() => gameboard.recieveAttack(10, 10)).toThrow("Invalid coordinates");
})

test("recieveAttack - board changes (ship is hit)", () => {
    const gameboard = new Gameboard(4, 4);
    const ship = new Ship();

    gameboard.placeShip(ship, 0, 0);
    gameboard.recieveAttack(0, 0);

    expect(gameboard.board[0][0]).toBe(2);
})

test("recieveAttack - board changes (no ship)", () => {
    const gameboard = new Gameboard(4, 4);
    const ship = new Ship();

    gameboard.placeShip(ship, 0, 0);
    gameboard.recieveAttack(1, 1);

    expect(gameboard.board[1][1]).toBe(1);
}) 


test("recieveAttack - ship is hit", () => {
    const gameboard = new Gameboard(4, 4);
    const ship = new Ship();

    gameboard.placeShip(ship, 0, 0);
    gameboard.recieveAttack(0, 0);

    expect(ship.hitCount).toBe(1);
})

test("recieveAttack - Already attacked", () => {
    const gameboard = new Gameboard(4, 4);
    const ship = new Ship();

    gameboard.placeShip(ship, 0, 0);
    gameboard.recieveAttack(0, 0);

    expect(() => gameboard.recieveAttack(0, 0)).toThrow("Already attacked")
})

//Gameboard - all ships sunk

test("allShipsSunk - true", () => {
    const gameboard = new Gameboard(4, 4);
    const ship1 = new Ship(2, false);
    const ship2 = new Ship(1, true);
    
    gameboard.placeShip(ship1, 0, 0);
    gameboard.placeShip(ship2, 3, 3);

    gameboard.recieveAttack(0, 0);
    gameboard.recieveAttack(0, 1);
    gameboard.recieveAttack(3, 3);

    expect(gameboard.allShipsSunk()).toBeTruthy();
})

test("allShipsSunk - false", () => {
    const gameboard = new Gameboard(2, 2);
    const ship = new Ship(1, true);

    gameboard.placeShip(ship, 0, 0);

    expect(gameboard.allShipsSunk()).toBeFalsy();
})