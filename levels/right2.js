import Level from '../src/level.js';
import glob from '../src/global.js';
import Wall from '../src/Wall.js';
import SpawningBlock from '../src/SpawningBlock.js';
import Enemy from '../src/Enemy.js';
import Button from '../src/Button.js';
import MovingBlock from '../src/MovingBlock.js';
import Checkpoint from '../src/Checkpoint.js';
import makeSliderOpener from '../src/makeSliderOpener.js';
const slider1 = new MovingBlock(35, 12.5, 10, 2.5, {gravity: false, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {slider1.marker = 'slider1';}
const button1 = new Button(70, 0, 5, 2.5);
if(glob.building) {button1.marker = 'button1';}
const level = new Level([
    new Wall(0, -2.5, 17.5, 2.5),
    new SpawningBlock(12.5, 0, 5, 5, {spawnX: 12.5, spawnY: 25, __proto__: SpawningBlock.prototype.defaultData}),
    new Enemy(0, -20, 175, 2.5),
    new Wall(52.5, -2.5, 22.5, 2.5),
    new Wall(32.5, 5, 2.5, 25),
    button1,
    new SpawningBlock(35, 25, 5, 5, {spawnX: 140, spawnY: 25, __proto__: SpawningBlock.prototype.defaultData}),
    new SpawningBlock(35, 20, 5, 5, {spawnX: 115, spawnY: 25, __proto__: SpawningBlock.prototype.defaultData}),
    new SpawningBlock(35, 15, 5, 5, {spawnX: 90, spawnY: 25, __proto__: SpawningBlock.prototype.defaultData}),
    slider1,
    new Wall(42.5, 15, 2.5, 15),
    new Wall(160, 2.5, 15, 2.5),
    new Checkpoint(52.5, -2.5, 15, 10),
]);
level.setBoundaries(0, 175, -20, 30, !glob.building);
level.addEscape(0, 0, 10, 'meetup1', 1.25, glob.building);
level.addEscape(3, 5, 10, 'right3', 0, glob.building);

makeSliderOpener(button1, slider1, 2.5, 12.5)

export default level;