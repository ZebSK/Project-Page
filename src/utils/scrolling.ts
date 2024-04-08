/**
 * @file scrolling.ts
 * 
 * @description
 * Utility functions related to scrolling elements
 * 
 * @exports scrollToBottom - Function to scroll to the bottom of an element
 */

// Internal Modules
import { DivRefObject } from "../types/aliases";



/**
 * Function to scroll to the bottom of an element
 * @param elementRef - The React element to scroll to the bottom of
 * @param smooth - Whether the scroll is gradual or instant
 */
export function scrollToBottom(elementRef: DivRefObject, smooth: boolean = false) {
  // Access the current value of the Ref
  const element = elementRef.current;
  if (!element) { return; }

  const start = element.scrollTop; // Distance from top of visible section to top of element
  const end = element.scrollHeight - element.clientHeight; // Total height of object minus visible height

  if (!smooth) { element.scrollTop = end; }
  else { smoothScroll(start, end, element); }
};

/**
 * Function handling the smooth scroll animation
 * @param start - The starting position of the scroll
 * @param end - The ending position of the scroll
 * @param element - The current value of the React element to scroll
 */
function smoothScroll(start: number, end: number, element: HTMLDivElement){
  const duration = 1000; // ms
  const steepness = 0.6;  // 0-1, realistically should be between 0.5-0.7ish
  let startTime: number | null = null;

  /**
   * Function handling each animation frame of the smooth scroll
   * @param timestamp - The time that the function is called in ms
   */
  function smoothScrollAnimation(timestamp: number) {
    if (!startTime) {startTime = timestamp;} // Defines the start time on the first frame

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed/duration, 1);
    const scrollTop = smoothstep({x: progress, steepness: steepness}) * (end - start) + start;
    element.scrollTop = scrollTop;

    // Calls the smoothScrollAnimation function repeatedly until scrolled to bottom
    if (progress < 1) { requestAnimationFrame(smoothScrollAnimation); }
  }
  requestAnimationFrame(smoothScrollAnimation);
}

/**
 * Smoothstep function returning a smooth value between 0 and 1. Inputs can be in any range
 * @param x - The input value
 * @param minVal - The minimum value of the range (default: 0)
 * @param maxVal - The maximum value of the range (default: 1)
 * @param steepness - The steepness of the curve (default: 0.5)
 * @returns The interpolated value between 0 and 1
 */
function smoothstep({x, minVal = 0, maxVal = 1, steepness= 0.5}: {
  x: number, minVal?: number, maxVal?: number, steepness?: number}) {

  /**
   * Internal smoothstep function to calculate the interpolation
   * @param x - The input value
   * @param steepness - The steepness of the curve
   * @returns The interpolated value
   */
  function smoothstepFunc(x: number, steepness: number) {
    const power = (2 / (1-steepness)) - 1;
    const halfGraph = (x: number) => { return x**power / 0.5**(power-1); }

    if (x <= 0.5) { return halfGraph(x); }
    else { return 1-halfGraph(1-x); }
  }
  // Clamp x to 0-1 range by normalising
  x = Math.max(0, Math.min((x - minVal) / (maxVal - minVal), 1));

  // Evaluate polynomial to return smoothstep function
  return smoothstepFunc(x, steepness);
}