/* all options:
moves
touches others
can be touched
receives momentum
updates
*/
import global from './global.js';
const _defaultData = {
    classname: "block"
};
class Block {
    cName = "Block";
    constructor(x, y, w, h, data = _defaultData) {
        this.x = {};
        this.y = {};
        this.x.position = x;
        this.y.position = y;
        this.x.size = w;
        this.y.size = h;
        this.element = document.createElement("div");
        this.element.classList.add(data.classname);
        if(global.building && data != this.defaultData) {
            console.log(data);
            this.customData = data;
        }
        this.updateScale();
    }
    permanentPositionUpdate(key, val) {
        this[key].position = val;
    }
    permanentSizeUpdate(key, val) {
        this[key].size = val;
    }
    reset() {}
    update() {return false;}
    updateScale() {
        this.element.style.width = `${this.x.size}vw`;
        this.element.style.height = `${this.y.size}vw`;
    }
    initialize(level) {
        level.element.appendChild(this.element);
    }
}
Block.prototype.updates = false;
Block.prototype.defaultData = _defaultData;
export default Block;