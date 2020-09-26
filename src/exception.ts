export function buildRunningTimeError(msg: string, ...args: any[]): Error {
    const e = new Error(`<LightingRunningTime> ${msg}`);
    console.error(...args);
    return e;
}
