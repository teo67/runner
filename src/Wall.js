import Block from './Block.js';
const _defaultData = {
    classname: "block"
};
class Wall extends Block {
    cName = "Wall";
    defaultData = _defaultData;
    constructor(x, y, w, h, data = _defaultData) {
        super(x, y, w, h, data, _defaultData);
    }
}
Wall.prototype.moves = false;
Wall.prototype.expands = false;
Wall.prototype.xreceivesMomentum = false;
Wall.prototype.yreceivesMomentum = false;
Wall.prototype.touchesOthers = false;
Wall.prototype.touchable = true;
Wall.prototype.updates = false;
export default Wall;