interface ComputeServerTickIndexParams {
    startTime: Date;
    now: Date;
    simDays: number;
    durationSec: number;
}

export function computeServerTickIndex({ startTime, now, simDays, durationSec }: ComputeServerTickIndexParams): number {
    const elapsedMs = now.getTime() - startTime.getTime();
    const totalTicks = simDays * 1440;
    
    if (elapsedMs <= 0) return 0;
    if (elapsedMs >= durationSec * 1000) return totalTicks - 1;

    const serverTickIndex = Math.floor((elapsedMs / (durationSec * 1000)) * totalTicks);
    
    return Math.max(0, Math.min(serverTickIndex, totalTicks - 1));
}
