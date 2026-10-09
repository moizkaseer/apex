import type { ReadinessInputs } from './healthkit';

/**
 * Placeholder readiness scoring — a real product would tune this against
 * outcome data (and likely run it server-side). This gives the ring on the
 * Today screen a real computation to point at once HealthKit is connected,
 * instead of a hardcoded number. Falls back to the design's default (66)
 * when a signal is missing.
 */
export function computeReadiness(inputs: ReadinessInputs, baselineHrvMs = 58): number {
  const parts: number[] = [];

  if (inputs.hrvMs != null) {
    const hrvScore = clamp((inputs.hrvMs / baselineHrvMs) * 100, 0, 130);
    parts.push(clamp(hrvScore, 0, 100));
  }
  if (inputs.sleepHours != null) {
    parts.push(clamp((inputs.sleepHours / 8) * 100, 0, 100));
  }
  if (inputs.restingHeartRate != null) {
    // lower RHR vs a loose 60bpm reference reads as more recovered
    parts.push(clamp(120 - inputs.restingHeartRate, 0, 100));
  }

  if (parts.length === 0) return 66;
  const avg = parts.reduce((a, b) => a + b, 0) / parts.length;
  return Math.round(clamp(avg, 0, 100));
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function readinessWord(readiness: number): string {
  if (readiness >= 75) return 'Primed';
  if (readiness >= 50) return 'Steady';
  return 'Recover';
}
