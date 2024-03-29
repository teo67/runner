import Level from '../src/level.js';
import glob from '../src/global.js';
import Wall from '../src/Wall.js';
import Enemy from '../src/Enemy.js';
import MovingBlock from '../src/MovingBlock.js';
const slider1 = new MovingBlock(10, -12.5, 10, 2.5, {gravity: false, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {slider1.marker = 'slider1';}
const level = new Level([
    new Wall(0, -12.5, 10, 2.5),
    new Enemy(0, -17.5, 150, 5),
    new Wall(145, -12.5, 5, 2.5),
    slider1,
    new Wall(27.5, 2.5, 5, 5),
    new Wall(75, -2.5, 5, 5),
    new Wall(127.5, 2.5, 5, 5),
    new Wall(102.5, -5, 5, 5),
    new Enemy(75, -10, 5, 7.5),
    new Enemy(102.5, -10, 5, 5),
    new Enemy(127.5, 7.5, 5, 2.5),
    new Enemy(27.5, 7.5, 5, 2.5),
]);
level.setBoundaries(0, 150, -17.5, 10, !glob.building);
level.addEscape(1, 0, 10, 'right1', 131.25, glob.building);
level.addEscape(1, 132.5, 150, 'meetup1', 81.25, glob.building);

slider1.updates = true;
slider1.xreceivesMomentum = false;
slider1.yreceivesMomentum = false;
let t0 = null;
slider1.update = () => {
    if(slider1.touchingStatic[0] || slider1.touchingStatic[3]) {
        slider1.x.velocity = 0;
        if(t0 === null) {
            t0 = Date.now();
        }
        if(Date.now() - t0 > 1000) {
            slider1.x.velocity = (slider1.touchingStatic[0] ? 1 : -1) * 20;
            t0 = null;
        }
    }
}
export default level;