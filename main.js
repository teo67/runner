// https://coolors.co/6e44ff-b892ff-ffc2e2-ff90b3-ef7a85
import Level from './src/level.js';
import Wall from './src/wall.js';
import Escape from './src/escape.js';
import MovingBlock from './src/movingBlock.js';
import Player from './src/player.js';
const game = document.getElementById("game");
const fpsCounter = document.getElementById("FPS");

const player = new Player();
const startScreen = new Level([
    new Wall(-5, -5, 15, 5),
    new Wall(-30, 0, 10, 5),
    new Wall(-25, 18, 20, 2),
    new Wall(25, 8, 10, 2),
    new Wall(15, -10, 2, 30),
    new Wall(17, -5, 5, 2),
    new Wall(30, 28, 5, 2)
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
