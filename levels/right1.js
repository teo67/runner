import Level from '../src/level.js';
import glob from '../src/global.js';
const level = new Level([
]);
level.setBoundaries(0, 10, 0, 10, !glob.building);
level.addEscape(0, 0, 10, 'below1', 1.25, glob.building);
export default level;