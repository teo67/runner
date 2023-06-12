import Escape from './escape.js';
import epsilonEquals from './epsilonEquals.js';
const maximumReasonableTranslation = 2;
const maximumVelocity = 40;
const escapeVelocity = 20;
const bounds = ["minX", "maxY", "minY", "maxX"];
const cover = document.getElementById("cover");
class Level {
    constructor(blocks, player) {
        this.player = player;
        this.blocks = blocks;
        this.element = document.createElement("div");
        this.element.classList.add("level");
        for(const block of this.blocks) {
            block.initialize(this);
        }
        this.blocks.push(player);
        
        
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.alreadyLoaded = false;
        this.escapes = [[], [], [], []];
        this.escapingSide = 0;
        this.leavingTo = 1; // null = in middle of level, escape = leaving, 1 = entering
        this.fullyLeft = false;
    }
    static LEFT = 0;
    static RIGHT = 3;
    static UP = 1;
    static DOWN = 2;
    setBoundaries(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.finishLoading();
    }
    connect(side, lowerBound, upperBound, otherLevel, otherLowerBound, otherUpperBound) {
        this.addEscape(side, lowerBound, upperBound, otherLevel, otherUpperBound/2 + otherLowerBound/2 - 2.5);
        otherLevel.addEscape(3 - side, otherLowerBound, otherUpperBound, this, upperBound/2 + lowerBound/2 - 2.5);
    }
    addEscape(side, lowerBound, upperBound, otherLevel, spawnPos) {
        const visual = document.createElement("div");
        const behindVisual = document.createElement("div");
        visual.classList.add("escape");
        behindVisual.classList.add("behindEscape");
        visual.classList.add(`a${side}`);
        this.element.appendChild(visual);
        this.element.appendChild(behindVisual);
        let settingValue = this[bounds[side]];
        let otherSettingValue = otherLevel[bounds[3 - side]] - 10;
        if(side % 2 == 0) {
            settingValue -= 5;
            otherSettingValue += 15;
        }
        const horizontal = side == 0 || side == 3;
        if(horizontal) {
            this.updatePose(settingValue, lowerBound, visual);
            this.updatePose(settingValue, lowerBound, behindVisual);
            visual.style.height = `${upperBound - lowerBound}vw`;
            behindVisual.style.height = `${upperBound - lowerBound}vw`;
            this.escapes[side].push(new Escape(lowerBound, upperBound, otherLevel, otherSettingValue, spawnPos));
        } else {
            this.updatePose(lowerBound, settingValue, visual);
            this.updatePose(lowerBound, settingValue, behindVisual);
            visual.style.width = `${upperBound - lowerBound}vw`;
            behindVisual.style.width = `${upperBound - lowerBound}vw`;
            this.escapes[side].push(new Escape(lowerBound, upperBound, otherLevel, spawnPos, otherSettingValue));
        }
    }
    load(game, x = 0, y = 0, firstLevel = false) {
        this.fullyLeft = false;
        this.leavingTo = firstLevel ? null : 1;
        this.player.initialize(this);
        if(!this.alreadyLoaded) {
            this.minX = x;
            this.minY = y;
            this.maxX = x + this.player.w;
            this.maxY = y + this.player.h;
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
                if(block.x < this.minX) {
                    this.minX = block.x;
                }
                if(block.x + block.w > this.maxX) {
                    this.maxX = block.x + block.w;
                }
                if(block.y < this.minY) {
                    this.minY = block.y;
                }
                if(block.y + block.h > this.maxY) {
                    this.maxY = block.y + block.h;
                }
            }
        }
        if(!this.alreadyLoaded) {
            this.finishLoading();
        }
        this.player.x = x;
        this.player.y = y;
        this.updateView();
        for(const block of this.blocks) {
            this.updatePose(block.x, block.y, block.element);
        }
        game.appendChild(this.element);
    }
    finishLoading() {
        this.element.style.width = `${this.maxX - this.minX}vw`;
        this.element.style.height = `${this.maxY - this.minY}vw`;
        this.createBoundary(-15, -15, 10, this.maxY - this.minY + 30);
        this.createBoundary(this.maxX - this.minX + 5, -15, 10, this.maxY - this.minY + 30);
        this.createBoundary(-10, -15, this.maxX - this.minX + 20, 10);
        this.createBoundary(-10, this.maxY - this.minY + 5, this.maxX - this.minX + 20, 10);
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
    update(dt) {
        this.updateCollisions(dt);
        this.updateView();
    }
    updatePose(x, y, element) {
        element.style.left = `${x - this.minX}vw`;
        element.style.bottom = `${y - this.minY}vw`;
    }
    updateView() {
        const midX = this.player.x + this.player.w/2;
        const midY = this.player.y + this.player.h/2;
        this.element.style.left = `${this.minX - midX + 50}vw`;
        if(this.maxX - this.minX >= 95) {
            if(this.minX >= midX - 45) {
                this.element.style.left = "5vw";
            } else if(this.maxX <= midX + 45) {
                this.element.style.left = `${95 - this.maxX + this.minX}vw`;
            }
        }
        const ratio = document.documentElement.clientHeight/document.documentElement.clientWidth;
        this.element.style.bottom = `${this.minY - midY + 50 * ratio}vw`;
        if(this.maxY - this.minY >= 95 * ratio) {
            if(this.minY >= midY - 45 * ratio) {
                this.element.style.bottom = "5vh";
            } else if(this.maxY <= midY + 45 * ratio) {
                this.element.style.bottom = `${95 * ratio - this.maxY + this.minY}vw`;
            }
        }
    }
    getXTranslationDistance(A, B, Bx) { // false for never collides, true for already colliding, number for distance
        if(A.x + A.w < B.x || epsilonEquals(A.x + A.w, B.x)) {
            if(A.vx <= 0) {
                return false;
            }
            return B.x + Bx - A.x - A.w;
        }
        if(A.x > B.x + B.w || epsilonEquals(A.x, B.x + B.w)) {
            if(A.vx >= 0) {
                return false;
            }
            return B.x + Bx + B.w - A.x;
        }
        return true;
    }
    getYTranslationDistance(A, B, By) { // see above
        if(A.y + A.h < B.y || epsilonEquals(A.y + A.h, B.y)) {
            if(A.vy <= 0) {
                return false;
            }
            return B.y + By - A.y - A.h;
        }
        if(A.y > B.y + B.h || epsilonEquals(A.y, B.y + B.h)) {
            if(A.vy >= 0) {
                return false;
            }
            return B.y + By + B.h - A.y;
        }
        return true;
    }
    getCollisionPoint(A, B, considerBTranslation, BXTranslation = 0, BYTranslation = 0) { // false for never collides, number for distance
        let Bx = B.x;
        let By = B.y;
        if(considerBTranslation) {
            Bx += BXTranslation;
            By += BYTranslation;
        }
        const xDist = this.getXTranslationDistance(A, B, BXTranslation);
        const yDist = this.getYTranslationDistance(A, B, BYTranslation);
        if(xDist === true) {
            if(yDist === true) {
                console.log(A);
                console.log(B);
                throw "uhhh these blocks are inside of each other??? ERROR";
            }
            if(yDist === false) { return false; }
            return yDist / A.vy;
        }
        if(yDist === true) {
            if(xDist === false) { return false; }
            return xDist / A.vx;
        }
        if(xDist !== false && yDist !== false) {
            const tyDist = A.vy * xDist / A.vx;
            if(A.y + tyDist <= By + B.h && A.y + tyDist + A.h >= By) {
                return xDist / A.vx;
            }
            const txDist = A.vx * yDist / A.vy;
            if(A.x + txDist <= Bx + B.w && A.x + txDist + A.w >= Bx) {
                return yDist / A.vy;
            }
        }
        return false;
    }
    preliminaryCollisionAdjustment(A) {
        let translation = A.translation;
        for(let j = 0; j < this.blocks.length; j++) {
            const B = this.blocks[j];
            if(A !== B) {
                let collisionPoint = this.getCollisionPoint(A, B, false);
                if(B.moves && B.translation != 0 && (B.vx != 0 || B.vy != 0)) {
                    const minCollisionPoint = this.getCollisionPoint(A, B, true, B.vx * B.translation, B.vy * B.translation);
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
        if(A.vx < 0 && this.minX - A.x > translation * A.vx) {
            translation = (this.minX - A.x) / A.vx;
        } else if(A.vx > 0 && this.maxX - A.x - A.w < translation * A.vx) {
            translation = (this.maxX - A.x - A.w) / A.vx;
        }
        if(A.vy < 0 && this.minY - A.y > translation * A.vy) {
            translation = (this.minY - A.y) / A.vy; 
        } else if(A.vy > 0 && this.maxY - A.y - A.h < translation * A.vy) {
            translation = (this.maxY - A.y - A.h) / A.vy;
        }
        if(translation < 0) {
            translation = 0;
        }
        A.x += translation * A.vx;
        A.y += translation * A.vy;
        this.updatePose(A.x, A.y, A.element);
        A.translation = 0;
    }
    updateTouching(A, i, B, v, mo, bool) {
        if(A.touchable && B.touchesOthers) {
            if(A.moves && A[mo]) {
                B.touching[i].push(A);
            } else {
                B.touchingStatic[i] = true;
                if(bool && B[mo] && B.moves) {
                    B[v] = 0;
                }
            }
        }
    }
    isMatching(value, i) {
        return value != 0 && (value < 0) == (i % 2 == 0);
    }
    getMinVelocities(starter, i, horizontal) {
        if(starter.minVelocities[i] !== null) {
            return;
        }
        if(starter.touchingStatic[i]) {
            starter.minVelocities[i] = 0;
            return;
        }
        let minimum = Number.POSITIVE_INFINITY;
        for(const connection of starter.touching[i]) {
            this.getMinVelocities(connection, i);
            if(connection.minVelocities[i] < minimum) {
                minimum = connection.minVelocities[i];
            }
        }
        const receives = horizontal ? starter.receivesMomentumX : starter.receivesMomentumY;
        if(!receives) {
            const velocity = horizontal ? starter.vx : starter.vy;
            const multiplier = (i % 2 == 0) ? -1 : 1;
            if(velocity * multiplier < minimum) {
                minimum = velocity * multiplier;
            }
        }
        starter.minVelocities[i] = minimum;
    }
    chainMomentum(starter, i, horizontal, momentumInfo, totalMass, totalMomentum, starting) {
        const multiplier = (i % 2 == 0) ? -1 : 1;
        const adding = (horizontal ? starter.vx : starter.vy) * starter.m;
        let theoreticalVelocity = multiplier * (totalMomentum + adding) / (totalMass + starter.m);
        if(starter.minVelocities[i] < theoreticalVelocity) {
            theoreticalVelocity = starter.minVelocities[i];
        }
        for(const connection of starter.touching[i]) {
            let nextMoment = horizontal ? connection.vx : connection.vy;
            nextMoment *= multiplier;
            if(connection.minVelocities[i] < nextMoment) {
                nextMoment = connection.minVelocities[i];
            }
            if(!epsilonEquals(theoreticalVelocity, nextMoment) || theoreticalVelocity > nextMoment) {
                this.chainMomentum(connection, i, horizontal, momentumInfo, totalMass + starter.m, totalMomentum + adding, false);
            } else {

            }
        }
    }
    handleMomentum(starter, i, relevantMarking, relevantVelocity, horizontal, starters) {
        if(starter[relevantMarking]) {
            let momentumInfo = {
                total: 0,
                totalMass: 0,
                connected: []
            };
            this.reportTemporaryStatic(starter, i); // load all static counters
            this.chainMomentum(starter, momentumInfo, i, horizontal, 0, 0, starters);
            const settingVelocity = starter.temporaryStaticCounter ? 0 : momentumInfo.total / momentumInfo.totalMass;
            if(starter.temporaryStaticCounter || (momentumInfo.connected.length > 1 && (momentumInfo.total == 0 || (momentumInfo.total < 0) == (i % 2 == 0)))) {
                for(const connected of momentumInfo.connected) {
                    connected[relevantVelocity] = settingVelocity;
                    connected[relevantMarking] = false;
                    if(connected.temporaryStaticCounter) {
                        delete connected.temporaryStaticCounter;
                    }
                }
            }
        }
    }
    onEdge(A, side, pos, dim, v, otherV, _escape, boo) {
        A.touchingStatic[side] = true;
        if(boo) {
            if(A === this.player && this.leavingTo === null) {
                for(const escape of this.escapes[side]) {
                    if(pos >= escape.lowerBound && pos + dim <= escape.upperBound) {
                        this.escapingSide = side;
                        escape.to.escapingSide = side;
                        this.leavingTo = escape;
                        A[v] = _escape;
                        A[otherV] = 0;
                        cover.style.display = "block";
                        return;
                    }
                }
            }
            A[v] = 0;
        }
    }
    updateCollisions(dt) {
        for(const block of this.blocks) {
            if(block.touchesOthers) {
                block.touching = [[], [], [], []]; // left, up, down, right (other block is on the left, other block is above, etc.)
                block.touchingStatic = [false, false, false, false];
                block.minVelocities = [null, null, null, null];
            }
            if(block.moves) {
                if(block.receivesMomentumX || block.receivesMomentumY) {
                    block.markedX = true; // used as placeholder, will be set to true
                    block.markedY = true;
                }
                let ratio = 1;
                const absX = Math.abs(block.vx);
                const absY = Math.abs(block.vy);
                if(absX > absY) {
                    ratio = maximumReasonableTranslation / (absX * dt);
                } else {
                    ratio = maximumReasonableTranslation / (absY * dt);
                }
                block.translation = 0.01;
                if(ratio < 1) {
                    console.log("L + Ratio");
                    console.log(absX);
                    console.log(absY);
                    console.log(dt);
                    block.translation *= ratio;
                }
            }
        }
        for(const A of this.blocks) {
            if(A.moves) {
                if(A.translation != 0 && (A.vx != 0 || A.vy != 0)) {
                    if(A === this.player && this.leavingTo !== null) {
                        const name = this.escapingSide == 0 || this.escapingSide == 3 ? "x" : "y";
                        A[name] += escapeVelocity * dt * ((this.escapingSide % 2 == 0) ? -1 : 1);
                        this.updatePose(A.x, A.y, A.element);
                        let diff = 0;
                        if(this.escapingSide % 2 == 0) {
                            if(this.leavingTo == 1) {
                                diff = A[name] - this[bounds[3 - this.escapingSide]] + 5;
                            } else {
                                diff = A[name] - this[bounds[this.escapingSide]] + 10;
                            }
                        } else {
                            if(this.leavingTo == 1) {
                                diff = this[bounds[3 - this.escapingSide]] - A[name];
                            } else {
                                diff = this[bounds[this.escapingSide]] + 5 - A[name];
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
        if(this.leavingTo !== null) {
            this.player.markedX = true;
        }
        for(const A of this.blocks) {
            if(A.moves && (A !== this.player || this.leavingTo === null)) {
                A.vx += A.ax * dt;
                const xSign = Math.sign(A.vx);
                if(A.vx * xSign > maximumVelocity) {
                    A.vx = maximumVelocity * xSign;
                }
                A.vy += A.ay * dt;
                const ySign = Math.sign(A.vy);
                if(A.vy * ySign > maximumVelocity) {
                    A.vy = maximumVelocity * ySign;
                }
            
                if(epsilonEquals(A.y, this.minY)) {
                    this.onEdge(A, 2, A.x, A.w, "vy", "vx", -escapeVelocity, A.vy < 0);
                } else if(epsilonEquals(A.y + A.h, this.maxY)) {
                    this.onEdge(A, 1, A.x, A.w, "vy", "vx", escapeVelocity, A.vy > 0);
                }
                if(epsilonEquals(A.x, this.minX)) {
                    this.onEdge(A, 0, A.y, A.h, "vx", "vy", -escapeVelocity, A.vx < 0);
                } else if(epsilonEquals(A.x + A.w, this.maxX)) {
                    this.onEdge(A, 3, A.y, A.h, "vx", "vy", escapeVelocity, A.vx > 0);
                }
            }
        }
        for(let i = 0; i < this.blocks.length; i++) {
            const A = this.blocks[i];
            if(A !== this.player || this.leavingTo === null) {
                if(A.touchable || A.touchesOthers) {
                    for(let j = i + 1; j < this.blocks.length; j++) {
                        const B = this.blocks[j];
                        if((B.touchable && A.touchesOthers) || (A.touchable && B.touchesOthers)) {
                            const rightAbove = epsilonEquals(A.y, B.y + B.h);
                            const rightBelow = epsilonEquals(A.y + A.h, B.y);
                            const onTheRight = epsilonEquals(A.x, B.x + B.w);
                            const onTheLeft = epsilonEquals(A.x + A.w, B.x);
                            let skip = false;
                            if(A.touchable && B.touchable) {
                                if(A.moves && A.touchesOthers && ((rightAbove && A.vy < 0) || (rightBelow && A.vy > 0)) && ((onTheRight && A.vx < 0) || (onTheLeft && A.vx > 0))) {
                                    if(A.receivesMomentumX) {
                                        A.vx = 0;
                                    }
                                    if(A.receivesMomentumY) {
                                        A.vy = 0;
                                    }
                                    skip = true;
                                }
                                if(B.moves && B.touchesOthers && ((rightAbove && B.vy > 0) || (rightBelow && B.vy < 0)) && ((onTheRight && B.vx > 0) || (onTheLeft && B.vx < 0))) {
                                    if(B.receivesMomentumX) {
                                        B.vx = 0;
                                    }
                                    if(B.receivesMomentumY) {
                                        B.vy = true;
                                    }
                                    skip = true;
                                }
                            } 
                            if(!skip) {
                                if(this.getXTranslationDistance(A, B, B.x) === true) {
                                    if(rightAbove) {
                                        this.updateTouching(A, 1, B, 'vy', 'receivesMomentumY', B.vy > 0);
                                        this.updateTouching(B, 2, A, 'vy', 'receivesMomentumY', A.vy < 0);
                                    } else if(rightBelow) {
                                        this.updateTouching(A, 2, B, 'vy', 'receivesMomentumY', B.vy < 0);
                                        this.updateTouching(B, 1, A, 'vy', 'receivesMomentumY', A.vy > 0);
                                    }
                                } else if(this.getYTranslationDistance(A, B, B.y) === true) {
                                    if(onTheRight) {
                                        this.updateTouching(A, 3, B, 'vx', 'receivesMomentumX', B.vx > 0);
                                        this.updateTouching(B, 0, A, 'vx', 'receivesMomentumX', A.vx < 0);
                                    } else if(onTheLeft) {
                                        this.updateTouching(A, 0, B, 'vx', 'receivesMomentumX', B.vx < 0);
                                        this.updateTouching(B, 3, A, 'vx', 'receivesMomentumX', A.vx > 0);
                                    }
                                }
                            }
                        }
                    }
                }
                if(A.touchesOthers && A.moves) {
                    for(let i = 0; i < 4; i++) {
                        const horizontal = i == 0 || i == 3;
                        const relevantVelocity = horizontal ? "vx" : "vy";
                        if(A.touching[i].length > 0 && this.isMatching(A[relevantVelocity], i)) {
                            let broken = false;
                            for(const otherTouching of A.touching[3 - i]) {
                                if(this.isMatching(otherTouching[relevantVelocity], i)) {
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
            const horizontal = i == 0 || i == 3;
            const relevantVelocity = horizontal ? "vx" : "vy";
            const relevantMarking = horizontal ? "markedX" : "markedY";
            for(let j = 0; j < starters[i].length; j++) {
                this.handleMomentum(starters[i][j], i, relevantMarking, relevantVelocity, horizontal, starters);
            }
        }
        
    }
    unload(game) {
        this.element.removeChild(this.player.element);
        game.removeChild(this.element);
    }
}
export default Level;