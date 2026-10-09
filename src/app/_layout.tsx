import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { useAppFonts } from '@/theme/useAppFonts';
import { colors } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { initAuth } from '@/services/session';

SplashScreen.preventAutoHideAsync();

/** True once saved state has loaded from device storage. */
function useStoreHydrated() {
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());
  useEffect(() => {
    if (hydrated) return;
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);
  return hydrated;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();
  const hydrated = useStoreHydrated();
  const authReady = useAppStore((s) => s.authReady);

  // Start session tracking after saved state loads, so a profile pulled from
  // the server isn't overwritten by the local copy arriving later.
  useEffect(() => {
    if (hydrated) initAuth();
  }, [hydrated]);

  const ready = (fontsLoaded || !!fontError) && hydrated && authReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Keep the splash up until saved state is loaded, so a returning user
  // isn't briefly routed to onboarding.
  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.screen }}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="paywall/index" options={{ presentation: 'modal' }} />
            <Stack.Screen name="body-trends/weigh-in" options={{ presentation: 'modal' }} />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
