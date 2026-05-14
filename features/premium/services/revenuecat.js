import { Platform } from 'react-native';

const REVENUECAT_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_KEY_IOS ?? '';
const REVENUECAT_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_KEY_ANDROID ?? '';

let Purchases = null;

async function getPurchases() {
  if (Purchases) return Purchases;
  try {
    const mod = await import('react-native-purchases');
    Purchases = mod.default;
    return Purchases;
  } catch {
    return null;
  }
}

export async function initRevenueCat(userId) {
  const purchases = await getPurchases();
  if (!purchases) return;

  const apiKey = Platform.OS === 'ios' ? REVENUECAT_KEY_IOS : REVENUECAT_KEY_ANDROID;
  if (!apiKey) return;

  purchases.configure({ apiKey, appUserID: userId });
}

export async function getEntitlements() {
  const purchases = await getPurchases();
  if (!purchases) return {};

  try {
    const info = await purchases.getCustomerInfo();
    return info.entitlements.active ?? {};
  } catch {
    return {};
  }
}

export async function getOfferings() {
  const purchases = await getPurchases();
  if (!purchases) return null;

  try {
    return await purchases.getOfferings();
  } catch {
    return null;
  }
}

export async function purchasePackage(pkg) {
  const purchases = await getPurchases();
  if (!purchases) throw new Error('Purchases not available');

  const { customerInfo } = await purchases.purchasePackage(pkg);
  return customerInfo.entitlements.active ?? {};
}

export async function restorePurchases() {
  const purchases = await getPurchases();
  if (!purchases) return {};

  try {
    const info = await purchases.restorePurchases();
    return info.entitlements.active ?? {};
  } catch {
    return {};
  }
}

export async function logOutRevenueCat() {
  const purchases = await getPurchases();
  if (!purchases) return;
  try {
    await purchases.logOut();
  } catch {}
}
