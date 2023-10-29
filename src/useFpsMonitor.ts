import { FPSMonitor } from "./fpsMonitor";
import { useState, useEffect, useRef } from "react";


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
  customLODs = defaultLODs,
  updateInterval = 1000,
  minFpsThreshold = 30,
}: DynamicRenderingProps = {
  customLODs: defaultLODs,
  updateInterval: 1000,
  minFpsThreshold: 30,
}) {

  const [levelOfDetail, setLOD] = useState('');
  const currLodIndexRef = useRef(-1);

  const resetLOD = () => {
    currLodIndexRef.current = -1;
  };

  useEffect(() => {
    const possibleLODs = customLODs;

    const packageClass = new FPSMonitor();
    (window as any).pc = packageClass;

    const checkFPS = () => {
      const fps = packageClass.getFPS();
      if (fps < minFpsThreshold) {
        currLodIndexRef.current = Math.min(possibleLODs.length - 1, currLodIndexRef.current + 1);
        setLOD(possibleLODs[currLodIndexRef.current]);
      }
    };

    const fpsCheckInterval = setInterval(checkFPS, updateInterval ?? 1000);

    return () => {
      clearInterval(fpsCheckInterval);
    };
  }, []);

  return {
    levelOfDetail,
    resetLOD
  };
}
