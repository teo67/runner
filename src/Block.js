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
    defaultData = _defaultData;
    cName = "Block";
    constructor(x, y, w, h, data = _defaultData, dflt = _defaultData) {
        this.x = {};
        this.y = {};
        this.x.position = x;
        this.y.position = y;
        this.x.size = w;
        this.y.size = h;
        this.updates = false;
        this.element = document.createElement("div");
        this.element.classList.add(data.classname);
        if(global.building && data != dflt) {
            this.customData = data;
        }
        this.updateScale();
    }
    permanentPositionUpdate(key, val) {
        this[key].position = val;
    }
    reset() {}
    update() {}
    updateScale() {
        this.element.style.width = `${this.x.size}vw`;
        this.element.style.height = `${this.y.size}vw`;
    }
    initialize(level) {
        level.element.appendChild(this.element);
    }
}
export default Block;