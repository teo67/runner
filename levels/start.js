import Level from '../src/level.js';
import Wall from '../src/wall.js';
import MovingBlock from '../src/movingBlock.js';
const buttonPusher = new MovingBlock(-25, -9, 40, 1, 10, false, 'button')
buttonPusher.xreceivesMomentum = false;
buttonPusher.updates = true;
buttonPusher.update = () => {
    if(buttonPusher.touching[1].length == 0 && !buttonPusher.touchingStatic[1]) {
        if(buttonPusher.y.position < -9) {
            buttonPusher.y.velocity = 4;
        } else {
            buttonPusher.y.position = -9;
            buttonPusher.y.velocity = 0;
        }
    }
}
const buttonSkin = new Wall(-25, -10, 40, 4, 'button-skin');
buttonSkin.updates = true;
buttonSkin.update = () => {
    buttonSkin.y.size = buttonPusher.y.position + 9;
        buttonSkin.element.style.height = `${buttonSkin.y.size + 2}vw`;
        if(buttonSkin.y.size < 0) {
            buttonSkin.y.size = 0;
        }
}
const buttonReceiver = new MovingBlock(-30, 20, 5, 5, 5, true);
buttonReceiver.updates = true;
buttonReceiver.update = () => {
    if(buttonPusher.y.position == -10) {
        buttonReceiver.x.acceleration = 5;
    } else {
        buttonReceiver.x.acceleration = -5;
    }
}
const buttonReceiver2 = new MovingBlock(-15, 20, 5, 5, 5, true);
buttonReceiver2.updates = true;
buttonReceiver2.update = () => {
    if(buttonPusher.y.position == -10) {
        buttonReceiver2.x.acceleration =-5;
    } else {
        buttonReceiver2.x.acceleration = 5;
    }
}
const level = new Level([
    buttonPusher,
    buttonSkin,
    buttonReceiver,
    buttonReceiver2,
    new Wall(-30, 15, 15, 5),
    new Wall(20, 15, 15, 5),
    //new Wall(3, -10, 5, 2)
]);
level.setBoundaries(-30, 35, -10, 50);
level.addEscape(3, 0, 10, 'second', 2.5, 0);
export default level;