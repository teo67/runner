import Level from '../src/level.js';
import Wall from '../src/wall.js';
import MovingBlock from '../src/movingBlock.js';
const special = new MovingBlock(-10, 10, 2, 5, 5, false, 'button');
special.expands = true;
special.x.expansionSpeed = 3;
special.y.expansionSpeed = 0;
const level = new Level([
    special
]);
level.setBoundaries(-30, 35, -10, 50);
level.addEscape(3, 0, 10, 'second', 2.5, 0);
export default level;