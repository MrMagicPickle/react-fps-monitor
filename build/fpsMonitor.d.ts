export declare class FPSMonitor {
    private fps;
    private frameCount;
    private lastTimestamp;
    constructor();
    private initCalculateFPS;
    resetFpsMonitor(): void;
    getFPS(): number;
}
