import Level from '../src/level.js';
import glob from '../src/global.js';
import Wall from '../src/Wall.js';
import MovingBlock from '../src/MovingBlock.js';
const level = new Level([
    new Wall(-15, 0, 5, 5),
    new Wall(-10, 5, 5, 5),
    new MovingBlock(-10, 10, 5, 5),
    new Wall(-5, 0, 15, 5),
    new Wall(5, 5, 5, 15),
]);
level.setBoundaries(-24.984532666666645, 26.28964941569282, 0, 30.505008347245408, !glob.building);
level.addEscape(3, 5, 15, 'next', 2.5);
export default level;