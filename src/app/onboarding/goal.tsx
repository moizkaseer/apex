import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, MonoText, SerifText, SansText, Button } from '@/components/ui';
import { colors } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { goalDefs } from '@/data/mock';

/** 3b — Goal: tap a card to select, note copy below adapts to the pick. */
export default function GoalScreen() {
  const goal = useAppStore((s) => s.goal);
  const setGoal = useAppStore((s) => s.setGoal);

  return (
    <ScreenContainer tone="screen" contentStyle={{ paddingHorizontal: 26, paddingTop: 12, gap: 0 }}>
      <MonoText size={10} color={colors.textMuted} style={{ letterSpacing: 10 * 0.16 }}>
        Step 1 of 3
      </MonoText>
      <SerifText size={32} weight="medium" color={colors.textPrimary} style={{ lineHeight: 37, marginTop: 12 }}>
        What are you training for?
      </SerifText>
      <SansText size={14} color={colors.textSecondary} style={{ lineHeight: 22, marginTop: 8 }}>
        This sets how the coach balances running, lifting and recovery. You can change it any time.
      </SansText>

      <View style={{ gap: 10, marginTop: 24 }}>
        {goalDefs.map((g, i) => {
          const active = goal === i;
          return (
            <Pressable
              key={g.name}
              onPress={() => setGoal(i)}
              style={{
                borderWidth: 1.5,
                borderColor: active ? colors.borderStrong : colors.border,
                backgroundColor: active ? colors.cardMuted : colors.screen,
                borderRadius: 18,
                paddingVertical: 16,
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  borderWidth: 1.5,
                  borderColor: active ? colors.borderStrong : colors.trackStrong,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: active ? colors.primary : 'transparent',
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SansText size={15} weight="bold" color={colors.textPrimary}>
                  {g.name}
                </SansText>
                <SansText size={12.5} color={colors.textMuted} style={{ marginTop: 2 }}>
                  {g.sub}
                </SansText>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ backgroundColor: colors.cardMuted, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, marginTop: 18 }}>
        <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 20 }}>
          <MonoText size={10} color={colors.primary} style={{ letterSpacing: 10 * 0.12 }}>
            coach ·{' '}
          </MonoText>
          {goalDefs[goal].note}
        </SansText>
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingVertical: 18 }}>
        <Button label="Continue" variant="dark" onPress={() => router.push('/onboarding/connections')} />
      </View>
    </ScreenContainer>
  );
}
