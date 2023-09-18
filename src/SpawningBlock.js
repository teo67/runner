import MovingBlock from "./MovingBlock.js";
import blockInside from "./blockInside.js";
const _defaultData = {
    classname: "spawningblock",
    spawnX: 0, 
    spawnY: 0,
    m: 10, 
    gravity: true
};
const copyData = (self, data) => {
    self.spawnX = data.spawnX;
    self.spawnY = data.spawnY;
}
class SpawningBlock extends MovingBlock {
    cName = "SpawningBlock";
    constructor(x, y, w, h, data = _defaultData) {
        super(x, y, w, h, data);
        this.waitingForSpawn = false;
        this.level = null;
        copyData(this, data);
    }
    reset(level, data = null) {
        super.reset(level, data);
        if(data != null) {
            copyData(this, data);
        }
        this.level = level;
    }
    update(dt) {
        if(this.level == null) {
            return;
        }
        if(this.waitingForSpawn) {
            for(const block of this.level.blocks) {
                if(blockInside(this.spawnX, this.spawnY, this.x.size, this.y.size, block)) {
                    return;
                }
            }
            this.x.position = this.spawnX;
            this.y.position = this.spawnY;
            this.element.style.display = "block";
            this.level.updatePose(this.x.position, this.y.position, this.element)
            this.waitingForSpawn = false;
            this.touchable = true;
        } else {
            if(this.touching[1].length > 0 || this.touching[2].length > 0 || this.touchingStatic[1] || this.touchingStatic[2]) {
                this.applyForceForTime(-6 * Math.sign(this.x.velocity), 'x', dt);
            }
            if(this.touching[0].length > 0 || this.touching[3].length > 0 || this.touchingStatic[0] || this.touchingStatic[3]) {
                this.applyForceForTime(-6 * Math.sign(this.y.velocity), 'y', dt);
            }
        }
    }
    die() {
        this.x.velocity = 0;
        this.y.velocity = 0;
        this.waitingForSpawn = true;
        this.touchable = false;
        this.element.style.display = "none";
    }
}
SpawningBlock.prototype.updates = true;
SpawningBlock.prototype.dies = true;
SpawningBlock.prototype.defaultData = _defaultData;
export default SpawningBlock;