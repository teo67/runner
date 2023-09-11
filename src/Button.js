import MovingBlock from "./MovingBlock.js";
const _defaultData = {
    m: 5,
    gravity: false,
    classname: 'button',
    direction: 'y',
    pressSpeed: -5,
    releaseSpeed: 10,
    minSize: 1,
    negative: false
};
const copyData = (self, data) => {
    self.direction = data.direction;
    self.pressSpeed = data.pressSpeed;
    self.releaseSpeed = data.releaseSpeed;
    self.minSize = data.minSize;
    self.negative = data.negative;
    self.maxSize = (self.direction == 'x') ? self.x.size : self.y.size;
}
class Button extends MovingBlock {
    cName = "Button";
    constructor(x, y, w, h, data = _defaultData) {
        super(x, y, w, h, data);
        this.onpress = null;
        this.onrelease = null;
        this.pressed = false;
        copyData(this, data);
    }
    
    reset(level, data = null) {
        super.reset(level, data);
        if(data != null) {
            copyData(this, data);
        }
    }
    update() {
        let touchIndex = (this.direction == 'y' ? 1 : 3);
        if(this.negative) {
            touchIndex = 3 - touchIndex;
        }
        if(this.touching[touchIndex].length > 0) {
            if(this[this.direction].size > this.minSize) {
                this[this.direction].expansionSpeed = this.pressSpeed;
                if(this.negative) {
                    this[this.direction].velocity = -this.pressSpeed;
                }
            } else {
                this[this.direction].expansionSpeed = 0;
                this[this.direction].velocity = 0;
                if(!this.pressed) {
                    this.pressed = true;
                    if(this.onpress !== null) {
                        this.onpress();
                    }
                }
            }
        } else {
            if(this.pressed) {
                this.pressed = false;
                if(this.onrelease !== null) {
                    this.onrelease();
                }
            }
            if(this[this.direction].size < this.maxSize) {
                this[this.direction].expansionSpeed = this.releaseSpeed;
                if(this.negative) {
                    this[this.direction].velocity = -this.releaseSpeed;
                }
            } else {
                this[this.direction].expansionSpeed = 0;
                this[this.direction].velocity = 0;
                this[this.direction].size = this.maxSize;
            }
        }
    }
}
Button.prototype.expands = true;
Button.prototype.xreceivesMomentum = false;
Button.prototype.yreceivesMomentum = false;
Button.prototype.updates = true;
Button.prototype.defaultData = _defaultData;
export default Button;