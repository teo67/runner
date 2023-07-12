import MovingBlock from './movingBlock.js';
import keysDown from './keyListener.js';
const forceDueToKeyX = 200;
const forceDueToKeyY = 400;
const jumpLimit = 0.4;
const killkey = 'f';
class Player extends MovingBlock {
    constructor(flies = false, phases = false) {
        super(0, 0, 5, 5, 5, !flies, "player");
        this.flies = flies;
        this.updates = true;
        this.jumpCharge = -1;
        if(phases) {
            this.touchable = false;
        }
    }
    update(dt) {
        if(keysDown[killkey]) {
            throw "killed"; // for testing
        }
        if(this.flies && keysDown["q"]) {
            this.x.velocity = 0;
            this.y.velocity = 0;
            return;
        }
        let fx = 0;
        let fy = 0;
        this.x.acceleration = 0;
        this.y.acceleration = this.flies ? 0 : -45;
        if(keysDown["w"] && !this.touchingStatic[1]) {
            if(this.flies) {
                fy++;
            } else if(this.touchingStatic[2] || this.touching[2].length > 0) {
                this.jumpCharge = 0;
                this.y.velocity = 23;
                this.y.acceleration = 0;
            } else if(this.jumpCharge >= 0) {
                this.jumpCharge += dt;
                this.y.acceleration = 0;
                if(this.jumpCharge >= jumpLimit) {
                    this.jumpCharge = -1;
                }
            }
        } else if(this.jumpCharge != -1) {
            this.jumpCharge = -1;
        }
        if(keysDown["a"]) {
            fx--;
        }
        if(keysDown["s"]) {
            fy--;
        }
        if(keysDown["d"]) {
            fx++;
        }
        if(this.flies || this.touching[1].length > 0 || this.touching[2].length > 0 || this.touchingStatic[1] || this.touchingStatic[2]) {
            fx -= 0.3 * Math.sign(this.x.velocity);
        }
        if(this.flies || this.touching[0].length > 0 || this.touching[3].length > 0 || this.touchingStatic[0] || this.touchingStatic[3]) {
            fy -= 0.3 * Math.sign(this.y.velocity);
        }
        this.applyConstantForce(forceDueToKeyX * fx, 'x');
        this.applyConstantForce(forceDueToKeyY * fy, 'y');
    }
}
export default Player;