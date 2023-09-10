import Level from '../src/level.js';
import glob from '../src/global.js';
import Enemy from '../src/Enemy.js';
import MovingBlock from '../src/MovingBlock.js';
import Wall from '../src/Wall.js';
import Button from '../src/Button.js';
const elevator1 = new MovingBlock(17.5, -2.5, 20, 2.5, {m: 5, gravity: false, classname: 'movingblock', });
const button1 = new Button(32.5, 7.5, 5, 7.5, {m: 5, gravity: false, classname: 'button', });


const blocks = [
    new Enemy(17.5, 0, 2.5, 7.5),
    new Enemy(17.5, 15, 2.5, 7.5),
    new MovingBlock(20, 5, 5, 12.5, {m: 1, gravity: false, classname: 'movingblock', }),
    new Wall(5, 22.5, 32.5, 2.5),
    new Wall(37.5, -2.5, 2.5, 27.5),
    new Wall(50, -5, 2.5, 2.5),
    new Wall(40, 5, 2.5, 2.5),
    new Wall(50, 17.5, 2.5, 2.5),
    new Enemy(0, -15, 17.5, 2.5),
    new Enemy(0, -12.5, 2.5, 7.5),
    new Wall(0, -5, 17.5, 5),
];
blocks.push(button1);
blocks.push(elevator1);
const level = new Level(blocks);
level.setBoundaries(0, 52.5, -15, 32.5, !glob.building);
level.addEscape(0, 0, 10, 'right1', -2.5, glob.building);
export default level;