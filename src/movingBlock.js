import Block from './block.js';
class MovingBlock extends Block {
    constructor(x, y, w, h, m, gravity = true, classname = "movingblock") {
        super(x, y, w, h, classname);
        this.m = m;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.touching = [[], [], [], []];
        this.touchingStatic = [false, false, false, false];
        this.translation = 0;
        this.markedX = false;
        this.markedY = false;
        if(gravity) {
            this.applyConstantForce(0, -15 * this.m);
        }
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
export default MovingBlock;