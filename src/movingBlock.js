import Block from './block.js';
class MovingBlock extends Block {
    
    constructor(x, y, w, h, m, gravity = true, classname = "movingblock") {
        super(x, y, w, h, classname);
        this.x.start = x;
        this.y.start = y;
        this.m = m;
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
        if(gravity) {
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