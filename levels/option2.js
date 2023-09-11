import Level from '../src/level.js';
import glob from '../src/global.js';
import Enemy from '../src/Enemy.js';
import MovingBlock from '../src/MovingBlock.js';
import Wall from '../src/Wall.js';
import Button from '../src/Button.js';
const button2 = new Button(15, -20, 2.5, 5, {direction: 'x', __proto__: Button.prototype.defaultData});
if(glob.building) {button2.marker = 'button2';}
const button1 = new Button(32.5, 7.5, 5, 7.5, {negative: true, direction: 'x', __proto__: Button.prototype.defaultData});
if(glob.building) {button1.marker = 'button1';}
const elevator1 = new MovingBlock(17.5, -2.5, 22.5, 2.5, {gravity: false, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {elevator1.marker = 'elevator1';}
const pusher = new MovingBlock(20, 0, 5, 22.5, {m: 1, gravity: false, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {pusher.marker = 'pusher';}
const level = new Level([
    new Enemy(17.5, 0, 2.5, 5),
    new Enemy(17.5, 17.5, 2.5, 5),
    pusher,
    new Wall(5, 22.5, 32.5, 2.5),
    new Wall(37.5, 0, 2.5, 25),
    new Wall(50, -2.5, 2.5, 2.5),
    new Wall(40, 5, 2.5, 2.5),
    new Wall(50, 17.5, 2.5, 2.5),
    new Wall(0, -5, 17.5, 5),
    elevator1,
    button1,
    new Enemy(0, -27.5, 52.5, 2.5),
    new Wall(12.5, -20, 2.5, 15),
    button2,
    new Enemy(50, -25, 2.5, 22.5),
]);
level.setBoundaries(0, 52.5, -27.5, 32.5, !glob.building);
level.addEscape(0, 0, 10, 'right1', -2.5, glob.building);
level.addEscape(1, 17.5, 27.5, 'option2part2', 2.5, glob.building);

elevator1.xreceivesMomentum = false;
elevator1.yreceivesMomentum = false;
pusher.yreceivesMomentum = false;

button1.onpress = () => {
    elevator1.y.velocity = -5;
}
button1.onrelease = () => {
    elevator1.y.velocity = 5;
}

button2.onpress = () => {
    pusher.x.velocity = -5;
}
button2.onrelease = () => {
    pusher.x.velocity = 5;
}

export default level;