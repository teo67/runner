import Level from '../src/level.js';
import glob from '../src/global.js';
import Wall from '../src/Wall.js';
import MovingBlock from '../src/MovingBlock.js';
const level = new Level([
    new Wall(0, 0, 10, 5),
    new Wall(10, 5, 5, 5),
    new MovingBlock(-5, 5, 5, 5),
    new Wall(-15, 5, 5, 5),
    new Wall(-5, -5, 10, 5),
    new MovingBlock(-15, -10, 10, 10),
    new Wall(-15, -25, 5, 5),
    new Wall(5, -25, 5, 20),
    new Wall(-10, -30, 15, 5),
    new MovingBlock(-20, -20, 5, 5),
    new Wall(-20, -15, 5, 20),
    new Wall(-25, -15, 5, 5),
    new MovingBlock(-25, -42.5, 15, 2.5, {m: 5, gravity: false, classname: "movingblock", }),
    new MovingBlock(-25, -45, 15, 2.5, {m: 5, gravity: false, classname: "movingblock", }),
    new MovingBlock(-25, -47.5, 15, 2.5, {m: 5, gravity: false, classname: "movingblock", }),
    new MovingBlock(-25, -50, 15, 2.5, {m: 5, gravity: false, classname: "movingblock", }),
    new Wall(-10, -35, 5, 5),
    new MovingBlock(15, -45, 10, 2.5, {m: 5, gravity: false, classname: "movingblock", }),
    new Wall(20, -50, 5, 5),
    new Wall(20, -37.5, 5, 10),
    new MovingBlock(10, -20, 7.5, 2.5),
    new Wall(10, -25, 2.5, 2.5),
    new Wall(10, -17.5, 2.5, 2.5),
    new MovingBlock(17.5, -7.5, 7.5, 2.5),
    new Wall(22.5, -12.5, 2.5, 2.5),
    new Wall(22.5, -5, 2.5, 2.5),
]);
level.setBoundaries(-25, 25, -50, 10, !glob.building);
level.addEscape(1, 0, 10, 'start', 42.5, glob.building);
export default level;