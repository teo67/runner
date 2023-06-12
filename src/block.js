/* all options:
moves
touches others
can be touched
receives momentum
updates
*/
class Block {
    constructor(x, y, w, h, classname = "block") {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.updates = false;
        this.element = document.createElement("div");
        this.element.classList.add(classname);
        this.updateScale();
    }
    reset() {}
    update() {}
    updateScale() {
        this.element.style.width = `${this.w}vw`;
        this.element.style.height = `${this.h}vw`;
    }
    initialize(level) {
        level.element.appendChild(this.element);
    }
}
export default Block;