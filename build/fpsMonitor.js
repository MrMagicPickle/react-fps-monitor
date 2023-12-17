"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FPSMonitor = void 0;
class FPSMonitor {
    constructor() {
        this.fps = 60;
        this.frameCount = 0;
        this.lastTimestamp = undefined;
        this.initCalculateFPS();
    }
    initCalculateFPS() {
        const updateFPS = (timestamp) => {
            if (!this.lastTimestamp) {
                this.lastTimestamp = timestamp;
            }
            const elapsed = timestamp - this.lastTimestamp;
            this.frameCount++;
            // Update FPS every second
            if (elapsed >= 1000) {
                this.fps = Number((this.frameCount / (elapsed / 1000)).toFixed(2));
                this.frameCount = 0;
                this.lastTimestamp = timestamp;
            }
            requestAnimationFrame(updateFPS);
        };
        requestAnimationFrame(updateFPS);
    }
    resetFpsMonitor() {
        this.lastTimestamp = undefined;
        this.frameCount = 0;
    }
    getFPS() {
        return this.fps;
    }
}
exports.FPSMonitor = FPSMonitor;
