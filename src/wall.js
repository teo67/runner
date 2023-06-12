import Block from './block.js';
class Wall extends Block {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
}
Wall.prototype.moves = false;
Wall.prototype.receivesMomentumX = false;
Wall.prototype.receivesMomentumY = false;
Wall.prototype.touchesOthers = false;
Wall.prototype.touchable = true;
Wall.prototype.updates = false;
export default Wall;