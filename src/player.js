import MovingBlock from './movingBlock.js';
const forceDueToKey = 200;
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
    }
    update() {
        let fx = 0;
        let fy = 0;
        if(this.keysDown["w"]) {
            fy++;
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