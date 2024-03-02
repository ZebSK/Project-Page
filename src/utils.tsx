// General file for utility functions... will probably expand out later
export function smoothstep(minVal: number, maxVal: number, x: number, steepness: number = 0.5) {
    // Clamp x in 0-1 range by normalisation
    x = Math.max(0, Math.min((x - minVal) / (maxVal - minVal), 1));

    // Evaluate polynomial to return smoothstep function
    return smoothstepFunc(x, steepness);
}

function smoothstepFunc(x: number, steepness: number) {
    const power = (2 / (1-steepness)) - 1
    const halfGraph = (x: number) => { return x**power / 0.5**(power-1); }

    if (x <= 0.5) { return halfGraph(x); }
    else { return 1-halfGraph(1-x); }
}