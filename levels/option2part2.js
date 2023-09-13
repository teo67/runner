import Level from '../src/level.js';
import glob from '../src/global.js';
import Wall from '../src/Wall.js';
const level = new Level([
    new Wall(20, 0, 5, 5),
    new Wall(0, 10, 42.5, 5),
    new Wall(50, 10, 10, 5),
    new Wall(67.5, 10, 17.5, 5),
    new Wall(50, 0, 5, 10),
    new Wall(35, 22.5, 15, 2.5),
    new Wall(50, 15, 2.5, 10),
    new Wall(0, 15, 27.5, 15),
    new Wall(57.5, 15, 2.5, 2.5),
    new Wall(70, 15, 15, 15),
    new Wall(55, 0, 10, 2.5),
    new Wall(55, 2.5, 5, 5),
    new Wall(67.5, 22.5, 2.5, 7.5),
]);
level.setBoundaries(0, 85, 0, 30, !glob.building);
level.addEscape(2, 0, 10, 'option2', 20, glob.building);
level.addEscape(2, 75, 85, 'meetup1', -15, glob.building);
export default level;