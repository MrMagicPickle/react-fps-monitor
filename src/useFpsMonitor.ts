import { FPSMonitor } from "./fpsMonitor";
import { useState, useEffect } from "react";


export interface DynamicRenderingProps {
  customLODs?: string[];
  updateInterval: number;
  minFpsThreshold: number;
}
const defaultLODs = [
  'high',
  'medium',
  'low',
];
export default function useDynamicRendering({
  customLODs,
  updateInterval,
  minFpsThreshold,
}: DynamicRenderingProps = {
  customLODs: defaultLODs,
  updateInterval: 1000,
  minFpsThreshold: 30,
}) {

  const [levelOfDetail, setLOD] = useState('');


  useEffect(() => {
    let currLodIndex: number = -1;


    const possibleLODs = customLODs ?? defaultLODs;

    const packageClass = new FPSMonitor();
    (window as any).pc = packageClass;

    const checkFPS = () => {
      const fps = packageClass.getFPS(); // Replace with your actual method
      if (fps < minFpsThreshold) {
        currLodIndex = Math.min(possibleLODs.length - 1, currLodIndex + 1);
      }
      setLOD(possibleLODs[currLodIndex]);
    };

    const fpsCheckInterval = setInterval(checkFPS, updateInterval ?? 1000);

    return () => {
      clearInterval(fpsCheckInterval);
    };
  }, []);

  return levelOfDetail;
}
