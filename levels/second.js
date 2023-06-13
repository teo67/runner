import Level from '../src/level.js';
const level = new Level([]);
level.setBoundaries(0, 35, -10, 50);
level.addEscape(0, 0, 10, 'start', 2.5, 35);
export default level;