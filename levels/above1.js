import Level from '../src/level.js';
import glob from '../src/global.js';
import Wall from '../src/Wall.js';
import MovingBlock from '../src/MovingBlock.js';
const level = new Level([
    new Wall(10, 0, 15, 5),
    new Wall(-5, 0, 5, 5),
    new Wall(-10, 5, 5, 5),
    new MovingBlock(-5, 15, 5, 5),
    new Wall(-10, 10, 7.5, 5),
    new Wall(-10, 15, 5, 1.1197916666666679),
    new Wall(20, 5, 5, 20),
    new Wall(-20, 0, 5, 5),
]);
level.setBoundaries(-25, 35, 0, 40, !glob.building);
level.addEscape(2, 0, 10, 'start', 25, glob.building);
level.addEscape(2, 25, 35, 'start', 42.5, glob.building);
export default level;