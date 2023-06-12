import MovingBlock from './movingBlock.js';
const forceDueToKeyX = 200;
const forceDueToKeyY = 400;
const jumpLimit = 0.4;
const flying = true;
const killkey = 'f';
class Player extends MovingBlock {
    constructor() {
        super(0, 0, 5, 5, 5, true, "player");
        this.updates = true;
        this.keysDown = {};
        document.addEventListener("keydown", event => {
            this.keysDown[event.key] = true;
        });
        document.addEventListener("keyup", event => {
            this.keysDown[event.key] = false;
        });
        this.keyFx = 0;
        this.keyFy = 0;
        this.jumpCharge = -1;
    }
    update(dt) {
        if(this.keysDown[killkey]) {
            throw "killed"; // for testing
        }
        let fx = 0;
        let fy = 0;
        if(this.keysDown["w"] && !this.touchingStatic[1]) {
            if(flying) {
                fy++;
            } else if(this.touchingStatic[2] || this.touching[2].length > 0) {
                this.jumpCharge = 0;
                this.y.velocity = 23;
                this.y.acceleration = 0;
            } else if(this.jumpCharge >= 0) {
                this.jumpCharge += dt;
                if(this.jumpCharge >= jumpLimit) {
                    this.jumpCharge = -1;
                    this.applyConstantForce(-45 * this.m, 'y');
                }
            }
        } else if(this.jumpCharge != -1) {
            this.jumpCharge = -1;
            this.applyConstantForce(-45 * this.m, 'y');
        }
        if(this.keysDown["a"]) {
            fx--;
        }
        if(this.keysDown["s"]) {
            fy--;
        }
        if(this.keysDown["d"]) {
            fx++;
        }
        this.applyConstantForce(forceDueToKeyX * (fx - this.keyFx), 'x');
        this.applyConstantForce(forceDueToKeyY * (fy - this.keyFy), 'y');
        this.keyFx = fx;
        this.keyFy = fy;
    }
}
export default Player;