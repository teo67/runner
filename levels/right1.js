import Level from '../src/level.js';
import Button from '../src/Button.js';
import glob from '../src/global.js';
import MovingBlock from '../src/MovingBlock.js';
import Wall from '../src/Wall.js';
import Enemy from '../src/Enemy.js';

const button1 = new Button(32.5, -20, 5, 2.5);
if(glob.building) {button1.marker = 'button1';}
const slider1 = new MovingBlock(47.5, -20, 5, 15, {gravity: false, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {slider1.marker = 'slider1';}

const level = new Level([
    new MovingBlock(15, 0, 20, 10, {m: 50, __proto__: MovingBlock.prototype.defaultData}),
    new Wall(0, -5, 17.5, 5),
    new Wall(30, -5, 17.5, 5),
    new Wall(5, 10, 50, 7.5),
    new Wall(52.5, -7.5, 2.5, 17.5),
    new Wall(62.5, -10, 5, 2.5),
    new Wall(55, 2.5, 5, 2.5),
    new Wall(65, 15, 5, 2.5),
    new Wall(75, -20, 5, 7.5),
    new Enemy(80, -20, 45, 5),
    new Wall(125, -20, 5, 7.5),
    new Wall(45, 0, 2.5, 10),
    slider1,
    button1,
]);

level.setBoundaries(0, 137.5, -20, 25, !glob.building);
level.addEscape(0, 0, 10, 'below1', 1.25, glob.building);
level.addEscape(2, 130, 137.5, 'option1', 2.5, glob.building);
level.addEscape(3, -7.5, 7.5, 'option2', 2.5, glob.building);

slider1.xreceivesMomentum = false;
slider1.yreceivesMomentum = false;

button1.onpress = () => {
    slider1.y.velocity = 6;
};
button1.onrelease = () => {
    slider1.y.velocity = -6;
};

export default level;