export class FPSMonitor {
  private fps: number;

  constructor() {
    this.fps = 60;
    this.initCalculateFPS();
  }

  private initCalculateFPS() {
    let lastTimestamp: number;
    let frameCount = 0;

    const updateFPS = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const elapsed = timestamp - lastTimestamp;
      frameCount++;

      // Update FPS every second
      if (elapsed >= 1000) {
        this.fps = Number((frameCount / (elapsed / 1000)).toFixed(2));
        frameCount = 0;
        lastTimestamp = timestamp;
      }
      requestAnimationFrame(updateFPS);
    }
    requestAnimationFrame(updateFPS);
  }

  public getFPS() {
    return this.fps;
  }
}
