import Level from '../src/level.js';
import glob from '../src/global.js';
import MovingBlock from '../src/MovingBlock.js';
import Wall from '../src/Wall.js';
const door1 = new MovingBlock(47.5, -20, 5, 15, {m: 5, gravity: false, classname: 'movingblock', });
const button1 = new MovingBlock(32.5, -20, 5, 2.5, {m: 5, gravity: false, classname: 'button', });
button1.turnOnExpansion();
button1.xreceivesMomentum = false;
button1.yreceivesMomentum = false;
button1.updates = true;
let pressed = false;
button1.update = () => {
    console.log('updates');
    if(button1.touching[1].length > 0) {
        if(button1.y.size > 1) {
            button1.y.expansionSpeed = -5;
        } else {
            button1.y.expansionSpeed = 0;
            if(!pressed) {
                pressed = true;
                door1.y.velocity = 6;
            }
        }
    } else {
        if(pressed) {
            pressed = false;
            door1.y.velocity = -6;
        }
        if(button1.y.size < 2.5) {
            button1.y.expansionSpeed = 10;
        } else {
            console.log('e')
            button1.y.expansionSpeed = 0;
        }
    }
}

door1.xreceivesMomentum = false;
door1.yreceivesMomentum = false;

const level = new Level([
    new MovingBlock(15, 0, 20, 10, {m: 50, gravity: true, classname: 'movingblock', }),
    new Wall(0, -5, 20, 5),
    new Wall(30, -5, 17.5, 5),
    new Wall(5, 10, 50, 7.5),
    new Wall(52.5, -7.5, 2.5, 17.5),
    new Wall(65, -10, 5, 2.5),
    new Wall(55, 2.5, 5, 2.5),
    new Wall(65, 15, 5, 2.5),
    button1,
    door1,
]);
level.setBoundaries(0, 70, -20, 25, !glob.building);
level.addEscape(0, 0, 10, 'below1', 1.25, glob.building);
export default level;