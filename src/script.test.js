const {Ship} = require("./script")

test("Ship assigns length", () => {
    const ship = new Ship(2);
    expect(ship.length).toBe(2);
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
