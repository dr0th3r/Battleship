class Ship {
    constructor(length=1) {
        this.length = length;
        this.hitCount = 0;
    }

    isSunk() {
        return this.hitCount >= this.length
    }

    hit() {
        this.hitCount++;
    }
}

module.exports = {Ship}