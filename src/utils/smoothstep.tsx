/**
 * Smoothstep function returning a smooth value between 0 and 1. Inputs can be in any range
 * @param x - The input value
 * @param minVal - The minimum value of the range (default: 0)
 * @param maxVal - The maximum value of the range (default: 1)
 * @param steepness - The steepness of the curve (default: 0.5)
 * @returns The interpolated value between 0 and 1
 */
export function smoothstep({x, minVal = 0, maxVal = 1, steepness= 0.5}: {
    x: number, minVal?: number, maxVal?: number, steepness?: number}) {

    /**
     * Internal smoothstep function to calculate the interpolation
     * @param x - The input value
     * @param steepness - The steepness of the curve
     * @returns The interpolated value
     */
    function smoothstepFunc(x: number, steepness: number) {
        const power = (2 / (1-steepness)) - 1
        const halfGraph = (x: number) => { return x**power / 0.5**(power-1); }
    
        if (x <= 0.5) { return halfGraph(x); }
        else { return 1-halfGraph(1-x); }
    }
    // Clamp x to 0-1 range by normalising
    x = Math.max(0, Math.min((x - minVal) / (maxVal - minVal), 1));

    // Evaluate polynomial to return smoothstep function
    return smoothstepFunc(x, steepness);
}