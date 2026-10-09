import { View } from 'react-native';
import { ScreenContainer, SerifText, SansText, MonoText, Card, Button, BarChart, ExpandableRow } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { trainingLoadArc, phaseDefs } from '@/data/mock';

export default function BlockOverview() {
  const openPhase = useAppStore((s) => s.openPhase);
  const toggleOpenPhase = useAppStore((s) => s.toggleOpenPhase);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
      <View>
        <MonoText size={10}>City Half Marathon · Sept 6</MonoText>
        <SerifText size={32} style={{ marginTop: spacing.sm, lineHeight: 38 }}>
          8 weeks to the start line.
        </SerifText>
      </View>

      {/* 12-week arc */}
      <Card tone="dark">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            Weekly load · 12 weeks
          </MonoText>
          <MonoText size={10} color={colors.accent}>
            You are wk 28
          </MonoText>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <BarChart
            height={78}
            gap={4}
            radius={3}
            absolute
            bars={trainingLoadArc.map((h, i) => ({
              h,
              color: i === 6 ? colors.accent : i < 6 ? onDark(0.45) : onDark(0.18),
            }))}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
          {['BASE', 'BUILD', 'PEAK', 'TAPER · RACE'].map((p) => (
            <MonoText key={p} size={8.5} color={colors.textOnDarkMuted}>
              {p}
            </MonoText>
          ))}
        </View>
      </Card>

      {/* phases */}
      <View style={{ gap: 9 }}>
        {phaseDefs.map((p, i) => {
          const now = i === 1;
          const dot = now ? colors.primary : i < 1 ? '#b8b4a5' : colors.track;
          return (
            <ExpandableRow
              key={p.name}
              isOpen={openPhase === i}
              onPress={() => toggleOpenPhase(i)}
              leading={<View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: dot }} />}
              title={p.name}
              trailing={
                <MonoText size={9.5} color={now ? colors.primary : colors.textMuted}>
                  {p.weeks}
                </MonoText>
              }
            >
              <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 21, paddingLeft: 22 }}>
                {p.detail}
              </SansText>
            </ExpandableRow>
          );
        })}
      </View>

      {/* adaptive note */}
      <Card tone="muted" radius={radii.md} style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
        <SansText size={12.5} color={colors.textSecondary} style={{ lineHeight: 20 }}>
          <MonoText size={9.5} color={colors.primary}>
            adaptive ·{' '}
          </MonoText>
          This arc re-plans itself. Miss a week, over-perform, or change your race — the remaining weeks reshape around
          what actually happened.
        </SansText>
      </Card>

      <View style={{ paddingBottom: spacing.md }}>
        <Button label="Adjust race goal" variant="dark" onPress={() => {}} />
      </View>
    </ScreenContainer>
  );
}
