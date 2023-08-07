import Level from '../src/level.js';
import glob from '../src/global.js';
const level = new Level([
]);
level.setBoundaries(-15, 25, -20, 10, !glob.building);
level.addEscape(1, 0, 10, 'start', 42.5, glob.building);
export default level;