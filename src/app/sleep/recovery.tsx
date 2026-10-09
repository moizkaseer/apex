import { View, Pressable } from 'react-native';
import { ScreenContainer, SerifText, SansText, MonoText, Card, ProgressRing, RangeBar } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { recoveryFactorDefs } from '@/data/mock';

export default function RecoveryBreakdown() {
  const readiness = useAppStore((s) => s.readiness);
  const openFactor = useAppStore((s) => s.openFactor);
  const toggleOpenFactor = useAppStore((s) => s.toggleOpenFactor);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <ProgressRing size={84} strokeWidth={8} progress={readiness}>
          <SerifText size={30}>{readiness}</SerifText>
        </ProgressRing>
        <View style={{ flex: 1 }}>
          <MonoText size={10}>Readiness · how it&rsquo;s built</MonoText>
          <SansText size={13.5} color={colors.textSecondary} style={{ marginTop: spacing.xs, lineHeight: 20 }}>
            Four factors, weighted by what predicts <SansText size={13.5} style={{ fontStyle: 'italic' }}>your</SansText> good days.
          </SansText>
        </View>
      </View>

      {/* factors */}
      <View style={{ gap: 9 }}>
        {recoveryFactorDefs.map((f, i) => {
          const isOpen = openFactor === i;
          const tone = f.good ? colors.primary : colors.warning;
          return (
            <Pressable key={f.name} onPress={() => toggleOpenFactor(i)}>
              <View
                style={{
                  backgroundColor: colors.screen,
                  borderWidth: 1.5,
                  borderColor: isOpen ? colors.borderStrong : colors.border,
                  borderRadius: 18,
                  paddingVertical: 15,
                  paddingHorizontal: 18,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <SansText size={14.5} weight="bold">
                      {f.name}
                    </SansText>
                    <MonoText size={10} style={{ marginTop: 2 }}>
                      {f.reading}
                    </MonoText>
                  </View>
                  <MonoText size={12} weight="semibold" spaced={false} color={tone}>
                    {f.pts}
                  </MonoText>
                </View>
                <View style={{ marginTop: spacing.sm }}>
                  <RangeBar width="100%" pct={f.pct} trackColor={colors.cardMutedAlt} fillColor={tone} />
                </View>
                {isOpen ? (
                  <SansText size={13} color={colors.textSecondary} style={{ marginTop: spacing.md, lineHeight: 21 }}>
                    {f.detail}
                  </SansText>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* personal model note */}
      <Card tone="dark" style={{ marginBottom: spacing.md }}>
        <MonoText size={9.5} color={colors.textOnDarkSecondary}>
          Your model · learned over 14 weeks
        </MonoText>
        <SansText size={13.5} color={colors.textOnDark} style={{ marginTop: spacing.sm, lineHeight: 22 }}>
          For most athletes sleep dominates. For you, HRV is the stronger signal — your best sessions follow HRV ≥ 62
          even on 7 h nights. The weights reflect that.
        </SansText>
      </Card>
    </ScreenContainer>
  );
}
