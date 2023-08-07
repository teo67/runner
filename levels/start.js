import Level from '../src/level.js';
import glob from '../src/global.js';
import Wall from '../src/Wall.js';
const level = new Level([
    new Wall(10, -2.5, 5, 5),
    new Wall(17.5, 5, 5, 5),
    new Wall(25, 12.5, 5, 5),
    new Wall(32.5, -2.5, 7.5, 30),
]);
level.setBoundaries(-2.5, 50, -2.5, 27.5, !glob.building);
level.addEscape(1, 22.5, 32.5, 'above1', 2.5, glob.building);
level.addEscape(1, 40, 50, 'above1', 27.5, glob.building);
level.addEscape(2, 40, 50, 'below1', 2.5, glob.building);
export default level;