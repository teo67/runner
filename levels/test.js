import Level from '../src/level.js';
import Wall from '../src/Wall.js';
import MovingBlock from '../src/MovingBlock.js';
const slide1 = new MovingBlock(25, 20, 5, 10, {m: 5, gravity: false, classname: "movingblock", });

slide1.updates = true;
slide1.y.velocity = -5;
slide1.xreceivesMomentum = false;
slide1.yreceivesMomentum = false;
slide1.update = () => {
    if(slide1.touchingStatic[2]) {
        slide1.y.velocity = 5;
    } else if(slide1.touchingStatic[1]) {
        slide1.y.velocity = -5;
    }
};

const level = new Level([
    new Wall(0, -5, 5, 5),
    new Wall(5, 0, 10, 5),
    new MovingBlock(10, 5, 5, 5, {m: 25, gravity: true, classname: "movingblock", }),
    slide1,
]);
level.setBoundaries(-10, 50, -5, 30);
export default level;