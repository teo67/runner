import Level from '../src/level.js';
import glob from '../src/global.js';
import Button from '../src/Button.js';
import MovingBlock from '../src/MovingBlock.js';
import Wall from '../src/Wall.js';
import Enemy from '../src/Enemy.js';
const n6 = new MovingBlock(25, 35, 5, 5, {classname: 'enemy', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {n6.marker = 'n6';}
const n5 = new MovingBlock(20, 35, 5, 5, {classname: 'enemy', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {n5.marker = 'n5';}
const n4 = new MovingBlock(15, 35, 5, 5, {classname: 'enemy', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {n4.marker = 'n4';}
const n3 = new MovingBlock(10, 35, 5, 5, {classname: 'enemy', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {n3.marker = 'n3';}
const n2 = new MovingBlock(5, 35, 5, 5, {classname: 'enemy', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {n2.marker = 'n2';}
const n1 = new MovingBlock(0, 35, 5, 5, {classname: 'enemy', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {n1.marker = 'n1';}
const shrinker1 = new MovingBlock(0, 5, 35, 30, {gravity: false, classname: 'block', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {shrinker1.marker = 'shrinker1';}
const e6 = new MovingBlock(25, -30, 5, 30, {gravity: false, classname: 'block', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {e6.marker = 'e6';}
const e5 = new MovingBlock(20, -30, 5, 30, {gravity: false, classname: 'block', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {e5.marker = 'e5';}
const e4 = new MovingBlock(15, -30, 5, 30, {gravity: false, classname: 'block', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {e4.marker = 'e4';}
const e3 = new MovingBlock(10, -30, 5, 30, {gravity: false, classname: 'block', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {e3.marker = 'e3';}
const e2 = new MovingBlock(5, -30, 5, 30, {gravity: false, classname: 'block', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {e2.marker = 'e2';}
const e1 = new MovingBlock(0, -30, 5, 30, {gravity: false, classname: 'block', __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {e1.marker = 'e1';}
const button1 = new Button(30, 0, 5, 5, {direction: 'x', pressSpeed: -20, negative: true, __proto__: Button.prototype.defaultData});
if(glob.building) {button1.marker = 'button1';}
const level = new Level([
    button1,
    e1,
    e2,
    e3,
    e4,
    e5,
    e6,
    shrinker1,
    n1,
    n2,
    n3,
    n4,
    n5,
    n6,
    new Wall(15, -50, 5, 5),
    new Wall(20, -70, 5, 5),
    new Wall(10, -95, 5, 5),
    new Wall(0, -110, 5, 5),
    new Wall(25, -115, 5, 5),
    new Wall(30, 35, 5, 5),
    new Wall(30, -175, 5, 175),
    new Enemy(16.25, -132.5, 2.5, 82.5),
    new Enemy(26.25, -132.5, 2.5, 17.5),
    new Enemy(21.25, -132.5, 2.5, 62.5),
    new Enemy(11.25, -132.5, 2.5, 37.5),
    new Enemy(1.25, -132.5, 2.5, 22.5),
    new Wall(10, -137.5, 20, 5),
    new Wall(0, -137.5, 5, 5),
]);
level.setBoundaries(0, 35, -175, 40, !glob.building);
level.addEscape(0, 0, 5, 'right2', 5, glob.building);

shrinker1.turnOnExpansion();
shrinker1.xreceivesMomentum = false;
shrinker1.yreceivesMomentum = false;

const enemies = [n1, n2, n3, n4, n5, n6];
const elevators = [e1, e2, e3, e4, e5, e6];

for(const elevator of elevators) {
    elevator.yreceivesMomentum = false;
    elevator.xreceivesMomentum = false;
}

for(const enemy of enemies) {
    enemy.updates = true;
    enemy.update = Enemy.prototype.update;
}

button1.onpress = () => {
    for(const elevator of elevators) {
        elevator.y.velocity = -25;
    }
    shrinker1.x.expansionSpeed = -5;
    shrinker1.x.velocity = 5;
}
export default level;