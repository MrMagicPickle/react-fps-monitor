export class FPSMonitor {
  private fps: number = 60;
  private frameCount: number = 0;
  private lastTimestamp: number | undefined = undefined;

  constructor() {
    this.initCalculateFPS();
  }

  private initCalculateFPS() {
    const updateFPS = (timestamp: number) => {
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
    }
    requestAnimationFrame(updateFPS);
  }

  public resetFpsMonitor() {
    this.lastTimestamp = undefined;
    this.frameCount = 0;
  }

  public getFPS() {
    return this.fps;
  }
}
