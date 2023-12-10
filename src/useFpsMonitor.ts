import { FPSMonitor } from "./fpsMonitor";
import { useState, useEffect, useRef } from "react";


export interface FPSMonitorProps {
  levelOfDetails?: string[];
  updateInterval: number;
  minFpsThreshold: number;
}

const defaultLODs = [
  'high',
  'low',
];

export default function useFpsMonitor({
  levelOfDetails = defaultLODs,
  updateInterval = 1000,
  minFpsThreshold = 30,
}: FPSMonitorProps = {
  levelOfDetails: defaultLODs,
  updateInterval: 1000,
  minFpsThreshold: 30,
}) {

  const [levelOfDetail, setLOD] = useState('');
  const currLodIndexRef = useRef(0);

  const resetLOD = () => {
    currLodIndexRef.current = 0;
    setLOD(levelOfDetails[currLodIndexRef.current]);
  };

  useEffect(() => {
    const packageClass = new FPSMonitor();

    const checkFPS = () => {
      const fps = packageClass.getFPS();

      if (fps < minFpsThreshold) {
        currLodIndexRef.current = Math.min(levelOfDetails.length - 1, currLodIndexRef.current + 1);
        setLOD(levelOfDetails[currLodIndexRef.current]);
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
