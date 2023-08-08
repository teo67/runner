import Level from '../src/level.js';
import glob from '../src/global.js';
import Wall from '../src/Wall.js';
import MovingBlock from '../src/MovingBlock.js';
const level = new Level([
    new Wall(10, 0, 15, 15),
    new Wall(-5, 0, 5, 5),
    new MovingBlock(-15, 22.5, 10, 10),
    new Wall(20, 15, 5, 17.5),
    new Wall(-20, 2.5, 12.5, 2.5),
    new Wall(-17.5, 20, 7.5, 2.5),
    new Wall(10, 32.5, 2.5, 7.5),
    new Wall(-7.5, 12.5, 17.5, 2.5),
    new Wall(-2.5, 20, 2.5, 2.5),
    new Wall(-25, 10, 5, 2.5),
    new Wall(-17.5, 22.5, 2.5, 5),
]);
level.setBoundaries(-25, 35, 0, 40, !glob.building);
level.addEscape(2, 0, 10, 'start', 25, glob.building);
level.addEscape(2, 25, 35, 'start', 42.5, glob.building);
export default level;