// https://coolors.co/6e44ff-b892ff-ffc2e2-ff90b3-ef7a85
import Level from './src/level.js';
import Wall from './src/wall.js';
import MovingBlock from './src/movingBlock.js';
import Player from './src/player.js';
const game = document.getElementById("game");
const fpsCounter = document.getElementById("FPS");
const level = new Level([
    new Wall(-50, -40, 5, 80),
    new Wall(45, -40, 5, 80),
    new Wall(-40, 45, 80, 5),
    new Wall(-40, -50, 80, 5),
    new MovingBlock(-20, 30, 7, 7, 5, false),
    new MovingBlock(0, 30, 7, 7, 5, false),
    new MovingBlock(20, 30, 7, 7, 5, false),
    new MovingBlock(-20, -30, 7, 7, 5, false),
    new MovingBlock(0, -30, 7, 7, 5, false),
    new MovingBlock(20, -30, 7, 7, 5, false)
], new Player());
level.load(game);
let lastTime = Date.now();
let frameCount = 0;
let nextSecond = Math.ceil(Date.now()/1000) * 1000;
const run = () => {
    frameCount++;
    const ntime = Date.now();
    level.update((ntime - lastTime) / 1000);
    lastTime = ntime;
    if(lastTime >= nextSecond) {
        fpsCounter.innerText = `${frameCount} FPS`;
        frameCount = 0;
        nextSecond += 1000;
    }
    setTimeout(run, 1);
};
setTimeout(run, 100);
