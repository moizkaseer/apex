import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { SerifText, SansText, MonoText, Card } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';

/**
 * Turn 11b — the in-context upgrade moment: a blurred Pro insight over the
 * Body screen plus an honest bottom sheet. RN has no CSS blur for arbitrary
 * views, so the locked card renders its content at low opacity under a
 * frosted overlay — same effect the design's blur(7px) is going for.
 */
export default function LockedFeature() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.screen }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, gap: 14 }}>
          <SerifText size={28}>Body</SerifText>

          {/* visible free content */}
          <Card tone="muted" style={{ paddingVertical: 18 }}>
            <MonoText size={10}>Weight · free</MonoText>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm }}>
              <SerifText size={30}>78.4</SerifText>
              <SansText size={13} color={colors.textSecondary}>
                kg · trend −0.4 / wk
              </SansText>
            </View>
          </Card>

          {/* locked insight */}
          <View style={{ borderRadius: radii.lg, overflow: 'hidden' }}>
            <Card tone="dark" style={{ opacity: 0.35 }}>
              <MonoText size={10} color={colors.textOnDarkSecondary}>
                AI photo analysis · wk 24 → 28
              </MonoText>
              <SansText size={15} color={colors.textOnDark} style={{ lineHeight: 24, marginTop: spacing.sm }}>
                Waist −1.1 cm, delts up, est. body fat 14.2% and falling. Lean mass held. Two more weeks at this deficit
                then hold for race prep.
              </SansText>
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                <View style={{ flex: 1, height: 40, backgroundColor: onDark(0.15), borderRadius: 10 }} />
                <View style={{ flex: 1, height: 40, backgroundColor: onDark(0.15), borderRadius: 10 }} />
              </View>
            </Card>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(28,28,26,0.85)',
                  borderRadius: radii.pill,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.lg,
                }}
              >
                <MonoText size={10} color={colors.textOnDark}>
                  ◆ Pro insight
                </MonoText>
              </View>
            </View>
          </View>

          <SansText size={12.5} color={colors.textMuted} style={{ lineHeight: 19, paddingHorizontal: 4 }}>
            Your photos were analyzed — the read-out is a Pro feature. The photos themselves are always yours, free.
          </SansText>
        </View>

        {/* bottom sheet */}
        <View
          style={{
            backgroundColor: colors.ink,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            paddingHorizontal: spacing.xxl,
            paddingTop: spacing.xxl,
            paddingBottom: 34,
            marginTop: spacing.lg,
          }}
        >
          <View style={{ width: 36, height: 4, borderRadius: radii.pill, backgroundColor: onDark(0.25), alignSelf: 'center' }} />
          <SerifText size={22} color={colors.textOnDark} style={{ lineHeight: 29, marginTop: spacing.lg }}>
            This insight took 8 photos and 4 weeks of your data to build.
          </SerifText>
          <SansText size={13} color={colors.textOnDarkSecondary} style={{ lineHeight: 20, marginTop: spacing.sm }}>
            Pro unlocks the AI&rsquo;s full read: photo analysis, plan auto-adjustment, and the coach that answers with
            your numbers.
          </SansText>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 18 }}>
            <Pressable
              onPress={() => router.push('/paywall')}
              style={{
                flex: 1,
                backgroundColor: colors.screen,
                borderRadius: radii.pill,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <SansText size={14} weight="extrabold">
                Try Pro free · 7 days
              </SansText>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 110,
                borderWidth: 1.5,
                borderColor: onDark(0.35),
                borderRadius: radii.pill,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <SansText size={13.5} weight="bold" color={colors.textOnDark}>
                Not now
              </SansText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
