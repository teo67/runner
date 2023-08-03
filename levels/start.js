import Level from '../src/level.js';
import Wall from '../src/Wall.js';
import MovingBlock from '../src/MovingBlock.js';
const bH = 5;
const bMH = 1;
const button = new MovingBlock(-10, -10, 5, bH, 5, false, 'button');
button.expands = true;
button.x.expansionSpeed = 0;
button.y.expansionSpeed = 0;
button.updates = true;
button.yreceivesMomentum = false;
button.xreceivesMomentum = false;
button.update = () => {
    if(button.touching[1].length > 0) {
        button.y.expansionSpeed = -8;
        if(button.y.size <= bMH) {
            button.y.expansionSpeed = 0;
        }
    } else {
        button.y.expansionSpeed =3;
        if(button.y.size >= bH) {
            button.y.expansionSpeed = 0;
        }
    }
};

const level = new Level([
    button
]);
level.setBoundaries(-30, 35, -10, 50);
level.addEscape(3, 0, 10, 'second', 2.5, 0);
export default level;