import Wall from './Wall.js';
import blockInside from './blockInside.js';
const _defaultData = {
    classname: "checkpoint"
};
class Checkpoint extends Wall {
    cName = "Checkpoint";
    constructor(x, y, w, h, data = _defaultData) {
        super(x, y, w, h, data);
        this.player = null;
    }
    reset(level) {
        this.player = level.player;
        if(this.element.classList.contains("active")) {
            this.element.classList.remove("active");
        }
    }
    update() {
        const inside = blockInside(this.x.position + 5, this.y.position + 5, this.x.size - 10, this.y.size - 10, this.player);
        if(this.element.classList.contains("active")) {
            if(!inside) {
                this.element.classList.remove("active");
            }
        } else {
            if(inside) {
                this.player.x.start = this.player.x.position;
                this.player.y.start = this.player.y.position;
                this.element.classList.add("active");
            }
        }
    }
}
Checkpoint.prototype.updates = true;
Checkpoint.prototype.touchesOthers = false;
Checkpoint.prototype.touchable = false;
Checkpoint.prototype.defaultData = _defaultData;
export default Checkpoint;