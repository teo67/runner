import Player from './src/player.js';
import Level from './src/level.js';
import Wall from './src/Wall.js';
import glob from './src/global.js';
import MovingBlock from './src/MovingBlock.js';
import importLevel from './src/importLevel.js';
const game = document.getElementById("game");
const goto = document.getElementById("goto");
const test = document.getElementById("test");
const propertyEditor = document.getElementById("property-editor");
const specialMarker = document.getElementById("special-marker");
const properties = document.getElementById("properties");
const propSaver = document.getElementById("save-props");
const notification = document.getElementById("notification");
const _export = document.getElementById("export");
const propCloser = document.getElementById("close-props");
const menu = document.getElementById("builder-menu");
const snapOff = document.getElementById("snap-off");
const snap5x = document.getElementById("snap-0.5x");
const snap1x = document.getElementById("snap-1x");
const snap2x = document.getElementById("snap-2x");
const blockSection = document.getElementById("add-blocks");
const deleteButton = document.getElementById("delete");
const player = new Player(true, true);
let levelName = 'start';
let level;
let escapes;
const preview = document.getElementById("preview-box");
let lastTime = Date.now();
let selectedObject = null;
let selected = false;
const scale = {x: 0, y: 0};
const other = {x: 0, y: 0};
const changing = {x: 0, y: 0};
const mouse = {x: 0, y: 0};
const moveTag = {x: 0, y: 0};
const cache = {};
const hoverRadius = 1;
let addingNewBlock = false;
const addableBlocks = {
    "block": (x, y, w, h) => new Wall(x, y, w, h),
    "movingblock": (x, y, w, h) => new MovingBlock(x, y, w, h)
};
let cachedLevelName = "";
let cachedLevel = null;
let cachedBounds = null;
let moveMode = false;
let valid = true;
let currentSnapElement = snapOff;
let currentBuildElement = null;
let deleting = false;
let editingProps = false;
let makingEscape = false;
let testing = false;
const occupied = () => selected || deleting || editingProps || testing;
const altOccupied = () => makingEscape || editingProps || testing; // less restrictive
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
const makeEscapes = () => {
    escapes = [];
    for(let i = 0; i < 4; i++) {
        const esc = document.createElement("div");
        esc.classList.add("escape-adder");
        escapes.push(esc);
    }
}
const canTest = () => {
    for(const block of level.blocks) {
        if(block === player) {
            continue;
        }
        if(block.y.position < player.y.position + 5 && block.y.position + block.y.size > player.y.position && 
           block.x.position < player.x.position + 5 && block.x.position + block.x.size > player.x.position) {
            return false;
        }
    }
    return true;
}
const updateEscapePositions = () => { // left up down right
    level.updatePose(level.x.min - 8, level.y.min, escapes[0]);
    level.updatePose(level.x.min, level.y.max + 6, escapes[1]);
    level.updatePose(level.x.min, level.y.min - 8, escapes[2]);
    level.updatePose(level.x.max + 6, level.y.min, escapes[3]);
    for(let i = 0; i < 4; i++) {
        if(i == 0 || i == 3) {
            escapes[i].style.width = `2vw`;
            escapes[i].style.height = `${level.y.max - level.y.min}vw`;
        } else {
            escapes[i].style.height = `2vw`;
            escapes[i].style.width = `${level.x.max - level.x.min}vw`;
        }
    }
}
const setupEscape = i => {
    moveMode = true;
    moveTag.x = 0;
    moveTag.y = 0;
    scale.x = 0;
    scale.y = 0;
    preview.style.width = (i == 0 || i == 3) ? `${level.x.max - level.x.min}vw` : '0.2vw';
    preview.style.height = (i == 1 || i == 2) ? `${level.y.max - level.y.min}vw` : '0.2vw';
    preview.style.left = '0vw';
    preview.style.bottom = '0vw';
}
const createLevel = () => {
    level = new Level([]);
    cache[levelName] = level;
    level.setPlayer(player);
    level.setBoundaries(0, 10, 0, 10, false);
}
const loadLevel = () => {
    level.load(game, level.x.min, level.y.min, true, false);
    level.element.appendChild(preview);
}
const appendEscapes = () => {
    for(let i = 0; i < 4; i++) {
        level.element.appendChild(escapes[i]);
    }
}
const setCaches = () => {
    cachedLevel = level;
    cachedLevelName = levelName;
    const dir = selectedObject == 0 || selectedObject == 3 ? 'y' : 'x';
    cachedBounds = [other[dir], mouse[dir]];
}
const clearCaches = () => {
    cachedLevel = null;
    cachedLevelName = "";
    cachedBounds = null;
}
const setEscapes = () => {
    const dir = selectedObject == 0 || selectedObject == 3 ? 'y' : 'x';
    const firstLower = Math.min(cachedBounds[0], cachedBounds[1]);
    const firstUpper = Math.max(cachedBounds[0], cachedBounds[1]);
    const secondLower = Math.min(other[dir], mouse[dir]);
    const secondUpper = Math.max(other[dir], mouse[dir]);
    cachedLevel.addEscape(selectedObject, firstLower, firstUpper, levelName, secondLower/2 + secondUpper/2 - 2.5, true); // (side, lowerBound, upperBound, otherLevel, spawnPos, _otherSettingValue)
    level.addEscape(3 - selectedObject, secondLower, secondUpper, cachedLevelName, firstLower/2 + firstUpper/2 - 2.5, true);
}
const copyLevelToClipboard = () => {
    let start = "import Level from '../src/level.js';\nimport glob from '../src/global.js';";
    let second = "\nconst level = new Level([";
    const end = `\nexport default level;`;
    let middle = "";
    const imports = [];
    for(const block of level.blocks) {
        if(block !== player) {
            if(!imports.includes(block.cName)) {
                imports.push(block.cName);
                start += `\nimport ${block.cName} from '../src/${block.cName}.js';`;
            }
            let _middle = `new ${block.cName}(${block.x.position}, ${block.y.position}, ${block.x.size}, ${block.y.size}`;
            if(block.customData !== undefined) {
                let allSame = true;
                let str = "{";
                for(const item in block.customData) {
                    let adding = block.customData[item];
                    if(typeof adding == 'string') {
                        adding = `'${adding}'`;
                    }
                    str += `${item}: ${adding}, `;
                    if(block.customData[item] != block.defaultData[item]) {
                        allSame = false;
                    }
                }
                str += "}";
                if(!allSame) {
                    _middle += `, ${str}`;
                } else {
                    block.customData = undefined;
                }
            } 
            _middle += ")";
            if(block.marker === undefined || block.marker.length == 0) {
                middle += `\n    ${_middle},`;
            } else {
                second = `\nconst ${block.marker} = ${_middle};` + second;
                middle += `\n    ${block.marker},`;
            }
        }
    }
    middle += "\n]);";
    middle += `\nlevel.setBoundaries(${level.x.min}, ${level.x.max}, ${level.y.min}, ${level.y.max}, !glob.building);`;
    for(let i = 0; i < 4; i++) {
        for(const escape of level.escapes[i]) {
            middle += `\nlevel.addEscape(${i}, ${escape.lowerBound}, ${escape.upperBound}, '${escape.to}', ${escape.spawn}, glob.building);`;
        }
    }
    navigator.clipboard.writeText(start + second + middle + end);
}
const giveNotification = text => {
    notification.innerText = text;
    notification.classList.remove("faded");
    setTimeout(() => {
        notification.classList.add("faded");
    }, 2000);
}
const main = async () => {
    glob.building = true;
    level = await importLevel(cache, levelName, player);
    loadLevel();
    makeEscapes();
    updateEscapePositions();
    appendEscapes();
    for(let i = 0; i < 4; i++) {
        escapes[i].onclick = () => {
            if(occupied()) {
                return;
            }
            selected = true;
            selectedObject = i;
            deleting = false;
            makingEscape = true;
            preview.classList.remove("hidden");
            setupEscape(i);
        }
    }
    test.onclick = () => {
        if(testing) {
            test.classList.remove('testing');
            testing = false;
            player.flies = true;
            player.touchable = false;
            for(const block of level.blocks) {
                block.reset();
                level.updatePose(block.x.position, block.y.position, block.element);
            }
            return;
        }
        if(occupied() || !canTest()) {
            return;
        }
        test.classList.add('testing');
        testing = true;
        player.flies = false;
        player.touchable = true;
        for(const block of level.blocks) {
            if(block.customData !== undefined) {
                block.updateData(block.customData);
            }
        }
    }
    propCloser.onclick = () => {
        while(properties.firstChild) {
            properties.removeChild(properties.firstChild);
        }
        propertyEditor.classList.add("hidden");
        editingProps = false;
    }
    propSaver.onclick = () => {
        selectedObject.marker = specialMarker.value;
        if(selectedObject.customData === undefined) {
            selectedObject.customData = {};
        }
        for(const element of properties.children) {
            if(element.nodeName == "INPUT") {
                let val = element.value;
                if(val == 'true') {
                    val = true;
                } else if(val == 'false') {
                    val = false;
                } else if(val.length > 0 && '0123456789'.includes(val[0])) {
                    val = Number.parseFloat(val);
                }
                selectedObject.customData[element.name] = val;
            }
        }
    }
    _export.onclick = () => {
        copyLevelToClipboard();
        giveNotification("Level copied to clipboard!");
    }
    goto.onclick = async () => {
        if(occupied()) {
            return;
        }
        editingProps = true;
        let resp = window.prompt("Level name:","");
        let _level = null;
        while(true) {
            if(resp == null) {
                editingProps = false;
                return;
            }
            try {
                const nextLevel = await importLevel(cache, resp, player);
                _level = nextLevel;
                levelName = resp;
                break;
            } catch {
                resp = window.prompt("That level does not exist! Try again:","");
            }
        }
        copyLevelToClipboard();
        giveNotification("Leaving level, code copied to clipboard!");
        level.unload(game);
        level = _level;
        loadLevel();
        appendEscapes();
        updateEscapePositions();
        editingProps = false;
    }
    document.oncontextmenu = event => {
        event.preventDefault();
        if(occupied()) {
            return;
        }
        if(event.target.classList.contains('escape')) {
            const esc = event.target.onanimationend();
            level.escapes[esc.side].splice(level.escapes[esc.side].indexOf(esc), 1);
            const otherVis = event.target.onanimationstart();
            event.target.remove();
            otherVis.remove();
            giveNotification("Deleted! It's recommended to delete the corresponding escape in the other level (" + esc.to + ") too.");
            return;
        }
        if(selectedObject !== null) {
            editingProps = true;
            for(const key in selectedObject.defaultData) {
                const label = document.createElement("label");
                label.htmlFor = key;
                label.innerText = key;
                const element = document.createElement("input");
                element.type = "text";
                element.name = key;
                element.required = false;
                element.value = selectedObject.customData === undefined ? selectedObject.defaultData[key] : selectedObject.customData[key];
                properties.appendChild(label);
                properties.appendChild(element);
            }
            propertyEditor.classList.remove("hidden");
        }
    }
    document.onmousemove = event => {
        mouse.x = 100 * event.clientX/document.documentElement.clientWidth - level.x.offset + level.x.min;
        mouse.y = 100 * (document.documentElement.clientHeight - event.clientY)/document.documentElement.clientWidth - level.y.offset + level.y.min;
        if(selected) {
            if(makingEscape && !moveMode) {
                if(scale.x != 0 && mouse.x != other.x) {
                    const newX = Math.sign(mouse.x - other.x);
                    if(newX == 1 && scale.x != 1) {
                        preview.style.left = `${other.x - level.x.min}vw`;
                    }
                    scale.x = newX;
                }
                if(scale.y != 0 && mouse.y != other.y) {
                    const newY = Math.sign(mouse.y - other.y);
                    if(newY == 1 && scale.y != 1) {
                        preview.style.bottom = `${other.y - level.y.min}vw`;
                    }
                    scale.y = newY;
                }
            }
            if(currentSnapElement != snapOff) {
                const snapAmount = (currentSnapElement == snap1x) ? 5 : (currentSnapElement == snap2x ? 10 : 2.5);
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
    document.onmousedown = async ev => {
        if(ev.button != 0 || editingProps || testing) {
            return;
        }
        if(menu.contains(ev.target)) {
            return;
        }
        if(escapes.includes(ev.target)) {
            return;
        }
        if(ev.target.classList.contains('escape')) {
            const esc = ev.target.onanimationend();
            copyLevelToClipboard();
            giveNotification("Leaving level, code copied to clipboard!");
            level.unload(game);
            level = await importLevel(cache, esc.to, player);
            levelName = esc.to;
            loadLevel();
            appendEscapes();
            updateEscapePositions();
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
            if(makingEscape) {
                if(moveMode) {
                    moveMode = false;
                    other.x = mouse.x;
                    other.y = mouse.y;
                    if(selectedObject == 0 || selectedObject == 3) {
                        scale.y = 1;
                    } else {
                        scale.x = 1;
                    }
                } else {
                    if(cachedLevel === null) {
                        editingProps = true; // proxy
                        let resp = window.prompt("What level should this escape go to?","");
                        while(true) {
                            if(resp == null) {
                                selected = false;
                                preview.classList.add("hidden");
                                makingEscape = false;
                                selectedObject = null;
                                editingProps = false;
                                return;
                            } else {
                                if(resp.startsWith('/create ') && resp.length > 8) {
                                    setCaches();
                                    levelName = resp.substring(8);
                                    createLevel();
                                    
                                    player.x.position = 0;
                                    player.y.position = 0;
                                    break;
                                } else {
                                    try {
                                        const nextLevel = await importLevel(cache, resp, player);
                                        setCaches();
                                        level = nextLevel;
                                        levelName = resp;
                                        player.x.position = (selectedObject == 3) ? level.x.max - 5 : level.x.min;
                                        player.y.position = (selectedObject == 1) ? level.y.max - 5 : level.y.min;
                                        break;
                                    } catch {
                                        resp = window.prompt("That level does not exist! Try again (use /create {name} to make a new level):","");
                                    }
                                }
                            }
                        }
                        editingProps = false;
                        cachedLevel.unload(game);
                        setupEscape(selectedObject);
                    } else {
                        setEscapes();
                        copyLevelToClipboard();
                        giveNotification(`Target level copied to clipboard! (name: ${levelName})`);
                        level.unload(game);
                        level = cachedLevel;
                        levelName = cachedLevelName;
                        clearCaches();
                        makingEscape = false;
                        selectedObject = null;
                        selected = false;
                        preview.classList.add("hidden");
                    } 
                    loadLevel();
                    appendEscapes();
                    updateEscapePositions();
                }
            } else {
                if(moveMode) {
                    selectedObject.permanentPositionUpdate('x', mouse.x);
                    selectedObject.permanentPositionUpdate('y', mouse.y);
                } else {
                    for(const dir of ['x', 'y']) {
                        const xsize = (mouse[dir] - other[dir]) * scale[dir];
                        if(xsize > 0) {
                            if(selectedObject === level) {
                                selectedObject[dir][scale[dir] == 1 ? "max" : "min"] = mouse[dir];
                            } else {
                                selectedObject[dir].size = xsize;
                                if(scale[dir] == -1) {
                                    selectedObject.permanentPositionUpdate(dir, mouse[dir]);
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
                    level.reloadEscapePositions();
                    updateEscapePositions(level, escapes);
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
    }
    snapOff.classList.add("selected");
    snapOff.onclick = changeSnap;
    snap1x.onclick = changeSnap;
    snap2x.onclick = changeSnap;
    snap5x.onclick = changeSnap;
    let blockNum = 0;
    for(const key in addableBlocks) {
        const element = document.createElement("div");
        element.classList.add(key);
        element.classList.add("builder-adder");
        element.onclick = () => {
            if(altOccupied()) {
                return;
            }
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
            selectedObject.element.classList.add("selected");
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
        if(altOccupied()) {
            return;
        }
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
        
        if(!editingProps) {
            level.update((ntime - lastTime) / 1000, !testing, testing);
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
                if((moveMode || scale.x == -1) && selectedObject != 0 && selectedObject != 3) {
                    preview.style.left = `${x - level.x.min}vw`;
                }
                if(scale.y != 0) {
                    preview.style.height = `${height}vw`;
                }
                if((moveMode || scale.y == -1) && selectedObject != 1 && selectedObject != 2) {
                    preview.style.bottom = `${y - level.y.min}vw`;
                }
                if(selectedObject === level) {
                    for(const block of level.blocks) {
                        if(block.x.position < x || block.x.position + block.x.size > x + width || block.y.position < y || block.y.position + block.y.size > y + height) {
                            valid = false;
                            break;
                        }
                    }
                } else if (makingEscape) {
                    if(selectedObject == 0 || selectedObject == 3) {
                        if(mouse.y < level.y.min || mouse.y > level.y.max) {
                            valid = false;
                        }
                    } else if(mouse.x < level.x.min || mouse.x > level.x.max) {
                        valid = false;
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
            if(glob.keysDown['e']) {
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
                if(makingEscape) {
                    makingEscape = false;
                    selectedObject = null;
                    if(cachedLevel != null) {
                        level = cachedLevel;
                        levelName = cachedLevelName;
                        clearCaches();
                        loadLevel();
                        appendEscapes();
                        updateEscapePositions();
                    }
                }
            }
        }
        lastTime = ntime;
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}
main();