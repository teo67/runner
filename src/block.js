/* all options:
moves
touches others
can be touched
receives momentum
updates
*/
class Block {
    constructor(x, y, w, h, classname = "block") {
        this.x = {};
        this.y = {};
        this.x.position = x;
        this.y.position = y;
        this.x.size = w;
        this.y.size = h;
        this.updates = false;
        this.element = document.createElement("div");
        this.element.classList.add(classname);
        this.updateScale();
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