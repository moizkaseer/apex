import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, MonoText, SerifText, SansText, Button } from '@/components/ui';
import { colors } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { serviceDefs } from '@/data/mock';

/** 3c — Connections: tap a service row to connect/disconnect it. */
export default function ConnectionsScreen() {
  const connected = useAppStore((s) => s.connected);
  const toggleConnected = useAppStore((s) => s.toggleConnected);

  const connectedCount = Object.values(connected).filter(Boolean).length;
  const connectCta = connectedCount > 0 ? `Continue with ${connectedCount} source${connectedCount === 1 ? '' : 's'}` : 'Continue';

  const goNext = () => router.push('/onboarding/plan-ready');

  return (
    <ScreenContainer tone="screen" contentStyle={{ paddingHorizontal: 26, paddingTop: 12, gap: 0 }}>
      <MonoText size={10} color={colors.textMuted} style={{ letterSpacing: 10 * 0.16 }}>
        Step 2 of 3
      </MonoText>
      <SerifText size={32} weight="medium" color={colors.textPrimary} style={{ lineHeight: 37, marginTop: 12 }}>
        Bring your data with you.
      </SerifText>
      <SansText size={14} color={colors.textSecondary} style={{ lineHeight: 22, marginTop: 8 }}>
        The more sources, the smarter the plan. Everything syncs both ways — log once, see it
        everywhere.
      </SansText>

      <View style={{ gap: 10, marginTop: 24, paddingBottom: 8 }}>
        {serviceDefs.map((s, i) => {
          const on = !!connected[i];
          return (
            <Pressable
              key={s.key}
              onPress={() => toggleConnected(i)}
              style={{
                borderWidth: 1.5,
                borderColor: on ? colors.primary : colors.border,
                backgroundColor: on ? colors.cardMuted : colors.screen,
                borderRadius: 18,
                paddingVertical: 14,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: on ? colors.ink : colors.cardMutedAlt,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MonoText size={12} weight="semibold" color={on ? colors.textOnDark : colors.textMuted} spaced={false}>
                  {s.initials}
                </MonoText>
              </View>
              <View style={{ flex: 1 }}>
                <SansText size={15} weight="bold" color={colors.textPrimary}>
                  {s.name}
                </SansText>
                <SansText size={12} color={colors.textMuted} style={{ marginTop: 2 }}>
                  {s.sub}
                </SansText>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: on ? colors.primary : colors.borderStrong,
                  backgroundColor: on ? colors.primary : 'transparent',
                  borderRadius: 999,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                }}
              >
                <MonoText size={10} color={on ? colors.textOnDark : colors.textPrimary} style={{ letterSpacing: 10 * 0.08 }}>
                  {on ? 'Connected' : 'Connect'}
                </MonoText>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingTop: 14, paddingBottom: 18, gap: 10 }}>
        <Button label={connectCta} variant="dark" onPress={goNext} />
        <Pressable onPress={goNext}>
          <SansText size={13} color={colors.textMuted} style={{ textAlign: 'center' }}>
            Skip for now
          </SansText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
