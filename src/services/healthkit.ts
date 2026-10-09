import { Platform } from 'react-native';

/**
 * Apple Health integration via @kingstinct/react-native-healthkit.
 *
 * HealthKit is iOS-only and requires a native module — it will not run in
 * Expo Go. Build a dev client (`eas build --profile development`) or run
 * `npx expo run:ios` on macOS with Xcode. On any other platform, or before
 * the user grants permission, every function here degrades to returning
 * `null`/`[]` so screens can render with mock data instead of crashing.
 */

const READ_TYPES = [
  'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
  'HKQuantityTypeIdentifierRestingHeartRate',
  'HKQuantityTypeIdentifierBodyMass',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
  'HKQuantityTypeIdentifierRespiratoryRate',
  'HKCategoryTypeIdentifierSleepAnalysis',
] as const;

const WRITE_TYPES = ['HKQuantityTypeIdentifierBodyMass'] as const;

function isSupported() {
  return Platform.OS === 'ios';
}

let hk: typeof import('@kingstinct/react-native-healthkit') | null = null;
function getModule() {
  if (!isSupported()) return null;
  if (!hk) {
    try {
      // Lazy require: importing this on a platform/build without the native
      // module present would throw at module-init time.
      hk = require('@kingstinct/react-native-healthkit');
    } catch {
      hk = null;
    }
  }
  return hk;
}

export async function isHealthKitAvailable(): Promise<boolean> {
  const mod = getModule();
  if (!mod) return false;
  try {
    return await mod.isHealthDataAvailableAsync();
  } catch {
    return false;
  }
}

export async function requestHealthKitAuthorization(): Promise<boolean> {
  const mod = getModule();
  if (!mod) return false;
  try {
    return await mod.requestAuthorization({ read: READ_TYPES, write: WRITE_TYPES } as never);
  } catch (err) {
    console.warn('[healthkit] authorization failed', err);
    return false;
  }
}

export interface ReadinessInputs {
  hrvMs: number | null;
  restingHeartRate: number | null;
  sleepHours: number | null;
  bodyWeightKg: number | null;
}

/** Pulls the same signals the design's readiness ring is built from. */
export async function fetchReadinessInputs(): Promise<ReadinessInputs> {
  const mod = getModule();
  if (!mod) return { hrvMs: null, restingHeartRate: null, sleepHours: null, bodyWeightKg: null };

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const [hrv, rhr, weight] = await Promise.all([
      mod.getMostRecentQuantitySample('HKQuantityTypeIdentifierHeartRateVariabilitySDNN', 'ms' as never).catch(() => undefined),
      mod.getMostRecentQuantitySample('HKQuantityTypeIdentifierRestingHeartRate', 'count/min' as never).catch(() => undefined),
      mod.getMostRecentQuantitySample('HKQuantityTypeIdentifierBodyMass', 'kg' as never).catch(() => undefined),
    ]);
    const sleepSamples = await mod
      .queryCategorySamples('HKCategoryTypeIdentifierSleepAnalysis', { filter: { startDate: since, endDate: new Date() } } as never)
      .catch(() => [] as const);
    const sleepHours =
      sleepSamples.length > 0
        ? sleepSamples.reduce((total: number, s: any) => total + (new Date(s.endDate).getTime() - new Date(s.startDate).getTime()), 0) /
          3_600_000
        : null;

    return {
      hrvMs: hrv?.quantity ?? null,
      restingHeartRate: rhr?.quantity ?? null,
      sleepHours,
      bodyWeightKg: weight?.quantity ?? null,
    };
  } catch (err) {
    console.warn('[healthkit] fetchReadinessInputs failed', err);
    return { hrvMs: null, restingHeartRate: null, sleepHours: null, bodyWeightKg: null };
  }
}

/** Writes a logged body-weight entry back to Health, mirroring the settings screen's "read + write" mode. */
export async function writeBodyWeight(kg: number, date: Date = new Date()): Promise<boolean> {
  const mod = getModule();
  if (!mod) return false;
  try {
    await mod.saveQuantitySample('HKQuantityTypeIdentifierBodyMass', 'kg' as never, kg, date, date);
    return true;
  } catch (err) {
    console.warn('[healthkit] writeBodyWeight failed', err);
    return false;
  }
}
