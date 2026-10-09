import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { isSupabaseConfigured } from '@/services/supabase';

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const userId = useAppStore((s) => s.userId);
  // With accounts configured, signed-out users always start at Welcome.
  const signedOut = isSupabaseConfigured() && !userId;
  return <Redirect href={onboardingComplete && !signedOut ? '/(tabs)/today' : '/onboarding/welcome'} />;
}
