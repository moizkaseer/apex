import { View, Pressable } from 'react-native';
import { ScreenContainer, SerifText, SansText, MonoText, Card, Avatar } from '@/components/ui';
import { colors, spacing, radii } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { sharedSessionRoster, crewPalette } from '@/data/mock';

export default function SharedSession() {
  const rsvp = useAppStore((s) => s.rsvp);
  const setRsvp = useAppStore((s) => s.setRsvp);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg, flexGrow: 1 }}>
      <View>
        <MonoText size={10}>Crew session · proposed by Mika</MonoText>
        <SerifText size={30} style={{ marginTop: spacing.sm, lineHeight: 36 }}>
          Saturday track: 6 × 800m.
        </SerifText>
        <SansText size={13.5} color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
          Sat 7:30 · Riverside track · same workout, individual paces
        </SansText>
      </View>

      {/* your prescription */}
      <Card tone="dark">
        <MonoText size={10} color={colors.textOnDarkSecondary}>
          Your prescription
        </MonoText>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm }}>
          <SerifText size={34} color={colors.textOnDark}>
            2:56 / 800
          </SerifText>
          <SansText size={13} color={colors.textOnDarkSecondary}>
            · 90 s standing rest
          </SansText>
        </View>
        <SansText size={12.5} color={colors.textOnDarkSecondary} style={{ marginTop: spacing.sm, lineHeight: 19 }}>
          Set from your new threshold — this replaces Saturday&rsquo;s solo tempo. Fits your plan; the coach approves.
        </SansText>
      </Card>

      {/* who's in */}
      <View style={{ gap: 9 }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          Who&rsquo;s in · each at their pace
        </MonoText>
        {sharedSessionRoster.map((m) => {
          const status = m.status ?? (rsvp === 'yes' ? 'IN' : rsvp === 'no' ? 'OUT' : '— RSVP');
          const statusFg =
            status === 'IN' ? colors.textOnDark : status === 'MAYBE' ? colors.textSecondary : status === 'OUT' ? colors.danger : colors.textMuted;
          const statusBg = status === 'IN' ? colors.primary : colors.border;
          return (
            <View
              key={m.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: colors.cardMuted,
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: spacing.lg,
              }}
            >
              <Avatar initials={m.initials} size={34} bg={crewPalette[m.p].bg} fg={crewPalette[m.p].fg} />
              <View style={{ flex: 1 }}>
                <SansText size={14} weight="bold">
                  {m.name}
                </SansText>
                <MonoText size={10} spaced={false} style={{ marginTop: 2 }}>
                  {m.pace} / 800
                </MonoText>
              </View>
              <View style={{ backgroundColor: statusBg, borderRadius: radii.pill, paddingVertical: 5, paddingHorizontal: 11 }}>
                <MonoText size={9} color={statusFg}>
                  {status}
                </MonoText>
              </View>
            </View>
          );
        })}
      </View>

      <Card tone="muted" radius={radii.md} style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
        <SansText size={12.5} color={colors.textSecondary} style={{ lineHeight: 20 }}>
          <MonoText size={9.5} color={colors.primary}>
            how it works ·{' '}
          </MonoText>
          Everyone runs the same structure. The watch paces each athlete individually — you finish together at the rest.
        </SansText>
      </Card>

      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.md }}>
        <Pressable
          onPress={() => setRsvp('no')}
          style={{
            width: 100,
            borderWidth: 1.5,
            borderColor: rsvp === 'no' ? colors.danger : colors.trackAlt,
            borderRadius: radii.pill,
            paddingVertical: 15,
            alignItems: 'center',
          }}
        >
          <SansText size={13.5} weight="bold" color={rsvp === 'no' ? colors.danger : colors.textSecondary}>
            Pass
          </SansText>
        </Pressable>
        <Pressable
          onPress={() => setRsvp('yes')}
          style={{
            flex: 1,
            backgroundColor: rsvp === 'yes' ? colors.primary : colors.ink,
            borderRadius: radii.pill,
            paddingVertical: 15,
            alignItems: 'center',
          }}
        >
          <SansText size={14.5} weight="extrabold" color={colors.textOnDark}>
            {rsvp === 'yes' ? "You're in · synced to Saturday ✓" : "I'm in"}
          </SansText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
