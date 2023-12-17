"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fpsMonitor_1 = require("./fpsMonitor");
const react_1 = require("react");
const defaultLODs = [
    'high',
    'low',
];
function useFpsMonitor({ levelOfDetails = defaultLODs, updateInterval = 1000, minFpsThreshold = 30, } = {
    levelOfDetails: defaultLODs,
    updateInterval: 1000,
    minFpsThreshold: 30,
}) {
    const [levelOfDetail, setLOD] = (0, react_1.useState)(defaultLODs[0]);
    const currLodIndexRef = (0, react_1.useRef)(0);
    const resetLOD = () => {
        currLodIndexRef.current = 0;
        setLOD(levelOfDetails[currLodIndexRef.current]);
    };
    (0, react_1.useEffect)(() => {
        const packageClass = new fpsMonitor_1.FPSMonitor();
        /* Handle Tab outs */
        const handleVisibilityChange = () => {
            if (!packageClass) {
                return;
            }
            if (document.hidden) {
                packageClass.resetFpsMonitor();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        const checkFPS = () => {
            const fps = packageClass.getFPS();
            if (fps < minFpsThreshold) {
                currLodIndexRef.current = Math.min(levelOfDetails.length - 1, currLodIndexRef.current + 1);
                setLOD(levelOfDetails[currLodIndexRef.current]);
            }
        };
        const fpsCheckInterval = setInterval(checkFPS, updateInterval !== null && updateInterval !== void 0 ? updateInterval : 1000);
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
exports.default = useFpsMonitor;
