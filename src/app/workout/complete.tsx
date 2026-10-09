import { View } from 'react-native';
import { router } from 'expo-router';
import { Button, MonoText, RangeBar, SansText, ScreenContainer, SerifText } from '@/components/ui';
import { colors, onDark, radii, spacing } from '@/theme/tokens';
import { splitTimes } from '@/data/mock';

/**
 * Turn 4c — session complete. Light editorial summary screen (the source
 * does not set `dark` on this frame — only the dark splits card within it).
 * Source: Fitness Dashboard Options.dc.html lines 2081-2152 (markup),
 * 3718-3729 (splits derivation).
 */
export default function SessionCompleteScreen() {
  const splits = splitTimes.map((s) => ({
    ...s,
    color: s.fast ? colors.primary : colors.textOnDarkSecondary,
    timeColor: s.fast ? colors.textOnDark : colors.textOnDarkSecondary,
  }));

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xl, gap: 0 }}>
      <MonoText size={10} spaced upper color={colors.primary}>
        ● Session saved · 7:24 am
      </MonoText>
      <SerifText size={34} weight="medium" color={colors.textPrimary} style={{ lineHeight: 39, marginTop: 12 }}>
        Five for five. Clean.
      </SerifText>
      <SansText size={14} color={colors.textSecondary} style={{ lineHeight: 21.5, marginTop: 8 }}>
        All reps inside the target band. That's the fourth straight quality session — your threshold is moving.
      </SansText>

      {/* splits */}
      <View style={{ backgroundColor: colors.ink, borderRadius: radii.xl, padding: spacing.xl, marginTop: 22 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} spaced upper color={colors.textOnDarkSecondary}>Splits · 5 × 1200m</MonoText>
          <MonoText size={10} spaced={false} upper={false} color={colors.textOnDarkSecondary}>target 4:10 /km</MonoText>
        </View>
        <View style={{ gap: 9, marginTop: spacing.md }}>
          {splits.map((sp) => (
            <View key={sp.n} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <MonoText size={10} spaced={false} upper={false} color={colors.textOnDarkSecondary} style={{ width: 28 }}>
                R{sp.n}
              </MonoText>
              <View style={{ flex: 1 }}>
                <RangeBar width="100%" height={8} pct={sp.pct} trackColor={onDark(0.1)} fillColor={sp.color} />
              </View>
              <MonoText size={10.5} spaced={false} upper={false} color={sp.timeColor} style={{ width: 64, textAlign: 'right' }}>
                {sp.time}
              </MonoText>
            </View>
          ))}
        </View>
      </View>

      {/* stats */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        <StatBox label="LOAD" value="+74" />
        <StatBox label="KCAL" value="684" />
        <StatBox label="AVG HR" value="168" />
      </View>

      {/* coach next step */}
      <View style={{ backgroundColor: colors.cardMuted, borderRadius: radii.lg, padding: 14, marginTop: spacing.md }}>
        <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 20 }}>
          <MonoText size={10} spaced upper color={colors.primary}>coach · </MonoText>
          Refuel inside 30 minutes — your post-run shake covers it. I've eased tomorrow's squat warm-up; legs earned it.
        </SansText>
      </View>

      {/* sync */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.md, paddingBottom: spacing.sm }}>
        <SyncPill label="✓ saved to Apple Health" />
        <SyncPill label="✓ posted to Strava" />
        <SyncPill label="✓ plan updated" />
      </View>

      <View style={{ flex: 1, minHeight: spacing.xl }} />

      <Button label="Back to Today" variant="dark" onPress={() => router.replace('/(tabs)/today')} />
    </ScreenContainer>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.cardMuted, borderRadius: radii.lg, padding: 14, alignItems: 'center' }}>
      <MonoText size={9} spaced upper color={colors.textMutedAlt}>{label}</MonoText>
      <SerifText size={22} weight="medium" color={colors.textPrimary} style={{ marginTop: 4 }}>{value}</SerifText>
    </View>
  );
}

function SyncPill({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: colors.cardMuted, borderRadius: radii.pill, paddingVertical: 7, paddingHorizontal: 12 }}>
      <MonoText size={10} spaced={false} upper={false} color={colors.textMutedAlt}>{label}</MonoText>
    </View>
  );
}
