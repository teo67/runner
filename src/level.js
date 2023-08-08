import Escape from './escape.js';
import epsilonEquals from './epsilonEquals.js';
const maximumReasonableTranslation = 2;
const maximumVelocity = 40;
const escapeVelocity = 20;
const cover = document.getElementById("cover");
class Level {
    constructor(blocks) {
        this.player = null;
        this.blocks = blocks;
        this.element = document.createElement("div");
        this.element.classList.add("level");
        for(const block of this.blocks) {
            block.initialize(this);
        }
        this.x = {};
        this.y = {};
        
        this.x.min = 0;
        this.y.min = 0;
        this.x.max = 0;
        this.y.max = 0;
        this.x.offset = 0;
        this.y.offset = 0;
        this.alreadyLoaded = false;
        this.escapes = [[], [], [], []];
        this.escapingSide = 0;
        this.leavingTo = 1; // null = in middle of level, escape = leaving, 1 = entering
        this.fullyLeft = false;
    }
    addBlock(block) {
        this.blocks.push(block);
        block.initialize(this);
        this.updatePose(block.x.position, block.y.position, block.element);
    }
    setPlayer(player) {
        if(this.player === null) {
            this.player = player;
            this.blocks.push(player);
        }
    }
    static LEFT = 0;
    static RIGHT = 3;
    static UP = 1;
    static DOWN = 2;
    setBoundaries(minX, maxX, minY, maxY, boundaries = true) {
        this.x.min = minX;
        this.x.max = maxX;
        this.y.min = minY;
        this.y.max = maxY;
        this.finishLoading(boundaries);
    }
    addEscape(side, lowerBound, upperBound, otherLevel, spawnPos, building) {
        const visual = document.createElement("div");
        const behindVisual = document.createElement("div");
        visual.classList.add("escape");
        behindVisual.classList.add("behindEscape");
        visual.classList.add(`a${side}`);
        this.element.appendChild(visual);
        this.element.appendChild(behindVisual);
        const horizontal = side == 0 || side == 3;
        const dir = horizontal ? 'x' : 'y';
        const positive = side % 2 != 0;
        let settingValue = this[dir][positive ? 'max' : 'min'];
        if(side % 2 == 0) {
            settingValue -= 5;
        }
        if(horizontal) {
            this.updatePose(settingValue, lowerBound, visual);
            this.updatePose(settingValue, lowerBound, behindVisual);
            visual.style.height = `${upperBound - lowerBound}vw`;
            behindVisual.style.height = `${upperBound - lowerBound}vw`;
            
        } else {
            this.updatePose(lowerBound, settingValue, visual);
            this.updatePose(lowerBound, settingValue, behindVisual);
            visual.style.width = `${upperBound - lowerBound}vw`;
            behindVisual.style.width = `${upperBound - lowerBound}vw`;
        }
        const esc = new Escape(side, lowerBound, upperBound, otherLevel, spawnPos)
        this.escapes[side].push(esc);
        if(building) {
            visual.classList.add('build-escape');
            visual.innerText = otherLevel;
            visual.onanimationend = () => { // an event that will never happen
                return esc;
            }
            visual.onanimationstart = () => {
                return behindVisual;
            }
        }
    }
    reloadEscapePositions() {
        for(const child of this.element.children) {
            if(child.classList.contains("escape")) {
                const esc = child.onanimationend();
                const alternate = child.onanimationstart();
                const horizontal = esc.side == 0 || esc.side == 3;
                const dir = horizontal ? 'x' : 'y';
                const positive = esc.side % 2 != 0;
                let settingValue = this[dir][positive ? 'max' : 'min'];
                if(esc.side % 2 == 0) {
                    settingValue -= 5;
                }
                if(horizontal) {
                    this.updatePose(settingValue, esc.lowerBound, child);
                    this.updatePose(settingValue, esc.lowerBound, alternate);
                } else {
                    this.updatePose(esc.lowerBound, settingValue, child);
                    this.updatePose(esc.lowerBound, settingValue, alternate);
                }
            }
        }
    }
    load(game, x = 0, y = 0, firstLevel = false, boundaries = true) {
        this.fullyLeft = false;
        this.leavingTo = firstLevel ? null : 1;
        this.player.initialize(this);
        if(!this.alreadyLoaded) {
            this.x.min = x;
            this.y.min = y;
            this.x.max = x + this.player.x.size;
            this.y.max = y + this.player.y.size;
        }
        for(let i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].deleting) {
                this.element.removeChild(this.blocks[i].element);
                this.blocks.splice(i, 1);
                i--;
                continue;
            }
            if(this.blocks[i].deleted) {
                this.element.appendChild(this.blocks[i].element);
                delete this.blocks[i].deleted;
            }
            const block = this.blocks[i];
            if(block !== this.player && !this.alreadyLoaded) {
                for(const direction of ['x', 'y']) {
                    if(block[direction].position < this[direction].min) {
                        this[direction].min = block[direction].position;
                    }
                    if(block[direction].position + block[direction].size > this[direction].max) {
                        this[direction].max = block[direction].position + block[direction].size;
                    }
                }
            }
        }
        if(!this.alreadyLoaded) {
            this.finishLoading(boundaries);
        }
        this.player.x.position = x;
        this.player.y.position = y;
        this.updateView();
        for(const block of this.blocks) {
            this.updatePose(block.x.position, block.y.position, block.element);
        }
        game.appendChild(this.element);
    }
    finishLoading(boundaries = true) {
        this.element.style.width = `${this.x.max - this.x.min}vw`;
        this.element.style.height = `${this.y.max - this.y.min}vw`;
        if(boundaries) {
            this.createBoundary(-15, -15, 10, this.y.max - this.y.min + 30);
            this.createBoundary(this.x.max - this.x.min + 5, -15, 10, this.y.max - this.y.min + 30);
            this.createBoundary(-10, -15, this.x.max - this.x.min + 20, 10);
            this.createBoundary(-10, this.y.max - this.y.min + 5, this.x.max - this.x.min + 20, 10);
        }
        this.alreadyLoaded = true;
    }
    createBoundary(x, y, w, h) {
        const bound = document.createElement("div");
        bound.classList.add("boundary");
        bound.style.left = `${x}vw`;
        bound.style.height = `${h}vw`;
        bound.style.bottom = `${y}vw`;
        bound.style.width = `${w}vw`;
        this.element.appendChild(bound);
    }
    update(dt, building = false, testing = false) {
        if(building) {
            this.ratioAndReset(this.player, dt);
            this.preliminaryCollisionAdjustment(this.player);
            this.doMinMaxAccel(this.player, dt, false);
            this.player.update(dt);
        } else {
            this.updateCollisions(dt, testing);
        }
        this.updateView(!building);
    }
    updatePose(x, y, element) {
        element.style.left = `${x - this.x.min}vw`;
        element.style.bottom = `${y - this.y.min}vw`;
    }
    updateViewForDirection(direction, ratio, propName, crop = true) {
        const mid = this.player[direction].position + this.player[direction].size/2;
        this[direction].offset = this[direction].min - mid + 50 * ratio;
        if(crop && this[direction].max - this[direction].min >= 95 * ratio) {
            if(this[direction].min >= mid - 50 * ratio + 5) {
                this[direction].offset = 5;
            } else if(this[direction].max <= mid + 50 * ratio - 5) {
                this[direction].offset = 100 * ratio - 5 - this[direction].max + this[direction].min;
            }
        }
        this.element.style[propName] = `${this[direction].offset}vw`;
    }
    updateView(crop = true) {
        this.updateViewForDirection('x', 1, 'left', crop);
        this.updateViewForDirection('y', document.documentElement.clientHeight/document.documentElement.clientWidth, 'bottom', crop);
    }
    getTranslationDistance(A, B, Bx, direction) { // false for never collides, true for already colliding, number for distance
        const pos = A[direction].position;
        const size = A[direction].size;
        const bPos = B[direction].position;
        const bSize = B[direction].size;
        if(pos + size < bPos || epsilonEquals(pos + size, bPos)) {
            let v = A[direction].velocity;
            if(A.expands) {
                v += A[direction].expansionSpeed;
            }
            if(v <= 0) {
                return false;
            }
            return bPos + Bx - pos - size;
        }
        if(pos > bPos + bSize || epsilonEquals(pos, bPos + bSize)) {
            if(A[direction].velocity >= 0) {
                return false;
            }
            return bPos + Bx + bSize - pos;
        }
        return true;
    }
    getCollisionPointHelper(A, B, Bx, dist, direction) {
        return A[direction].position + dist <= Bx + B[direction].size && A[direction].position + dist + A[direction].size >= Bx;
    }
    getEffectiveVelocity(A, direction, use) {
        if(use || !A.expands) {
            return A[direction].velocity;
        }
        return A[direction].velocity + A[direction].expansionSpeed;
    }
    getCollisionPoint(A, B, considerBTranslation, BXTranslation = 0, BYTranslation = 0) { // false for never collides, number for distance
        let Bx = B.x.position;
        let By = B.y.position;
        let xAdd = Bx < A.x.position;
        let yAdd = By < A.y.position;
        if(considerBTranslation) {
            if(B.expands) {
                if(xAdd) {
                    BXTranslation += B.x.expansionSpeed * B.translation;
                }
                if(yAdd) {
                    BYTranslation += B.y.expansionSpeed * B.translation;
                }
            }
            Bx += BXTranslation;
            By += BYTranslation;
        }
        const xDist = this.getTranslationDistance(A, B, BXTranslation, 'x');
        const yDist = this.getTranslationDistance(A, B, BYTranslation, 'y');
        if(xDist === true) {
            if(yDist === true) {
                console.log (A);
                console.log (B);
                throw "uhhh these blocks are inside of each other??? ERROR";
            }
            if(yDist === false) { return false; }
            return yDist / this.getEffectiveVelocity(A, 'y', yAdd);
        }
        if(yDist === true) {
            if(xDist === false) { return false; }
            return xDist / this.getEffectiveVelocity(A, 'x', xAdd);
        }
        if(xDist !== false && yDist !== false) {
            const xvel = this.getEffectiveVelocity(A, 'x', xAdd);
            const yvel = this.getEffectiveVelocity(A, 'y', yAdd);
            if(this.getCollisionPointHelper(A, B, By, yvel * xDist / xvel, 'y')) {
                return xDist / xvel;
            }
            if(this.getCollisionPointHelper(A, B, Bx, xvel * yDist / yvel, 'x')) {
                return yDist / yvel;
            }
        }
        return false;
    }
    preliminaryCollisionAdjustment(A) {
        let translation = A.translation;
        if(A.touchable) {
            for(let j = 0; j < this.blocks.length; j++) {
                const B = this.blocks[j];
                if(A !== B && B.touchable) {
                    let collisionPoint = this.getCollisionPoint(A, B, false);
                    if(B.moves && B.translation != 0 && (B.x.velocity != 0 || B.y.velocity != 0 || (B.expands && (B.x.expansionSpeed != 0 || B.y.expansionSpeed != 0)))) {
                        const minCollisionPoint = this.getCollisionPoint(A, B, true, B.x.velocity * B.translation, B.y.velocity * B.translation);
                        if(collisionPoint !== false && (minCollisionPoint === false || minCollisionPoint > collisionPoint)) {
                            this.preliminaryCollisionAdjustment(B);
                            collisionPoint = this.getCollisionPoint(A, B, false);
                        } else {
                            collisionPoint = minCollisionPoint;
                        }
                    }
                    if(collisionPoint !== false && collisionPoint < translation) {
                        translation = collisionPoint;
                    }
                }
            }
        }
        for(const d of ['x', 'y']) {
            let effectiveV = A[d].velocity;
            if(A.expands) {
                effectiveV += A[d].expansionSpeed;
            }
            if(A[d].velocity < 0 && this[d].min - A[d].position > translation * A[d].velocity) {
                translation = (this[d].min - A[d].position) / A[d].velocity;
            } else if(effectiveV > 0 && this[d].max - A[d].position - A[d].size < translation * effectiveV) {
                translation = (this[d].max - A[d].position - A[d].size) / effectiveV;
            }
        }
        if(translation < 0) {
            translation = 0;
        }
        A.x.position += translation * A.x.velocity;
        A.y.position += translation * A.y.velocity;
        this.updatePose(A.x.position, A.y.position, A.element);
        if(A.expands) {
            A.x.size += translation * A.x.expansionSpeed;
            A.y.size += translation * A.y.expansionSpeed;
            if(A.x.size <= 0) {
                A.x.size = 0;
                A.x.expansionSpeed = 0;
            }
            if(A.y.size <= 0) {
                A.y.size = 0;
                A.y.expansionSpeed = 0;
            }
            A.updateScale()
        }
        A.translation = 0;
    }
    updateTouching(A, i, B, dir, bool) {
        if(A.touchable && B.touchesOthers) {
            if(A.moves) {
                B.touching[i].push(A);
            } else {
                B.touchingStatic[i] = true;
                if(bool && B.moves) {
                    if(B.expands && side % 2 == 1 && B[dir].expansionSpeed < 0) {
                        B[dir].velocity = -B[dir].expansionSpeed;
                    } else {
                        B[dir].velocity = 0;
                        if(B.expands && B[dir].expansionSpeed > 0) {
                            B[dir].expansionSpeed = 0;
                        }
                    }
                }
            }
        }
    }
    isMatching(value, i) {
        return value != 0 && (value < 0) == (i % 2 == 0);
    }
    getBonus(starter, dir) {
        let prevBonus = starter.bonus;
        if(starter.expands) {
            return prevBonus + starter[dir].expansionSpeed;
        }
        return prevBonus;
    }
    getMinVelocities(starter, i, dir, multiplier, momentumInfo, totalMass, totalMomentum) {
        let minimumV = null;
        if(totalMass == 0) {
            starter.bonus = 0;
        }
        if(starter.expands) {
            starter.nextExpansionSpeed = starter[dir].expansionSpeed;
        }
        if(starter.touchingStatic[i]) {
            starter.minVelocity = 0;
            minimumV = 0;
        } else {
            let maxBonus = 0;
            const adding = starter[dir].velocity * starter.m * multiplier;
            let theoreticalVelocity = (totalMomentum + adding) / (totalMass + starter.m);
            if(i % 2 == 1 && starter.expands) {
                theoreticalVelocity += starter[dir].expansionSpeed * multiplier;
            }
            for(const connection of starter.touching[i]) {
                let effectiveV = connection[dir].velocity;
                if(i % 2 == 0 && connection.expands) {
                    effectiveV += connection[dir].expansionSpeed;
                }
                effectiveV *= multiplier;
                if(epsilonEquals(theoreticalVelocity, effectiveV) || theoreticalVelocity > effectiveV) {
                    connection.bonus = 0;
                    if(i % 2 == 1) {
                        let prevBonus = this.getBonus(starter, dir);
                        connection.bonus = prevBonus;
                        momentumInfo.bonusMomentum -= prevBonus * connection.m;
                    }
                    this.getMinVelocities(connection, i, dir, multiplier, momentumInfo, totalMass + starter.m, totalMomentum + adding);
                    if(connection.minVelocity !== null) {
                        let minV = connection.minVelocity;
                        if(connection.expands && i % 2 == 0) {
                            minV -= connection.nextExpansionSpeed;
                        }
                        if(minimumV === null || minV < minimumV) {
                            minimumV = minV;
                        }
                    }
                    if(i % 2 == 0) {
                        let prevBonus = this.getBonus(connection, dir);
                        if(prevBonus > maxBonus) {
                            maxBonus = prevBonus;
                        }
                    }
                } else {
                    momentumInfo.ignored.push(connection);
                }
            }
            if(i % 2 == 0) {
                starter.bonus = maxBonus;
                momentumInfo.bonusMomentum += maxBonus * starter.m;
            }
            momentumInfo.connected.push(starter);
            momentumInfo.mass += starter.m;
            momentumInfo.momentum += adding;
            
            starter.minVelocity = minimumV;
        }
        
        if(minimumV !== null && starter.expands) {
            const tempMin = Math.max(0, minimumV - starter[dir].expansionSpeed);
            if(i % 2 == 1) {
                starter.minVelocity = tempMin;
            }
            starter.nextExpansionSpeed = minimumV - tempMin;
        }
        if(!starter[dir + 'receivesMomentum']) {
            if(minimumV === null || starter[dir].velocity * multiplier < minimumV) {
                starter.minVelocity = starter[dir].velocity * multiplier;
            }
        }
        if(totalMass == 0) {
            if(starter.minVelocity === null) { // standard collision
                momentumInfo.momentum += momentumInfo.bonusMomentum;
                let firstV = momentumInfo.momentum/momentumInfo.mass + starter.bonus * multiplier;
                if(starter.expands && i % 2 == 1) {
                    firstV += starter[dir].expansionSpeed;
                }
                if(momentumInfo.connected.length > 1 && firstV >= 0) {
                    const settingVelocity = momentumInfo.momentum/momentumInfo.mass * multiplier;
                    for(const connected of momentumInfo.connected) {
                        connected[dir].marked = false;
                        connected.minVelocity = null;
                        connected[dir].velocity = settingVelocity;
                        if(connected.bonus != 0) {
                            connected[dir].velocity += connected.bonus;
                        }
                    }
                }
                for(const ignore of momentumInfo.ignored) {
                    if(ignore[dir].marked) {
                        if(ignore[dir].velocity * multiplier > 0 && ignore.touching[i].length > 0) {
                            this.getMinVelocities(ignore, i, dir, multiplier, {mass: 0, momentum: 0, connected: [], bonusMomentum: 0, ignored: []}, 0, 0);
                        }
                    }
                }
            } else {
                this.chainMomentum(starter, i, dir, multiplier, {mass: 0, momentum: 0, connected: [], bonusMomentum: 0, ignored: []}, 0, 0);
            }
        }
    }

    chainMomentum(starter, i, dir, multiplier, momentumInfo, totalMass, totalMomentum) {
        const adding = starter[dir].velocity * starter.m * multiplier;
        let theoreticalVelocity = starter.minVelocity;
        if(theoreticalVelocity === null) {
            theoreticalVelocity = (totalMomentum + adding) / (totalMass + starter.m);
            momentumInfo.bonusMomentum -= starter.bonus * starter.m * multiplier;
            theoreticalVelocity += starter.bonus * multiplier;
        }
        if(i % 2 == 1 && starter.expands) {
            theoreticalVelocity += starter.nextExpansionSpeed;
        }
        for(const connection of starter.touching[i]) {
            let nextVelocity = connection.minVelocity;
            if(nextVelocity === null) {
                nextVelocity = (connection[dir].velocity + connection.bonus) * multiplier;
            }
            if(i % 2 == 0 && connection.expands) {
                nextVelocity -= connection.nextExpansionSpeed;
            }
            if(epsilonEquals(theoreticalVelocity, nextVelocity) || theoreticalVelocity > nextVelocity) {
                this.chainMomentum(connection, i, dir, multiplier, momentumInfo, totalMass + starter.m, totalMomentum + adding);
            } else if(connection[dir].marked && connection[dir].velocity * multiplier > 0 && connection.touching[i].length > 0) {
                momentumInfo.ignored.push(connection);
            }
        }
        momentumInfo.connected.push(starter);
        momentumInfo.mass += starter.m;
        momentumInfo.momentum += adding;
        if(totalMass == 0) { // if this was the starter
            momentumInfo.momentum += momentumInfo.bonusMomentum;
            let settingVelocity = starter.minVelocity;
            if(settingVelocity === null) {
                settingVelocity = momentumInfo.momentum/momentumInfo.mass;
                settingVelocity += starter.bonus * multiplier;
            }
            if(starter.expands && i % 2 == 1) {
                settingVelocity += starter.nextExpansionSpeed;
            } 
            if(momentumInfo.connected.length > 1 && settingVelocity >= 0) {
                for(const connected of momentumInfo.connected) {
                    connected[dir].marked = false;
                    let min = starter.minVelocity;
                    if(connected.minVelocity !== null) {
                        min = connected.minVelocity;
                    }
                    if(min === null) {
                        connected[dir].velocity = momentumInfo.momentum/momentumInfo.mass * multiplier + connected.bonus;
                    } else {
                        connected[dir].velocity = min * multiplier;
                    }
                    if(connected.expands) {
                        connected[dir].expansionSpeed = connected.nextExpansionSpeed;
                    }
                    connected.minVelocity = null;
                }
            }
            for(const ignore of momentumInfo.ignored) {
                this.getMinVelocities(ignore, i, dir, multiplier, {mass: 0, momentum: 0, connected: [], bonusMomentum: 0, ignored: []}, 0, 0);
            }
        }
    }
    onEdge(A, side, d, otherD, _escape, boo, canEscape = true) {
        A.touchingStatic[side] = true;
        if(boo) {
            if(canEscape && A === this.player && this.leavingTo === null) {
                for(const escape of this.escapes[side]) {
                    if(A[otherD].position >= escape.lowerBound && A[otherD].position + A[otherD].size <= escape.upperBound) {
                        this.escapingSide = side;
                        this.leavingTo = escape;
                        A[d].velocity = _escape;
                        A[otherD].velocity = 0;
                        cover.style.display = 'block';
                        return;
                    }
                }
            }
            if(A.expands && side % 2 == 1 && A[d].expansionSpeed < 0) {
                A[d].velocity = -A[d].expansionSpeed;
            } else {
                A[d].velocity = 0;
                if(A.expands && A[d].expansionSpeed > 0) {
                    A[d].expansionSpeed = 0;
                }
            }
        }
    }
    accelerate(A, dir, dt) {
        A[dir].velocity += A[dir].acceleration * dt;
        const xSign = Math.sign(A[dir].velocity);
        if(A[dir].velocity * xSign > maximumVelocity) {
            A[dir].velocity = maximumVelocity * xSign;
        }
    }
    doMinMaxAccel(A, dt, canEscape = true) {
        if(A.moves && (A !== this.player || this.leavingTo === null)) {
            this.accelerate(A, 'x', dt);
            this.accelerate(A, 'y', dt);
        
            if(epsilonEquals(A.y.position, this.y.min)) {
                this.onEdge(A, 2, 'y', 'x', -escapeVelocity, A.y.velocity < 0, canEscape);
            } else if(epsilonEquals(A.y.position + A.y.size, this.y.max)) {
                this.onEdge(A, 1, 'y', 'x', escapeVelocity, this.getEffectiveVelocity(A, 'y', false) > 0, canEscape);
            }
            if(epsilonEquals(A.x.position, this.x.min)) {
                this.onEdge(A, 0, 'x', 'y', -escapeVelocity, A.x.velocity < 0, canEscape);
            } else if(epsilonEquals(A.x.position + A.x.size, this.x.max)) {
                this.onEdge(A, 3, 'x', 'y', escapeVelocity, this.getEffectiveVelocity(A, 'x', false) > 0, canEscape);
            }
        }
    }
    ratioAndReset(block, dt) {
        if(block.touchesOthers) {
            block.touching = [[], [], [], []]; // left, up, down, right (other block is on the left, other block is above, etc.)
            block.touchingStatic = [false, false, false, false];
        }
        if(block.moves) {
            if(block.touchesOthers && block.touchable) {
                block.x.marked = true; // used as placeholder, will be set to true
                block.y.marked = true;
                block.x.bonus = 0;
                block.y.bonus = 0;
            }
            let ratio = 1;
            let absX = block.x.velocity;
            let absY = block.y.velocity;
            if(block.expands) {
                if((absX > 0) == (block.x.expansionSpeed > 0)) {
                    absX += block.x.expansionSpeed;
                }
                if((absY > 0) == (block.y.expansionSpeed > 0)) {
                    absY += block.y.expansionSpeed;
                }
            }
            absX = Math.abs(absX);
            absY = Math.abs(absY);
            if(absX > absY) {
                ratio = maximumReasonableTranslation / (absX * dt);
            } else {
                ratio = maximumReasonableTranslation / (absY * dt);
            }
            block.translation = dt;
            if(ratio < 1) {
                console.log ("L + Ratio");
                console.log (absX);
                console.log (absY);
                console.log (dt);
                block.translation *= ratio;
            }
        }
    }
    updateCollisions(dt, testing = false) {
        for(const block of this.blocks) {
            this.ratioAndReset(block, dt);
        }
        for(const A of this.blocks) {
            if(A.moves) {
                if(A.translation != 0 && (A.x.velocity != 0 || A.y.velocity != 0 || (A.expands && (A.x.expansionSpeed != 0 || A.y.expansionSpeed != 0)))) {
                    if(A === this.player && this.leavingTo !== null) {
                        const name = this.escapingSide == 0 || this.escapingSide == 3 ? "x" : "y";
                        A[name].position += escapeVelocity * dt * ((this.escapingSide % 2 == 0) ? -1 : 1);
                        this.updatePose(A.x.position, A.y.position, A.element);
                        let diff = 0;
                        if(this.escapingSide % 2 == 0) {
                            if(this.leavingTo == 1) {
                                diff = A[name].position - this[name].max + 5;
                            } else {
                                diff = A[name].position - this[name].min + 10;
                            }
                        } else {
                            if(this.leavingTo == 1) {
                                diff = this[name].min - A[name].position;
                            } else {
                                diff = this[name].max + 5 - A[name].position;
                            }
                        }
                        if(diff <= 0) {
                            if(this.leavingTo == 1) {
                                this.leavingTo = null;
                                cover.style.display = "none";
                            } else {
                                this.fullyLeft = true;
                            }
                        } else {
                            cover.style.opacity = `${this.leavingTo == 1 ? diff*12 : (120 - diff*12)}%`;
                        }
                        
                    } else {
                        this.preliminaryCollisionAdjustment(A);
                    }
                }
            }
        }
        const starters = [[], [], [], []];
        for(const A of this.blocks) {
            this.doMinMaxAccel(A, dt, !testing);
        }
        const aboveRightCheckers = [];
        const aboveLeftCheckers = [];
        const belowRightCheckers = [];
        const belowLeftCheckers = [];
        for(let i = 0; i < this.blocks.length; i++) {
            const A = this.blocks[i];
            if(A !== this.player || this.leavingTo === null) {
                if(A.touchable || A.touchesOthers) {
                    for(let j = i + 1; j < this.blocks.length; j++) {
                        const B = this.blocks[j];
                        if((B.touchable && A.touchesOthers) || (A.touchable && B.touchesOthers)) {
                            const rightAbove = epsilonEquals(A.y.position, B.y.position + B.y.size);
                            const rightBelow = epsilonEquals(A.y.position + A.y.size, B.y.position);
                            const onTheRight = epsilonEquals(A.x.position, B.x.position + B.x.size);
                            const onTheLeft = epsilonEquals(A.x.position + A.x.size, B.x.position);
                            let skip = false;
                            const aQualified = A.moves && A.touchesOthers;
                            const bQualified = B.moves && B.touchesOthers;
                            if(A.touchable && B.touchable && (aQualified || bQualified)) {
                                skip = true;
                                if(rightAbove) {
                                    if(onTheRight) {
                                        if(aQualified) {
                                            aboveRightCheckers.push(A);
                                        }
                                        if(bQualified) {
                                            belowLeftCheckers.push(B);
                                        }
                                    } else if(onTheLeft) {
                                        if(aQualified) {
                                            aboveLeftCheckers.push(A);
                                        }
                                        if(bQualified) {
                                            belowRightCheckers.push(B);
                                        }
                                    } else {
                                        skip = false;
                                    }
                                } else if(rightBelow) {
                                    if(onTheRight) {
                                        if(aQualified) {
                                            belowRightCheckers.push(A);
                                        }
                                        if(bQualified) {
                                            aboveLeftCheckers.push(B);
                                        }
                                    } else if(onTheLeft) {
                                        if(aQualified) {
                                            belowLeftCheckers.push(A);
                                        }
                                        if(bQualified) {
                                            aboveRightCheckers.push(B);
                                        }
                                    } else {
                                        skip = false;
                                    }
                                } else {
                                    skip = false;
                                }
                            } 
                            if(!skip) {
                                if(this.getTranslationDistance(A, B, 0, 'x') === true) {
                                    if(rightAbove) {
                                        this.updateTouching(A, 1, B, 'y', this.getEffectiveVelocity(B, 'y', false) > 0);
                                        this.updateTouching(B, 2, A, 'y', A.y.velocity < 0);
                                    } else if(rightBelow) {
                                        this.updateTouching(A, 2, B, 'y', B.y.velocity < 0);
                                        this.updateTouching(B, 1, A, 'y', this.getEffectiveVelocity(A, 'y', false) > 0);
                                    }
                                } else if(this.getTranslationDistance(A, B, 0, 'y') === true) {
                                    if(onTheRight) {
                                        this.updateTouching(A, 3, B, 'x', this.getEffectiveVelocity(B, 'x', false) > 0);
                                        this.updateTouching(B, 0, A, 'x', A.x.velocity < 0);
                                    } else if(onTheLeft) {
                                        this.updateTouching(A, 0, B, 'x', B.x.velocity < 0);
                                        this.updateTouching(B, 3, A, 'x', this.getEffectiveVelocity(A, 'x', false) > 0);
                                    }
                                }
                            }
                        }
                    }
                }
                if(A.touchesOthers && A.moves) {
                    for(let i = 0; i < 4; i++) {
                        const dir = (i == 0 || i == 3) ? 'x' : 'y';
                        if(A.touching[i].length > 0 && this.isMatching(this.getEffectiveVelocity(A, dir, i % 2 == 0), i)) {
                            let broken = false;
                            for(const otherTouching of A.touching[3 - i]) {
                                if(this.isMatching(this.getEffectiveVelocity(otherTouching, dir, i % 2 == 0), i)) {
                                    broken = true;
                                    break;
                                }
                            }
                            if(!broken) {
                                starters[i].push(A);
                            }
                        }
                    }
                }
            }
        }
        for(const block of this.blocks) {
            if(block.updates && (block !== this.player || this.leavingTo === null)) {
                block.update(dt);
            }
        }
        for(let i = 0; i < 4; i++) {
            const dir = (i == 0 || i == 3) ? 'x' : 'y';
            const multiplier = (i % 2 == 0) ? -1 : 1;
            for(let j = 0; j < starters[i].length; j++) {
                if(starters[i][j][dir].marked) {
                    this.getMinVelocities(starters[i][j], i, dir, multiplier, {connected: [], mass: 0, momentum: 0, bonusMomentum: 0, ignored: []}, 0, 0);
                }
            }
        }
        
        for(const checker of aboveRightCheckers) {
            if(checker.y.velocity < 0 && checker.x.velocity < 0) {
                checker.y.velocity = 0;
                checker.x.velocity = 0;
            }
        }
        for(const checker of aboveLeftCheckers) {
            if(checker.y.velocity < 0 && checker.x.velocity > 0) {
                checker.y.velocity = 0;
                checker.x.velocity = 0;
            }
        }
        for(const checker of belowLeftCheckers) {
            if(checker.y.velocity > 0 && checker.x.velocity > 0) {
                checker.y.velocity = 0;
                checker.x.velocity = 0;
            }
        }
        for(const checker of belowRightCheckers) {
            if(checker.y.velocity > 0 && checker.x.velocity < 0) {
                checker.y.velocity = 0;
                checker.x.velocity = 0;
            }
        }
    }
    unload(game) {
        this.element.removeChild(this.player.element);
        game.removeChild(this.element);
    }
}
export default Level;