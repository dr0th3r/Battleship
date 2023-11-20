const {Ship, Gameboard} = require("./script")

test("Ship assigns length", () => {
    const ship = new Ship(2);
    expect(ship.length).toBe(2);
})

test("Ship assigns rotation", () => {
    const ship = new Ship(2, 3);
    expect(ship.rotation).toBe(1);
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
    const gameboard = new Gameboard(2, 3);
})