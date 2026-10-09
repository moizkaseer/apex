import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, MonoText, SerifText, SansText, Button, BarChart, KeyValueRow } from '@/components/ui';
import { colors, onDark, radii } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { goalDefs, planBars } from '@/data/mock';

const toneColor = { accent: colors.primary, light: colors.textOnDark, muted: colors.textOnDarkSecondary, faint: onDark(0.2) } as const;

/** 3d — Plan ready: pending inputs summary → generate → week-shape reveal. */
export default function PlanReadyScreen() {
  const goal = useAppStore((s) => s.goal);
  const connected = useAppStore((s) => s.connected);
  const planReady = useAppStore((s) => s.planReady);
  const generatePlan = useAppStore((s) => s.generatePlan);
  const resetPlan = useAppStore((s) => s.resetPlan);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const connectedCount = Object.values(connected).filter(Boolean).length;

  const planInputs = [
    { k: 'Goal', v: goalDefs[goal].name.toUpperCase() },
    { k: 'Sources connected', v: `${connectedCount} OF 6` },
    { k: 'History found', v: '90 DAYS · 61 WORKOUTS' },
    { k: 'Days available', v: 'MON–SAT · 5–6 / WK' },
  ];

  const goToToday = () => {
    completeOnboarding();
    router.replace('/(tabs)/today');
  };

  return (
    <ScreenContainer tone="screen" contentStyle={{ paddingHorizontal: 26, paddingTop: 12, gap: 0 }}>
      <MonoText size={10} color={colors.textMuted} style={{ letterSpacing: 10 * 0.16 }}>
        Step 3 of 3
      </MonoText>

      {!planReady ? (
        <>
          <SerifText size={32} weight="medium" color={colors.textPrimary} style={{ lineHeight: 37, marginTop: 12 }}>
            Ready when you are.
          </SerifText>
          <SansText size={14} color={colors.textSecondary} style={{ lineHeight: 22, marginTop: 8 }}>
            The coach will read your last 90 days across every connected source and build your
            first block.
          </SansText>

          <View style={{ gap: 12, marginTop: 28 }}>
            {planInputs.map((p) => (
              <View
                key={p.k}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: colors.cardMuted,
                  borderRadius: 14,
                  paddingVertical: 13,
                  paddingHorizontal: 16,
                }}
              >
                <SansText size={13.5} weight="semibold" color={colors.textPrimary}>
                  {p.k}
                </SansText>
                <MonoText size={10.5} color={colors.textSecondary} spaced={false} upper={false}>
                  {p.v}
                </MonoText>
              </View>
            ))}
          </View>

          <View style={{ flex: 1 }} />
          <View style={{ paddingVertical: 18 }}>
            <Button label="Generate my plan" variant="primary" onPress={generatePlan} />
          </View>
        </>
      ) : (
        <View>
          <SerifText size={32} weight="medium" color={colors.textPrimary} style={{ lineHeight: 37, marginTop: 12 }}>
            Your first block is built.
          </SerifText>
          <SansText size={14} color={colors.textSecondary} style={{ lineHeight: 22, marginTop: 8 }}>
            Hybrid base · 4 weeks. Tuned to your Strava history, gym numbers and race-weight goal.
          </SansText>

          <View style={{ backgroundColor: colors.ink, borderRadius: radii.lg, padding: 20, marginTop: 24 }}>
            <MonoText size={10} color={colors.textOnDarkSecondary} style={{ letterSpacing: 10 * 0.16 }}>
              Week 1 shape
            </MonoText>
            <View style={{ marginTop: 14 }}>
              <BarChart bars={planBars.map((b) => ({ h: b.h, color: toneColor[b.tone] }))} height={64} absolute={false} />
            </View>
            <View style={{ flexDirection: 'row', gap: 3, marginTop: 6 }}>
              {planBars.map((b, i) => (
                <MonoText key={i} size={8.5} color={colors.textOnDarkSecondary} spaced={false} upper={false} style={{ flex: 1, textAlign: 'center' }}>
                  {b.day}
                </MonoText>
              ))}
            </View>

            <View
              style={{
                gap: 8,
                marginTop: 16,
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: onDark(0.14),
              }}
            >
              <KeyValueRow label="Run volume" value="42 km/wk" dark />
              <KeyValueRow label="Strength" value="2 sessions · squat focus" dark />
              <KeyValueRow label="Fuel target" value="3,050 kcal · 190 g protein" dark />
            </View>
          </View>

          <View style={{ paddingVertical: 18 }}>
            <Button label="Go to today" variant="dark" onPress={goToToday} />
            <Pressable onPress={resetPlan} style={{ marginTop: 12 }}>
              <SansText size={13} color={colors.textMuted} style={{ textAlign: 'center' }}>
                ↺ replay this step
              </SansText>
            </Pressable>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
