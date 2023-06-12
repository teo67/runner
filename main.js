// https://coolors.co/6e44ff-b892ff-ffc2e2-ff90b3-ef7a85
import Level from './src/level.js';
import Wall from './src/wall.js';
import Escape from './src/escape.js';
import MovingBlock from './src/movingBlock.js';
import Player from './src/player.js';
const game = document.getElementById("game");
const fpsCounter = document.getElementById("FPS");

const player = new Player();
const slider = new MovingBlock(-10, 10, 5, 5, 5, false);
slider.x.velocity = 10;
slider.xreceivesMomentum = false;
slider.yreceivesMomentum = false;
const slider2 = new MovingBlock(0, 10, 10, 5, 5, false);
slider2.x.velocity = 5;
slider2.xreceivesMomentum = false;
slider2.yreceivesMomentum = false;
const a = new MovingBlock(-20, 5, 5, 10, 5, false);
const b = new MovingBlock(-15, 5, 5, 5, 5, false);
const c = new MovingBlock(-15, 10, 5, 5, 5, false);
a.x.velocity = 10;
b.x.velocity = 8;
c.x.velocity = 0;
const startScreen = new Level([
    // slider,
    // slider2,
    // a,
    // b,
    // c,
    new MovingBlock(-15, 10, 5, 5, 5, false),
    new MovingBlock(-10, 5, 5, 5, 5, false),
    new MovingBlock(-15, 20, 5, 5, 5, false),
    new MovingBlock(-10, -10, 5, 10, 5, false),
    // new MovingBlock(-5, -10, 5, 5, 5, false),
    // new MovingBlock(-5, -5, 5, 5, 5, false),
    // new MovingBlock(0, -10, 5, 5, 5, false),
    new Wall(25, -5, 5, 5)
], player);
startScreen.setBoundaries(-30, 35, -10, 50);
const second = new Level([new Wall(0, 0, 5, 5)], player);
second.setBoundaries(0, 50, 0, 50);
startScreen.connect(3, 10, 20, second, 10, 30);

let level = startScreen;
level.load(game, 0, 0, true);
let lastTime = Date.now();
let frameCount = 0;
let nextSecond = Math.ceil(Date.now()/1000) * 1000;
level.updateCollisions(0, true);
const run = () => {
    frameCount++;
    const ntime = Date.now();
    level.update((ntime - lastTime) / 1000);
    if(level.leavingTo !== null && level.fullyLeft) {
        level.leavingTo.takeFrom(level, game);
        level = level.leavingTo.to;
    }
    lastTime = ntime;
    if(lastTime >= nextSecond) {
        fpsCounter.innerText = `${frameCount} FPS`;
        frameCount = 0;
        nextSecond += 1000;
    }
    setTimeout(run, 1);
};
setTimeout(run, 100);
