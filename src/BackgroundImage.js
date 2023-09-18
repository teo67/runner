import Block from './Block.js';
const _defaultData = {
    classname: "back_image",
    path: "./images/default.jpg"
};
const copyData = (self, data) => {
    self.path = data.path;
    self.element.style.backgroundImage = `url("${self.path}")`;
}
class BackgroundImage extends Block {
    cName = "BackgroundImage";
    constructor(x, y, w, h, data = _defaultData) {
        super(x, y, w, h, data);
        copyData(this, data);
    }
    reset(_, data = null) {
        if(data != null) {
            copyData(this, data);
        }
    }
}
BackgroundImage.prototype.moves = false;
BackgroundImage.prototype.expands = false;
BackgroundImage.prototype.xreceivesMomentum = false;
BackgroundImage.prototype.yreceivesMomentum = false;
BackgroundImage.prototype.touchesOthers = false;
BackgroundImage.prototype.touchable = false;
BackgroundImage.prototype.updates = false;
BackgroundImage.prototype.defaultData = _defaultData;
export default BackgroundImage;