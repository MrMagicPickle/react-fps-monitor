export interface FPSMonitorProps {
    levelOfDetails?: string[];
    updateInterval: number;
    minFpsThreshold: number;
}
export default function useFpsMonitor({ levelOfDetails, updateInterval, minFpsThreshold, }?: FPSMonitorProps): {
    levelOfDetail: string;
    resetLOD: () => void;
};
