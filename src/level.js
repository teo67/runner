import MovingBlock from './movingBlock.js';
import epsilonEquals from './epsilonEquals.js';
const maximumReasonableTranslation = 2;
const maximumVelocity = 40;
class Level {
    constructor(blocks, player) {
        this.player = player;
        this.blocks = blocks;
        this.blocks.push(player);
        this.movingBlocks = [];
        for(const block of this.blocks) {
            if(block instanceof MovingBlock) {
                this.movingBlocks.push(block);
            }
        }
        this.resetElement();
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.alreadyLoaded = false;
    }
    resetElement() {
        this.element = document.createElement("div");
        this.element.classList.add("level");
    }
    load(game) {
        if(!this.alreadyLoaded) {
            this.minX = 0;
            this.minY = 0;
            this.maxX = this.player.w;
            this.maxY = this.player.h;
        }
        for(const block of this.blocks) {
            block.initialize(this, this.player);
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
            this.element.style.width = `${this.maxX - this.minX}vw`;
            this.element.style.height = `${this.maxY - this.minY}vw`;
            this.alreadyLoaded = true;
        }
        this.player.x = 0;
        this.player.y = 0;
        this.updateView();
        for(const block of this.blocks) {
            this.updatePose(block.x, block.y, block.element);
        }
        game.appendChild(this.element);
    }
    update(dt) {
        for(const block of this.blocks) {
            if(block.updates) {
                block.update(dt);
            }
        }
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
                if(B instanceof MovingBlock && B.translation != 0 && (B.vx != 0 || B.vy != 0)) {
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
        if(translation < 0) {
            translation = 0;
        }
        A.x += translation * A.vx;
        A.y += translation * A.vy;
        this.updatePose(A.x, A.y, A.element);
        A.translation = 0;
    }
    updateTouching(A, i, B, isMoving) {
        if(isMoving) {
            A.touching[i].push(B);
            B.touching[3 - i].push(A);
        } else {
            A.touchingStatic[i] = true;
        }
    }
    isMatching(value, i) {
        return value != 0 && (value < 0) == (i % 2 == 0);
    }
    chainMomentum(starter, info, i, horizontal, total, starters) {
        info.connected.push(starter);
        info.totalMass += starter.m;
        const savedMass = info.totalMass;
        const adding = (horizontal ? starter.vx : starter.vy) * starter.m;
        info.total += adding;
        for(const connection of starter.touching[i]) {
            const nextMoment = horizontal ? connection.vx : connection.vy;
            const diff = (total + adding)/savedMass - nextMoment;
            if(epsilonEquals(diff, 0) || this.isMatching(diff, i)) {
                this.chainMomentum(connection, info, i, horizontal, total + adding, starters);
            }
        }
        if(starter.touchingStatic[i]) {
            info.static = true;
        }
    }
    handleMomentum(starter, i, relevantMarking, relevantVelocity, horizontal, starters) {
        if(starter[relevantMarking]) {
            let momentumInfo = {
                total: 0,
                totalMass: 0,
                connected: [], 
                static: false
            };
            this.chainMomentum(starter, momentumInfo, i, horizontal, 0, starters);
            if(momentumInfo.connected.length > 1 && (momentumInfo.total == 0 || (momentumInfo.total < 0) == (i % 2 == 0))) {
                const settingVelocity = momentumInfo.static ? 0 : (momentumInfo.total / momentumInfo.totalMass);
                for(const item of momentumInfo.connected) {
                    item[relevantVelocity] = settingVelocity;
                    item[relevantMarking] = false;
                }
            }
        }
    }
    updateCollisions(dt) {
        
        for(let i = 0; i < this.movingBlocks.length; i++) {
            this.movingBlocks[i].markedX = false; // used as placeholder, will be set to true
            this.movingBlocks[i].markedY = true;
            this.movingBlocks[i].touching = [[], [], [], []]; // left, up, down, right (other block is on the left, other block is above, etc.)
            this.movingBlocks[i].touchingStatic = [false, false, false, false];

            let ratio = 1;
            const absX = Math.abs(this.movingBlocks[i].vx);
            const absY = Math.abs(this.movingBlocks[i].vy);
            if(absX > absY) {
                ratio = maximumReasonableTranslation / (absX * dt);
            } else {
                ratio = maximumReasonableTranslation / (absY * dt);
            }
            this.movingBlocks[i].translation = dt;
            if(ratio < 1) {
                console.log("L + Ratio");
                console.log(absX);
                console.log(absY);
                console.log(dt);
                this.movingBlocks[i].translation *= ratio;
            }
        }
        for(let i = 0; i < this.movingBlocks.length; i++) {
            const A = this.movingBlocks[i];
            if(A.translation != 0 && (A.vx != 0 || A.vy != 0)) {
                this.preliminaryCollisionAdjustment(A);
            }
        }
        
        const starters = [[], [], [], []];
        for(let i = 0; i < this.movingBlocks.length; i++) {
            const A = this.movingBlocks[i];
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
            for(let j = 0; j < this.blocks.length; j++) {
                const B = this.blocks[j];
                const isMoving = B instanceof MovingBlock;
                if(!B.markedX) {
                    if(this.getXTranslationDistance(A, B, B.x) === true) {
                        if(epsilonEquals(A.y, B.y + B.h)) {
                            this.updateTouching(A, 2, B, isMoving);
                            if(!isMoving && A.vy < 0) {
                                A.vy = 0;
                            }
                        } else if(epsilonEquals(A.y + A.h, B.y)) {
                            this.updateTouching(A, 1, B, isMoving);
                            if(!isMoving && A.vy > 0) {
                                A.vy = 0;
                            }
                        }
                    } else if(this.getYTranslationDistance(A, B, B.y) === true) {
                        if(epsilonEquals(A.x, B.x + B.w)) {
                            this.updateTouching(A, 0, B, isMoving);
                            if(!isMoving && A.vx < 0) {
                                A.vx = 0;
                            }
                        } else if(epsilonEquals(A.x + A.w, B.x)) {
                            this.updateTouching(A, 3, B, isMoving);
                            if(!isMoving && A.vx > 0) {
                                A.vx = 0;
                            }
                        }
                    }
                }
            }
            
            A.markedX = true;
            for(let i = 0; i < 4; i++) {
                const horizontal = i == 0 || i == 3;
                const relevantVelocity = horizontal ? "vx" : "vy";
                if(A.touching[i].length > 0 && this.isMatching(A[relevantVelocity], i)) {
                    let broken = false;
                    for(const otherTouching of A.touching[3 - i]) {
                        if(!this.isMatching(A[relevantVelocity] - otherTouching[relevantVelocity], i)) {
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
        game.removeChild(this.element);
        this.element.remove();
        this.resetElement();
    }
}
export default Level;