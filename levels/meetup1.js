import Level from '../src/level.js';
import glob from '../src/global.js';
import Enemy from '../src/Enemy.js';
import Wall from '../src/Wall.js';
import Button from '../src/Button.js';
import MovingBlock from '../src/MovingBlock.js';
import BackgroundImage from '../src/BackgroundImage.js';
import SpawningBlock from '../src/SpawningBlock.js';
import makeSliderOpener from '../src/makeSliderOpener.js';
let level = null;


const build1 = new SpawningBlock(-17.5, -62.5, 2.5, 5, {spawnX: 30, spawnY: 5, __proto__: SpawningBlock.prototype.defaultData});
if(glob.building) {build1.marker = 'build1';}
const build7 = new SpawningBlock(45, -57.5, 2.5, 2.5, {spawnX: 30, spawnY: 5, __proto__: SpawningBlock.prototype.defaultData});
if(glob.building) {build7.marker = 'build7';}
const build6 = new SpawningBlock(32.5, -60, 10, 2.5, {spawnX: 30, spawnY: 5, __proto__: SpawningBlock.prototype.defaultData});
if(glob.building) {build6.marker = 'build6';}
const build5 = new SpawningBlock(25, -62.5, 5, 5, {spawnX: 30, spawnY: 5, __proto__: SpawningBlock.prototype.defaultData});
if(glob.building) {build5.marker = 'build5';}
const build4 = new SpawningBlock(12.5, -55, 10, 5, {spawnX: 30, spawnY: 5, __proto__: SpawningBlock.prototype.defaultData});
if(glob.building) {build4.marker = 'build4';}
const build3 = new SpawningBlock(0, -57.5, 10, 5, {spawnX: 30, spawnY: 5, __proto__: SpawningBlock.prototype.defaultData});
if(glob.building) {build3.marker = 'build3';}
const build2 = new SpawningBlock(-12.5, -60, 10, 5, {spawnX: 30, spawnY: 5, __proto__: SpawningBlock.prototype.defaultData});
if(glob.building) {build2.marker = 'build2';}
const slider1 = new MovingBlock(65, -60, 25, 2.5, {gravity: false, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {slider1.marker = 'slider1';}
const button1 = new Button(70, -70, 7.5, 2.5);
if(glob.building) {button1.marker = 'button1';}
level = new Level([
    new Enemy(-20, -70, 85, 5),
    new Wall(65, -70, 5, 10),
    new Wall(10, -50, 47.5, 2.5),
    button1,
    slider1,
    new Enemy(90, -70, 10, 12.5),
    new Wall(80, -5, 20, 2.5),
    new Wall(27.5, 0, 2.5, 10),
    new Wall(42.5, 0, 2.5, 10),
    build2,
    build3,
    build4,
    build5,
    build6,
    build7,
    build1,
    new Wall(-20, -2.5, 32.5, 2.5),
    new Wall(10, 0, 2.5, 5),
    new BackgroundImage(52.5, -15, 15.331754999999418, 14.153799600000639, {path: './images/upright.png', __proto__: BackgroundImage.prototype.defaultData})
]);
level.setBoundaries(-20, 100, -70, 10, !glob.building);
level.addEscape(1, -20, -5, 'option2part2', 77.5, glob.building);
level.addEscape(2, 77.5, 90, 'option1', 138.75, glob.building);
level.addEscape(3, -2.5, 10, 'right2', 2.5, glob.building);

makeSliderOpener(button1, slider1, 1, 25);

export default level;
