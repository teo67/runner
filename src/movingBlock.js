import Block from './block.js';
class MovingBlock extends Block {
    
    constructor(x, y, w, h, m, gravity = true, classname = "movingblock") {
        super(x, y, w, h, classname);
        this.startX = x;
        this.startY = y;
        this.m = m;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.touching = [[], [], [], []];
        this.touchingStatic = [false, false, false, false];
        this.minVelocities = [null, null, null, null];
        this.translation = 0;
        this.markedX = false;
        this.markedY = false;
        if(gravity) {
            this.applyConstantForce(0, -45 * this.m);
        }
    }
    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
    applyConstantForce(x, y) {
        this.ax += x/this.m;
        this.ay += y/this.m;
    }
    removeConstantForce(x, y) {
        this.applyConstantForce(-x, -y);
    }
    applyForceForTime(fx, fy, dt) {
        this.vx += fx*dt/this.m;
        this.vy += fy*dt/this.m;
    }
}
MovingBlock.prototype.moves = true;
MovingBlock.prototype.receivesMomentumX = true;
MovingBlock.prototype.receivesMomentumY = true;
MovingBlock.prototype.touchesOthers = true;
MovingBlock.prototype.touchable = true;
MovingBlock.prototype.updates = false;
export default MovingBlock;