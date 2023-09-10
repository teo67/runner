import MovingBlock from "./MovingBlock";
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
class Button extends MovingBlock {
    constructor(x, y, w, h, onpress = null, onrelease = null, data = _defaultData) {
        super(x, y, w, h, data);
        this.onpress = onpress;
        this.onrelease = onrelease;
        this.x.expansionSpeed = 0;
        this[this.direction].expansionSpeed = 0;
        this.pressed = false;
        this.direction = data.direction;
        this.pressSpeed = data.pressSpeed;
        this.releaseSpeed = data.releaseSpeed;
        this.minSize = data.minSize;
        this.maxSize = (this.direction == 'x') ? w : h;
        this.negative = data.negative;
    }
    update() {
        if(this.touching[1].length > 0) {
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
            }
        }
    }
}
Button.prototype.expands = true;
Button.prototype.xreceivesMomentum = false;
Button.prototype.yreceivesMomentum = false;
Button.prototype.updates = true;
export default Button;