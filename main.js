// https://coolors.co/6e44ff-b892ff-ffc2e2-ff90b3-ef7a85

import Player from './src/player.js';
import importLevel from './src/importLevel.js';
const game = document.getElementById("game");
const fpsCounter = document.getElementById("FPS");
const cache = {};
const startName = 'start';
const player = new Player();
let lastTime = Date.now();
let frameCount = 0;
let nextSecond = Math.ceil(Date.now()/1000) * 1000;
const main = async () => {
    let level = await importLevel(cache, startName, player);
    level.load(game, level.x.min, level.y.min, true);
    while(true) {
        frameCount++;
        const ntime = Date.now();
        level.update((ntime - lastTime) / 1000);
        if(level.leavingTo !== null && level.fullyLeft) {
            const nextLevel = await importLevel(cache, level.leavingTo.to, player);
            nextLevel.escapingSide = level.leavingTo.side;
            level.unload(game);
            const spawnIsY = level.leavingTo.side == 0 || level.leavingTo.side == 3;
            const isMax = level.leavingTo.side % 2 == 0;
            const maxMin = isMax ? 'max' : 'min';
            const edgeAdd = isMax ? 5 : -10;
            nextLevel.load(game, spawnIsY ? nextLevel.x[maxMin] + edgeAdd : level.leavingTo.spawn, spawnIsY ? level.leavingTo.spawn : nextLevel.y[maxMin] + edgeAdd);
            level = nextLevel;
        }
        lastTime = ntime;
        if(lastTime >= nextSecond) {
            fpsCounter.innerText = `${frameCount} FPS`;
            frameCount = 0;
            nextSecond += 1000;
        }
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}
main();