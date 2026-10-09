import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';

import { Button, MonoText, SansText, SerifText } from '@/components/ui';
import { colors } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { isAppleSignInAvailable, signInWithApple } from '@/services/auth';
import { isSupabaseConfigured } from '@/services/supabase';

/** Account step between Welcome and Goal: Sign in with Apple, then resume where the account left off. */
export default function AccountScreen() {
  const userId = useAppStore((s) => s.userId);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  const [appleAvailable, setAppleAvailable] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  // The session listener sets userId only after the profile is pulled, so a
  // returning athlete skips straight past onboarding.
  useEffect(() => {
    if (userId) router.replace(onboardingComplete ? '/(tabs)/today' : '/onboarding/goal');
  }, [userId, onboardingComplete]);

  const onApple = async () => {
    setBusy(true);
    setError(null);
    const result = await signInWithApple();
    if (!result.ok) {
      setBusy(false);
      if (!result.canceled) setError(result.message ?? 'Sign in failed — try again.');
    }
    // On success stay busy until the session listener routes onward.
  };

  // Local-only mode for builds without accounts (Expo Go on Android, web, unconfigured dev).
  const canSkip = !isSupabaseConfigured() || appleAvailable === false;

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.ink }}>
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 20, paddingBottom: 12 }}>
        <MonoText size={11} color={colors.textOnDarkSecondary} style={{ letterSpacing: 11 * 0.2 }}>
          Apex
        </MonoText>

        <SerifText size={40} weight="medium" color={colors.textOnDark} style={{ lineHeight: 46, marginTop: 20 }}>
          Save your plan to your account.
        </SerifText>
        <SansText size={15} color={colors.textOnDarkSecondary} style={{ lineHeight: 24, marginTop: 18, maxWidth: 300 }}>
          Your training, meals and coach history stay with you across devices. Apple keeps your email private if
          you choose.
        </SansText>

        <View style={{ flex: 1 }} />

        <View style={{ paddingBottom: 18, gap: 14 }}>
          {busy ? (
            <View style={{ height: 52, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={colors.textOnDark} />
            </View>
          ) : appleAvailable && isSupabaseConfigured() ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={999}
              style={{ height: 52 }}
              onPress={onApple}
            />
          ) : null}

          {error ? (
            <SansText size={13} color={colors.warning} style={{ textAlign: 'center' }}>
              {error}
            </SansText>
          ) : null}

          {canSkip ? (
            <Button label="Continue without an account" variant="light" onPress={() => router.push('/onboarding/goal')} />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
