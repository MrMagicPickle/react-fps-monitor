import { FPSMonitor } from "./fpsMonitor";
import { useState, useEffect } from "react";

export interface FPSMonitorConfig {
  threshold: number;
  levelOfDetailKey: string;
}

export default function useDynamicRendering() {
  const [levelOfDetail, setLOD] = useState('');

  /**
   * Default states
   */
  // const defaultConfig = [
  //   {
  //     threshold: 45,
  //     levelOfDetailKey: "medium",
  //   },
  //   {
  //     threshold: 30,
  //     levelOfDetailKey: "low",
  //   }
  // ];


  useEffect(() => {
    let defaultConfig: Record<number, string> = {
      45: 'medium',
      30: 'low',
    };


    const packageClass = new FPSMonitor();
    (window as any).pc = packageClass;
    const findLOD = (fps: number) => {
      const thresholds = Object.keys(defaultConfig).map(Number);
      // handle case where fps is higher than all thresholds.
      if (Math.max(...thresholds) < fps) {
        return undefined;
      }

      // get the smallest diff threshold that is greater than the fps
      const threshold = thresholds.reduce((acc, threshold) => {
        const diff = fps - threshold;
        console.log(diff, '<< diff');
        if (diff <= 0 &&
          Math.abs(diff) < Math.abs(fps - acc) // select lowest absolute diff
        ) {
          return threshold;
        }
        return acc;
      }, thresholds[0]);

      return defaultConfig[threshold];
    };

    const checkFPS = () => {
      const fps = packageClass.getFPS(); // Replace with your actual method
      console.log(fps, '<< fps');
      const desiredLod = findLOD(fps);
      if (!desiredLod) {
        return;
      }
      setLOD(desiredLod);
    };

    const fpsCheckInterval = setInterval(checkFPS, 1000);

    return () => {
      console.log('did this get called?');
      clearInterval(fpsCheckInterval);
    };
  }, []);

  return levelOfDetail;
}
