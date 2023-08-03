import Block from './Block.js';
const _defaultData = {
    m: 5,
    gravity: true,
    classname: 'movingblock'
};
class MovingBlock extends Block {
    defaultData = _defaultData;
    cName = "MovingBlock";
    constructor(x, y, w, h, data = _defaultData) {
        super(x, y, w, h, data);
        this.x.start = x;
        this.y.start = y;
        this.m = data.m;
        this.x.velocity = 0;
        this.y.velocity = 0;
        this.x.acceleration = 0;
        this.y.acceleration = 0;
        this.touching = [[], [], [], []];
        this.touchingStatic = [false, false, false, false];
        this.minVelocity = null;
        this.translation = 0;
        this.x.marked = false;
        this.y.marked = false;
        this.bonus = 0;
        this.bonus = 0;
        if(data.gravity) {
            this.applyConstantForce(-45 * this.m, 'y');
        }
    }
    reset() {
        this.x.position = this.x.start;
        this.y.position = this.y.start;
    }
    applyConstantForce(f, direction) {
        this[direction].acceleration += f/this.m;
    }
    removeConstantForce(f, direction) {
        this.applyConstantForce(-f, direction);
    }
    applyForceForTime(f, direction, dt) {
        this[direction].velocity += f*dt/this.m;
    }
}
MovingBlock.prototype.moves = true;
MovingBlock.prototype.xreceivesMomentum = true;
MovingBlock.prototype.yreceivesMomentum = true;
MovingBlock.prototype.touchesOthers = true;
MovingBlock.prototype.touchable = true;
MovingBlock.prototype.updates = false;
MovingBlock.prototype.expands = false;
export default MovingBlock;