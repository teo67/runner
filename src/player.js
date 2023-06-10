import MovingBlock from './movingBlock.js';
const forceDueToKey = 200;
const jumpLimit = 0.4;
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
        this.jumpCharge = 0;
    }
    update(dt) {
        let fx = 0;
        let fy = 0;
        if(this.keysDown["w"] && !this.touchingStatic[1] && this.touching[1].length == 0) {
            if(this.touchingStatic[2] || this.touching[2].length > 0) {
                this.jumpCharge = 0;
                this.vy = 23;
            } else if(this.jumpCharge >= 0) {
                this.vy = 23;
                this.jumpCharge += dt;
                if(this.jumpCharge >= jumpLimit) {
                    this.jumpCharge = -1;
                }
            }
        } else {
            this.jumpCharge = -1;
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
        this.applyConstantForce(forceDueToKey * (fx - this.keyFx), forceDueToKey * (fy - this.keyFy));
        this.keyFx = fx;
        this.keyFy = fy;
    }
}
export default Player;