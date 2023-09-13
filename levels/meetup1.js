import Level from '../src/level.js';
import glob from '../src/global.js';
import Enemy from '../src/Enemy.js';
import Wall from '../src/Wall.js';
import Button from '../src/Button.js';
import MovingBlock from '../src/MovingBlock.js';

let level = null;
const spawnX = 30;
const spawnY = 5;
class SpawningBlock extends MovingBlock {
    constructor(x, y, w, h, data) {
        super(x, y, w, h, data);
        this.waitingForSpawn = false;
    }
    update(dt) {
        if(this.waitingForSpawn) {
            for(const block of level.blocks) {
                if(block.x.position + block.x.size > spawnX && 
                    block.x.position < spawnX + this.x.size && 
                    block.y.position + block.y.size > spawnY && 
                    block.y.position < spawnY + this.y.size) {
                    return;
                }
            }
            console.log('we made it')
            console.log(this);
            this.x.position = spawnX;
            this.y.position = spawnY;
            this.element.style.display = "block";
            level.updatePose(this.x.position, this.y.position, this.element)
            this.waitingForSpawn = false;
            this.touchable = true;
        } else {
            if(this.touching[1].length > 0 || this.touching[2].length > 0 || this.touchingStatic[1] || this.touchingStatic[2]) {
                this.applyForceForTime(-6 * Math.sign(this.x.velocity), 'x', dt);
            }
            if(this.touching[0].length > 0 || this.touching[3].length > 0 || this.touchingStatic[0] || this.touchingStatic[3]) {
                this.applyForceForTime(-6 * Math.sign(this.y.velocity), 'y', dt);
            }
        }
    }
    die() {
        this.x.velocity = 0;
        this.y.velocity = 0;
        this.waitingForSpawn = true;
        this.touchable = false;
        this.element.style.display = "none";
    }
}
SpawningBlock.prototype.updates = true;
SpawningBlock.prototype.dies = true;

const build1 = new SpawningBlock(-17.5, -62.5, 2.5, 5, {m: 10, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {build1.marker = 'build1';}
const build7 = new SpawningBlock(45, -57.5, 2.5, 2.5, {m: 10, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {build7.marker = 'build7';}
const build6 = new SpawningBlock(32.5, -60, 10, 2.5, {m: 10, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {build6.marker = 'build6';}
const build5 = new SpawningBlock(25, -62.5, 5, 5, {m: 10, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {build5.marker = 'build5';}
const build4 = new SpawningBlock(12.5, -55, 10, 5, {m: 10, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {build4.marker = 'build4';}
const build3 = new SpawningBlock(0, -57.5, 10, 5, {m: 10, __proto__: MovingBlock.prototype.defaultData});
if(glob.building) {build3.marker = 'build3';}
const build2 = new SpawningBlock(-12.5, -60, 10, 5, {m: 10, __proto__: MovingBlock.prototype.defaultData});
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
    new Wall(-20, -2.5, 32.5, 2.5)
]);
level.setBoundaries(-20, 100, -70, 10, !glob.building);
level.addEscape(1, -20, -5, 'option2part2', 77.5, glob.building);
level.addEscape(2, 77.5, 90, 'option1', 138.75, glob.building);
level.addEscape(3, -2.5, 10, 'right2', 2.5, glob.building);

button1.onpress = () => {
    if(slider1.x.size > 1) {
        console.log("hellooooo")
        slider1.x.velocity = 5;
        slider1.x.expansionSpeed = -5;
    }
}

button1.onrelease = () => {
    if(slider1.x.size < 25) {
        slider1.x.velocity = -5;
        slider1.x.expansionSpeed = 5;
    }
}

slider1.xreceivesMomentum = false;
slider1.yreceivesMomentum = false;
slider1.updates = true;
slider1.turnOnExpansion();

slider1.update = () => {
    if(slider1.x.size < 1 && slider1.x.velocity > 0) {
        slider1.x.velocity = 0;
        slider1.x.expansionSpeed = 0;
    } else if(slider1.x.size > 25 && slider1.x.velocity < 0) {
        slider1.x.velocity = 0;
        slider1.x.expansionSpeed = 0;
    }
}

export default level;
