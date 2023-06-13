import Level from '../src/level.js';
const level = new Level([]);
level.setBoundaries(-30, 35, -10, 50);
level.addEscape(3, 0, 10, 'second', 2.5, 0);
export default level;