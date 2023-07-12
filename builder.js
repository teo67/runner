import Player from './src/player.js';
import Level from './src/level.js';
import Wall from './src/wall.js';
import keysDown from './src/keyListener.js';
import MovingBlock from './src/movingBlock.js';
const game = document.getElementById("game");
const menu = document.getElementById("builder-menu");
const snapOff = document.getElementById("snap-off");
const snap1x = document.getElementById("snap-1x");
const snap2x = document.getElementById("snap-2x");
const blockSection = document.getElementById("add-blocks");
const deleteButton = document.getElementById("delete");
const player = new Player(true, true);
const preview = document.getElementById("preview-box");
let lastTime = Date.now();
let selectedObject = null;
let selected = false;
const scale = {x: 0, y: 0};
const other = {x: 0, y: 0};
const changing = {x: 0, y: 0};
const mouse = {x: 0, y: 0};
const moveTag = {x: 0, y: 0};
const hoverRadius = 1;
let addingNewBlock = false;
const addableBlocks = {
    "block": (x, y, w, h) => new Wall(x, y, w, h),
    "movingblock": (x, y, w, h) => new MovingBlock(x, y, w, h, 5, true)
};


let moveMode = false;
let valid = true;
let currentSnapElement = snapOff;
let currentBuildElement = null;
let deleting = false;
const changeSnap = ev => {
    currentSnapElement.classList.remove("selected");
    ev.target.classList.add("selected");
    currentSnapElement = ev.target;
}
const testObject = (obj, isLevel) => {
    let min;
    let max;
    if(isLevel) {
        min = {x: obj.x.min, y: obj.y.min};
        max = {x: obj.x.max, y: obj.y.max};
    } else {
        min = {x: obj.x.position, y: obj.y.position };
        max = {y: obj.y.position + obj.y.size, x: obj.x.position + obj.x.size};
    }
    if(mouse.x <= max.x + hoverRadius && mouse.x >= min.x - hoverRadius && mouse.y <= max.y + hoverRadius && mouse.y >= min.y - hoverRadius) {
        moveMode = false;
        const edited = {x: true, y: true};
        for(const dir of ['x', 'y']) {
            if(Math.abs(mouse[dir] - max[dir]) < hoverRadius) {
                scale[dir] = 1;
                other[dir] = min[dir];
                changing[dir] = max[dir];
            } else if(Math.abs(mouse[dir] - min[dir]) < hoverRadius) {
                scale[dir] = -1;
                other[dir] = max[dir];
                changing[dir] = min[dir];
            } else {
                edited[dir] = false;
            }
        }
        if(edited.x || edited.y) {
            selectedObject = obj;
            for(const dir of ['x', 'y']) {
                if(!edited[dir]) {
                    scale[dir] = 0;
                    other[dir] = min[dir];
                    changing[dir] = max[dir];
                }
            }
        } else if(!isLevel) {
            selectedObject = obj;
            // move the object
            moveMode = true;
            scale.x = 0;
            scale.y = 0;
            changing.x = max.x;
            other.x = min.x;
            changing.y = max.y;
            other.y = min.y;
        }
    }
}
const main = async () => {
    const level = new Level([]);
    level.setPlayer(player);
    level.setBoundaries(0, 10, 0, 10, false);
    level.load(game, 0, 0, true, false);
    level.element.appendChild(preview);
    document.onmousemove = event => {
        mouse.x = 100 * event.clientX/document.documentElement.clientWidth - level.x.offset + level.x.min;
        mouse.y = 100 * (document.documentElement.clientHeight - event.clientY)/document.documentElement.clientWidth - level.y.offset + level.y.min;
        if(selected) {
            if(currentSnapElement != snapOff) {
                const snapAmount = (currentSnapElement == snap1x) ? 5 : 10;
                mouse.x = snapAmount * Math.ceil(mouse.x / snapAmount);
                if(moveMode || scale.x == -1) {
                    mouse.x -= snapAmount;
                }
                mouse.y = snapAmount * Math.ceil(mouse.y / snapAmount);
                if(moveMode || scale.y == -1) {
                    mouse.y -= snapAmount;
                }
            } else if(moveMode) {
                mouse.x -= moveTag.x;
                mouse.y -= moveTag.y;
            }
        }
    }
    document.onmousedown = ev => {
        if(menu.contains(ev.target)) {
            return;
        }
        if(!selected && selectedObject !== null) {
            if(deleting) {
                deleteButton.classList.remove("selected");
                deleting = false;
                if(selectedObject !== level) {
                    level.blocks.splice(level.blocks.indexOf(selectedObject), 1);
                    level.element.removeChild(selectedObject.element);
                }
                return;
            }
            if(moveMode) {
                moveTag.x = mouse.x - other.x;
                moveTag.y = mouse.y - other.y;
            }
            selected = true;
            addingNewBlock = false;
            preview.classList.remove("hidden");
            level.updatePose(Math.min(changing.x, other.x), Math.min(changing.y, other.y), preview);
            preview.style.width = `${Math.abs(changing.x - other.x)}vw`;
            preview.style.height = `${Math.abs(changing.y - other.y)}vw`;
        } else if(selected && valid) {
            if(moveMode) {
                selectedObject.x.position = mouse.x;
                selectedObject.y.position = mouse.y;
            } else {
                for(const dir of ['x', 'y']) {
                    const xsize = (mouse[dir] - other[dir]) * scale[dir];
                    if(xsize > 0) {
                        if(selectedObject === level) {
                            selectedObject[dir][scale[dir] == 1 ? "max" : "min"] = mouse[dir];
                        } else {
                            selectedObject[dir].size = xsize;
                            if(scale[dir] == -1) {
                                selectedObject[dir].position = mouse[dir];
                            }
                        }
                    }
                }
            }
            if(selectedObject === level) {
                selectedObject.finishLoading(false);
                for(const obj of level.blocks) {
                    level.updatePose(obj.x.position, obj.y.position, obj.element);
                }
            } else {
                selectedObject.updateScale();
                level.updatePose(selectedObject.x.position, selectedObject.y.position, selectedObject.element);
            }
            if(addingNewBlock) {
                level.addBlock(selectedObject);
            }
            if(currentBuildElement !== null) {
                currentBuildElement.classList.remove("selected");
                currentBuildElement = null;
            }
            selected = false;
            preview.classList.add("hidden");
        }
    }
    snapOff.classList.add("selected");
    snapOff.onclick = changeSnap;
    snap1x.onclick = changeSnap;
    snap2x.onclick = changeSnap;
    let blockNum = 0;
    for(const key in addableBlocks) {
        const element = document.createElement("div");
        element.classList.add(key);
        element.classList.add("builder-adder");
        element.onclick = () => {
            if(currentBuildElement !== null) {
                currentBuildElement.classList.remove("selected");
            }
            if(deleting) {
                deleting = false;
                deleteButton.classList.remove("selected");
            }
            currentBuildElement = element;
            element.classList.add("selected");
            selected = true;
            addingNewBlock = true;
            selectedObject = addableBlocks[key](0, 0, 5, 5);
            moveMode = true;
            moveTag.x = 2.5;
            moveTag.y = 2.5;
            scale.x = 0;
            scale.y = 0;
            changing.x = 5;
            other.x = 0;
            changing.y = 5;
            other.y = 0;
            preview.classList.remove("hidden");
            preview.style.width = `5vw`;
            preview.style.height = `5vw`;
        }
        blockSection.appendChild(element);
        blockNum++;
    }
    deleteButton.onclick = () => {
        deleteButton.classList.add("selected");
        deleting = true;
        if(currentBuildElement !== null) {
            currentBuildElement.classList.remove("selected");
            currentBuildElement = null;
        }
        if(selected) {
            selected = false;
            preview.classList.add("hidden");
        }
    }
    while(true) {
        const ntime = Date.now();
        const dt = (ntime - lastTime) / 1000;
        if(dt < 0) {
            continue;
        }
        level.update((ntime - lastTime) / 1000, true);
        if(!selected) {
            const previousSelected = selectedObject;
            const prevScaleX = scale.x;
            const prevScaleY = scale.y;
            selectedObject = null;
            
            for(const obj of level.blocks) {
                if(obj === player) {
                    continue;
                }
                testObject(obj, false);
                if(selectedObject !== null) {
                    break;
                }
            }
            if(selectedObject === null) {
                testObject(level, true);
            }
            if(previousSelected !== selectedObject) {
                if(previousSelected !== null) {
                    previousSelected.element.classList.remove("selected");
                }
                if(selectedObject !== null) {
                    selectedObject.element.classList.add("selected");
                }
            }
            if(prevScaleX != scale.x || prevScaleY != scale.y || previousSelected !== selectedObject) {
                if(previousSelected !== null) {
                    previousSelected.element.classList.remove(`selected${prevScaleX}${prevScaleY}`);
                }
                if(selectedObject !== null) {
                    selectedObject.element.classList.add(`selected${scale.x}${scale.y}`);
                }
            }
        } else {
            valid = true;
            const width = scale.x == 0 ? (changing.x - other.x) : Math.max(scale.x * (mouse.x - other.x), 0);
            const height = scale.y == 0 ? (changing.y - other.y) : Math.max(scale.y * (mouse.y - other.y), 0);
            let y = (scale.y == -1 || moveMode) ? mouse.y : other.y;
            let x = (scale.x == -1 || moveMode) ? mouse.x : other.x;
            if(scale.x != 0) {
                preview.style.width = `${width}vw`;
            }
            if(moveMode || scale.x == -1) {
                preview.style.left = `${x - level.x.min}vw`;
            }
            if(scale.y != 0) {
                preview.style.height = `${height}vw`;
            }
            if(moveMode || scale.y == -1) {
                preview.style.bottom = `${y - level.y.min}vw`;
            }
            if(selectedObject === level) {
                for(const block of level.blocks) {
                    if(block.x.position < x || block.x.position + block.x.size > x + width || block.y.position < y || block.y.position + block.y.size > y + height) {
                        valid = false;
                        break;
                    }
                }
            } else {
                if(x < level.x.min || x + width > level.x.max || y < level.y.min || y + height > level.y.max) {
                    valid = false;
                } else if(selectedObject.touchable) {
                    for(const block of level.blocks) {
                        if(block !== selectedObject && block.touchable) {
                            if(block.x.position + block.x.size > x && block.x.position < x + width && block.y.position + block.y.size > y && block.y.position < y + height) {
                                valid = false;
                                break;
                            }
                        }
                    }
                }
            }
            preview.classList = "";
            if(!valid) {
                preview.classList.add("invalid");
            }
        }
        if(keysDown['e']) {
            if(selected) {
                selected = false;
                preview.classList.add("hidden");
            }
            if(currentBuildElement !== null) {
                currentBuildElement.classList.remove("selected");
                currentBuildElement = null;
            }
            if(deleting) {
                deleting = false;
                deleteButton.classList.remove("selected");
            }
        }
        lastTime = ntime;
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}
main();