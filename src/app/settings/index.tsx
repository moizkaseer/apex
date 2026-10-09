import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, Card, SerifText, MonoText, SansText, ToggleSwitch } from '@/components/ui';
import { colors, radii, spacing } from '@/theme/tokens';
import { connectionDefs, coachPrefDefs } from '@/data/mock';
import { useAppStore } from '@/store/useAppStore';
import { healthkit, strava } from '@/services';

export default function Screen() {
  const coachToggles = useAppStore((s) => s.coachToggles);
  const toggleCoachPref = useAppStore((s) => s.toggleCoachPref);

  const [healthKitAvailable, setHealthKitAvailable] = useState<boolean | null>(null);
  const [stravaConnected, setStravaConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    healthkit
      .isHealthKitAvailable()
      .then((ok) => {
        if (!cancelled) setHealthKitAvailable(ok);
      })
      .catch(() => {
        if (!cancelled) setHealthKitAvailable(null);
      });
    strava
      .getStoredStravaTokens()
      .then((tokens) => {
        if (!cancelled) setStravaConnected(!!tokens);
      })
      .catch(() => {
        if (!cancelled) setStravaConnected(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScreenContainer>
      <SerifText size={30} style={{ marginTop: spacing.sm }}>
        Settings
      </SerifText>

      {/* sync health */}
      <Card tone="dark" radius={radii.lg}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            Sync health
          </MonoText>
          <MonoText size={10} color={colors.accent} upper={false}>
            ALL SYSTEMS GO
          </MonoText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: 10 }}>
          <SerifText size={30} color={colors.textOnDark}>
            4 sources
          </SerifText>
          <SansText size={13} color={colors.textOnDarkSecondary}>
            · last full sync 6:41 today
          </SansText>
        </View>
        <SansText size={12.5} color={colors.textOnDarkSecondary} style={{ marginTop: 6, lineHeight: 18 }}>
          2,418 data points merged this week. 3 duplicates resolved automatically.
        </SansText>
      </Card>

      {/* connections */}
      <View style={{ gap: 9 }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          Connections
        </MonoText>
        {connectionDefs.map((c) => {
          let status = c.status;
          let ok = c.ok;
          if (c.key === 'appleHealth' && healthKitAvailable) {
            status = 'Sleep, HRV, weight · connected';
            ok = true;
          }
          if (c.key === 'strava' && stravaConnected) {
            status = 'Runs & rides · connected';
            ok = true;
          }
          const isDarkIcon = c.key === 'appleHealth';
          const isStravaIcon = c.key === 'strava';
          return (
            <Card
              key={c.key}
              tone="muted"
              radius={radii.md}
              onPress={() => router.push(`/settings/integration/${c.key}`)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, minHeight: 44 }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  backgroundColor: isDarkIcon ? colors.ink : isStravaIcon ? colors.warning : colors.cardFlat,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MonoText
                  size={10}
                  weight="semibold"
                  spaced={false}
                  upper={false}
                  color={isDarkIcon || isStravaIcon ? colors.textOnDark : colors.textSecondary}
                >
                  {c.initials}
                </MonoText>
              </View>
              <View style={{ flex: 1 }}>
                <SansText size={14.5} weight="bold">
                  {c.name}
                </SansText>
                <SansText size={12} color={ok ? colors.primary : colors.danger} style={{ marginTop: 2 }}>
                  {status}
                </SansText>
              </View>
              <MonoText size={12} spaced={false}>
                ›
              </MonoText>
            </Card>
          );
        })}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: spacing.sm,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: colors.trackAlt,
            borderRadius: radii.md,
            paddingVertical: 14,
          }}
        >
          <SansText size={13.5} weight="bold" color={colors.textMuted}>
            + Add a source
          </SansText>
        </View>
      </View>

      {/* coach behavior */}
      <View style={{ gap: 9 }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          Coach behavior
        </MonoText>
        {coachPrefDefs.map((p, i) => (
          <Card
            key={p.name}
            tone="muted"
            radius={radii.md}
            onPress={() => toggleCoachPref(i)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, minHeight: 44 }}
          >
            <View style={{ flex: 1 }}>
              <SansText size={14} weight="bold">
                {p.name}
              </SansText>
              <SansText size={12} color={colors.textMuted} style={{ marginTop: 2, lineHeight: 17 }}>
                {p.sub}
              </SansText>
            </View>
            <ToggleSwitch on={!!coachToggles[i]} onToggle={() => toggleCoachPref(i)} />
          </Card>
        ))}
      </View>

      {/* more */}
      <View style={{ gap: 9 }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          More
        </MonoText>
        {(
          [
            { label: 'Notifications & nudges', sub: 'Budget, types, lock-screen preview', route: '/notifications/settings' },
            { label: 'Apple Watch companion', sub: 'Watch faces & live session previews', route: '/watch-preview' },
            { label: 'Crew · training partners', sub: 'Consistency board, shared sessions', route: '/social/crew' },
            { label: 'Injury & recovery', sub: 'Report a niggle, return-to-run protocol', route: '/injury/report' },
            { label: 'Race day mode', sub: 'City Half · Sept 6', route: '/race-day/morning' },
            { label: 'Membership', sub: 'Athlete / Pro plans, free trial', route: '/paywall' },
          ] as const
        ).map((row) => (
          <Card
            key={row.route}
            tone="muted"
            radius={radii.md}
            onPress={() => router.push(row.route)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, minHeight: 44 }}
          >
            <View style={{ flex: 1 }}>
              <SansText size={14} weight="bold">
                {row.label}
              </SansText>
              <SansText size={12} color={colors.textMuted} style={{ marginTop: 2 }}>
                {row.sub}
              </SansText>
            </View>
            <MonoText size={12} spaced={false}>
              ›
            </MonoText>
          </Card>
        ))}
      </View>

      {/* privacy */}
      <Card tone="muted" radius={radii.md}>
        <SansText size={12.5} color={colors.textSecondary} style={{ lineHeight: 19 }}>
          <MonoText size={9.5} color={colors.primary} upper spaced>
            privacy ·{' '}
          </MonoText>
          Progress photos are analyzed on-device and never leave your phone unless you share them.
        </SansText>
      </Card>
    </ScreenContainer>
  );
}
