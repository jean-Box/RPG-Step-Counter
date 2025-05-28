/**
 * Step detection algorithm based on acceleration patterns
 * This is a simple peak detection algorithm that looks for
 * significant changes in acceleration that could indicate a step
 */
export function detectStep(accelerationHistory: number[]): boolean {
  if (accelerationHistory.length < 4) return false
  
  const len = accelerationHistory.length
  const current = accelerationHistory[len - 1]
  const prev1 = accelerationHistory[len - 2]
  const prev2 = accelerationHistory[len - 3]
  const prev3 = accelerationHistory[len - 4]
  
  // Threshold for step detection - slightly reduced for better sensitivity
  const THRESHOLD = 10
  
  // Pattern: acceleration increases, then decreases (peak)
  // This pattern happens when a step is taken
  if (
    prev3 < prev2 &&
    prev2 < prev1 &&
    prev1 > current &&
    prev1 > THRESHOLD
  ) {
    return true
  }
  
  return false
}

/**
 * More sophisticated step detection could include:
 * - Low-pass filter to remove noise
 * - Dynamic thresholds based on user's walking pattern
 * - Time-based constraints (minimum time between steps)
 * - Direction analysis to avoid counting non-walking movements
 */

// For future improvements, here's a low-pass filter implementation
export function lowPassFilter(input: number, output: number, alpha: number): number {
  return output + alpha * (input - output)
}