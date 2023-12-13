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
  const [levelOfDetail, setLOD] = useState(defaultLODs[0]);
  const currLodIndexRef = useRef(0);

  const resetLOD = () => {
    currLodIndexRef.current = 0;
    setLOD(levelOfDetails[currLodIndexRef.current]);
  };

  useEffect(() => {
    const packageClass = new FPSMonitor();

    /* Handle Tab outs */
    const handleVisibilityChange = () => {
      if (!packageClass) {
        return;
      }

      if (document.hidden) {
        packageClass.resetFpsMonitor();
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    levelOfDetail,
    resetLOD
  };
}
