import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MonoText, SerifText, SansText, Button } from '@/components/ui';
import { colors } from '@/theme/tokens';
import { welcomePoints } from '@/data/mock';

/** 3a — Welcome: the pitch, full-bleed dark hero. */
export default function WelcomeScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.ink }}>
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 20, paddingBottom: 12 }}>
        <MonoText size={11} color={colors.textOnDarkSecondary} style={{ letterSpacing: 11 * 0.2 }}>
          Apex
        </MonoText>

        <SerifText size={46} weight="medium" color={colors.textOnDark} style={{ lineHeight: 52, marginTop: 20 }}>
          Every workout. Every meal. Every source. One plan.
        </SerifText>

        <SansText size={15} color={colors.textOnDarkSecondary} style={{ lineHeight: 24, marginTop: 18, maxWidth: 300 }}>
          Apex pulls your training from Apple Health, Strava and the gym floor into a single coach
          that plans, fuels and checks your progress.
        </SansText>

        <View style={{ gap: 12, marginTop: 36 }}>
          {welcomePoints.map((text, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: colors.primary }} />
              <SansText size={14} color={colors.textOnDark}>
                {text}
              </SansText>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ paddingBottom: 18, gap: 12 }}>
          <Button label="Build my plan" variant="light" onPress={() => router.push('/onboarding/account')} />
          <Pressable onPress={() => router.push('/onboarding/account')} hitSlop={8}>
            <SansText size={13} color={colors.textOnDarkSecondary} style={{ textAlign: 'center' }}>
              I already have an account
            </SansText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
