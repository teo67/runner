import Block from './Block.js';
const _defaultData = {
    m: 5,
    gravity: true,
    classname: 'movingblock'
};
const copyData = (self, data) => {
    self.m = data.m;
    self.x.acceleration = 0;
    self.y.acceleration = 0;
    if(data.gravity) {
        self.applyConstantForce(-45 * self.m, 'y');
    }
}
class MovingBlock extends Block {
    cName = "MovingBlock";
    constructor(x, y, w, h, data = _defaultData) {
        super(x, y, w, h, data);
        this.x.start = x;
        this.y.start = y;
        if(this.expands) {
            this.x.startsize = w;
            this.y.startsize = h;
        }
        
        this.resetMotion();
        copyData(this, data);
    }
    turnOnExpansion() {
        this.expands = true;
        this.x.expansionSpeed = 0;
        this.y.expansionSpeed = 0;
    }
    permanentPositionUpdate(key, val) {
        super.permanentPositionUpdate(key, val);
        this[key].start = val;
    }
    permanentSizeUpdate(key, val) {
        super.permanentSizeUpdate(key, val);
        if(this.expands) {
            this[key].startsize = val;
        }
    }
    resetMotion() {
        this.x.velocity = 0;
        this.y.velocity = 0;
        this.minVelocity = null;
        this.translation = 0;
        this.x.marked = false;
        this.y.marked = false;
        this.bonus = 0;
        this.touching = [[], [], [], []];
        this.touchingStatic = [false, false, false, false];
        if(this.expands) {
            this.x.expansionSpeed = 0;
            this.y.expansionSpeed = 0;
        }
    }
    reset(level, data = null) {
        this.x.position = this.x.start;
        this.y.position = this.y.start;
        if(this.expands) {
            this.x.size = this.x.startsize;
            this.y.size = this.y.startsize;
        }
        this.resetMotion();
        if(data != null) {
            copyData(this, data);
        };
        level.updatePose(this.x.position, this.y.position, this.element);
        if(this.expands) {
            this.updateScale();
        }
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
MovingBlock.prototype.defaultData = _defaultData;
export default MovingBlock;