import Level from '../src/level.js';
import glob from '../src/global.js';
import MovingBlock from '../src/MovingBlock.js';
import Wall from '../src/Wall.js';
import Enemy from '../src/Enemy.js';
const wefwfe = new MovingBlock(15, 0, 20, 10, {m: 50, gravity: true, classname: 'movingblock', });
const blocks = [
    new Wall(0, -5, 17.5, 5),
    new Wall(30, -5, 17.5, 5),
    new Wall(5, 10, 50, 7.5),
    new Wall(52.5, -7.5, 2.5, 17.5),
    new Wall(62.5, -10, 5, 2.5),
    new Wall(55, 2.5, 5, 2.5),
    new Wall(65, 15, 5, 2.5),
    new MovingBlock(32.5, -20, 5, 2.5, {m: 5, gravity: false, classname: 'button', }),
    new MovingBlock(47.5, -20, 5, 15, {m: 5, gravity: false, classname: 'movingblock', }),
    new Wall(75, -20, 5, 7.5),
    new Enemy(80, -20, 45, 5),
    new Wall(125, -20, 5, 7.5),
    new Wall(45, 0, 2.5, 10),
];
blocks.push(wefwfe);
const level = new Level(blocks);
level.setBoundaries(0, 137.5, -20, 25, !glob.building);
level.addEscape(0, 0, 10, 'below1', 1.25, glob.building);
level.addEscape(2, 130, 137.5, 'option1', 2.5, glob.building);
export default level;