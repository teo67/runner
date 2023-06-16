import Level from '../src/level.js';
import Wall from '../src/wall.js';
import MovingBlock from '../src/movingBlock.js';
const special = new MovingBlock(10, -10, 5, 5, 5, false, 'button');
special.expands = true;
special.x.expansionSpeed = 0;
special.y.expansionSpeed = 0;
special.updates = true;
special.touchable = true;
special.xreceivesMomentum = false;
special.yreceivesMomentum = false;
special.update = () => {
    if(special.touching[1].length > 0) {
        if(special.y.size <= 1) {
            special.y.expansionSpeed = 0;
        } else {
            special.y.expansionSpeed = -5;
            //
        }
    } else {
        if(special.y.size >= 5) {
            special.y.expansionSpeed = 0;
            special.y.size = 5;
        } else {
            special.y.expansionSpeed = 5;
        }
    }
}
const level = new Level([
    special
]);
level.setBoundaries(-30, 35, -10, 50);
level.addEscape(3, 0, 10, 'second', 2.5, 0);
export default level;