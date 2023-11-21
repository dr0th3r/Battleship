const {Ship, Gameboard} = require("./script")

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

test("Gameboard creates board", () => {
    const gameboard = new Gameboard(2, 3);

    expect(gameboard.board).toEqual([
        [0, 0],
        [0, 0],
        [0, 0]
    ])
})

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

test("Gameboard must have correct coordinates", () => {
    const gameboard = new Gameboard();
    const ship = new Ship(2, false);

    expect(() => gameboard.placeShip(ship, 0, 4)).toThrow("Invalid coordinates")
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