import seedrandom from 'seedrandom';

interface SimulateGBMParams {
    S0: number;
    mu: number;
    sigma: number;
    minutes: number;
    seed: string;
}

export function simulateGBM({ S0, mu, sigma, minutes, seed }: SimulateGBMParams): Float32Array {
    const rng = seedrandom(seed);
    const dt = 1 / (252 * 24 * 60); // Time step per minute, assuming 252 trading days
    const path = new Float32Array(minutes);
    path[0] = S0;

    for (let i = 1; i < minutes; i++) {
        const Z = Math.sqrt(-2.0 * Math.log(rng())) * Math.cos(2.0 * Math.PI * rng()); // Box-Muller transform
        const dS = path[i - 1] * (mu * dt + sigma * Z * Math.sqrt(dt));
        path[i] = path[i - 1] + dS;
    }

    return path;
}
