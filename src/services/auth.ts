import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

import { supabase } from './supabase';

export type SignInResult = { ok: true } | { ok: false; canceled: boolean; message?: string };

export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  return AppleAuthentication.isAvailableAsync();
}

/**
 * Native Sign in with Apple → Supabase session. Apple only returns the
 * user's name on the very first sign-in, so it is saved to user metadata
 * (and picked up by the profiles trigger) when present.
 */
export async function signInWithApple(): Promise<SignInResult> {
  if (!supabase) return { ok: false, canceled: false, message: 'Accounts are not configured.' };
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) {
      return { ok: false, canceled: false, message: 'Apple did not return an identity token.' };
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });
    if (error) return { ok: false, canceled: false, message: error.message };

    const { givenName, familyName } = credential.fullName ?? {};
    const fullName = [givenName, familyName].filter(Boolean).join(' ');
    if (fullName && data.user) {
      await supabase.auth.updateUser({ data: { full_name: fullName, given_name: givenName, family_name: familyName } });
      await supabase.from('profiles').update({ display_name: fullName }).eq('id', data.user.id);
    }
    return { ok: true };
  } catch (err) {
    if ((err as { code?: string }).code === 'ERR_REQUEST_CANCELED') return { ok: false, canceled: true };
    return { ok: false, canceled: false, message: (err as Error).message };
  }
}

export async function signOut() {
  await supabase?.auth.signOut();
}
