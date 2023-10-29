export interface FPSUpdatedEvent extends Event {
  detail: FPSUpdatedEventDetail
};

export interface FPSUpdatedEventDetail {
  fpsCount: number;
}

const DEBUG = true;
export class FPSMonitor {
  private fps: number;
  public maxFPS: number;
  private eventListener: EventListener | undefined;

  constructor() {
    this.fps = 60;
    this.maxFPS = 100;
    this.initCalculateFPS();
  }

  setMaxFps(fps: number) {
    this.maxFPS = fps;
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
        this.fps =
          Math.min(
            Number((frameCount / (elapsed / 1000)).toFixed(2)),
            this.maxFPS
          );
        frameCount = 0;
        lastTimestamp = timestamp;
      }

      requestAnimationFrame(updateFPS);
    }
    requestAnimationFrame(updateFPS);
  }

  public onFPSCalculated(eventHandlerCb: (fpsCount: number) => void) {
    this.eventListener = (e) => {
      eventHandlerCb((e as FPSUpdatedEvent).detail.fpsCount);
    };
    document.addEventListener('FPSUpdated', this.eventListener);
  }


  public getFPS() {
    return this.fps;
  }

  public destroy() {
    if (!this.eventListener) {
      return;
    }
    console.log('Removing event listener', this.eventListener);
    document.removeEventListener('FPSUpdated', this.eventListener);
  }

  /*
   * -----------------------------------------------
   * V1 - manual trigger.
   * -----------------------------------------------
   */
  /*
   * @param timeWindow - duration in ms to measure FPS before emitting event.
   */
  public calculateFPS(timeWindow: number = 5000) {
    let lastTimestamp: number;
    let frameCount = 0;
    let startTime = performance.now();

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

      // Your rendering logic here
      let endTime = performance.now();

      // if time window is not reached, continue to render
      const diff = endTime - startTime;
      if (diff < timeWindow) {
        requestAnimationFrame(updateFPS);
      } else {
        this.emitFPSUpdatedEvent();
      }
    }
    requestAnimationFrame(updateFPS);
  }

  private emitFPSUpdatedEvent() {
    const event = new CustomEvent<FPSUpdatedEventDetail>('FPSUpdated', {
      detail: {
        fpsCount: this.fps
      }
    });
    console.log('Emitting event', event);
    document.dispatchEvent(event);
  }

}
