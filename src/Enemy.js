import Wall from './Wall.js';
import Player from './player.js';
const _defaultData = {
    classname: "enemy"
};
class Enemy extends Wall {
    cName = "Enemy";
    defaultData = _defaultData;
    constructor(x, y, w, h, data = _defaultData) {
        super(x, y, w, h, data, _defaultData);
    }
    update() {
        for(const li of this.touching) {
            for(const el of li) {
                if(el instanceof Player) {
                    return true;
                }
            }
        }
        return false;
    }
}
Enemy.prototype.updates = true;
Enemy.prototype.touchesOthers = true;
export default Enemy;