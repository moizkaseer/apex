import { Platform } from 'react-native';
import type { PurchasesOffering, PurchasesPackage, CustomerInfo } from 'react-native-purchases';

/**
 * RevenueCat (turn 11 — paywall & premium tiers). Requires a native module,
 * so it needs a dev client / EAS build, not Expo Go. Configure with
 * EXPO_PUBLIC_REVENUECAT_IOS_KEY / _ANDROID_KEY from the RevenueCat
 * dashboard, mapped to the "Athlete" and "Pro" products from tierDefs.
 */

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

let Purchases: typeof import('react-native-purchases').default | null = null;
let configured = false;

function getModule() {
  if (!Purchases) {
    try {
      Purchases = require('react-native-purchases').default;
    } catch {
      Purchases = null;
    }
  }
  return Purchases;
}

export function isPurchasesConfigured() {
  return Boolean(Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY);
}

export async function initPurchases(appUserId?: string) {
  const mod = getModule();
  const apiKey = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;
  if (!mod || !apiKey || configured) return;
  mod.configure({ apiKey, appUserID: appUserId });
  configured = true;
}

/** Returns the current offering's packages, matched against tierDefs by product identifier convention `athlete`/`pro`. */
export async function fetchOfferings(): Promise<PurchasesOffering | null> {
  const mod = getModule();
  if (!mod || !configured) return null;
  try {
    const offerings = await mod.getOfferings();
    return offerings.current;
  } catch (err) {
    console.warn('[purchases] fetchOfferings failed', err);
    return null;
  }
}

export async function purchase(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
  const mod = getModule();
  if (!mod) return null;
  try {
    const { customerInfo } = await mod.purchasePackage(pkg);
    return customerInfo;
  } catch (err) {
    console.warn('[purchases] purchase failed', err);
    return null;
  }
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  const mod = getModule();
  if (!mod) return null;
  try {
    return await mod.restorePurchases();
  } catch (err) {
    console.warn('[purchases] restore failed', err);
    return null;
  }
}

export function hasActiveEntitlement(info: CustomerInfo | null, entitlementId = 'pro'): boolean {
  if (!info) return false;
  return Boolean(info.entitlements.active[entitlementId]);
}
