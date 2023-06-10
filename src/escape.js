export default class {
    constructor(lowerBound, upperBound, to, spawnX, spawnY) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.to = to;
        this.spawnX = spawnX;
        this.spawnY = spawnY;
    }
    takeFrom(from, game) {
        from.unload(game);
        this.to.load(game, this.spawnX, this.spawnY);
    }
}