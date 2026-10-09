import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, Avatar, RangeBar } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { crewPalette, crewBoardDefs, crewFeedDefs } from '@/data/mock';

export default function CrewScreen() {
  const respects = useAppStore((s) => s.respects);
  const toggleRespect = useAppStore((s) => s.toggleRespect);

  const crewBoard = crewBoardDefs.map((c) => ({
    ...c,
    avatarBg: crewPalette[c.p].bg,
    avatarFg: crewPalette[c.p].fg,
    barColor: c.you ? colors.accent : onDark(0.45),
  }));

  const crewFeed = crewFeedDefs.map((f, i) => {
    const given = !!respects[i];
    return {
      ...f,
      avatarBg: crewPalette[f.p].bg,
      avatarFg: crewPalette[f.p].fg,
      respects: f.baseRespects + (given ? 1 : 0),
      respectBg: given ? colors.ink : 'transparent',
      respectBorder: given ? colors.ink : colors.trackAlt,
      respectFg: given ? colors.textOnDark : colors.textSecondary,
    };
  });

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.xl }}>
      {/* header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SerifText size={28}>Crew</SerifText>
        <MonoText size={10} color={colors.textMuted}>
          6 ATHLETES · INVITE ONLY
        </MonoText>
      </View>

      {/* weekly board */}
      <Card tone="dark" radius={radii.lg}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            This week · consistency board
          </MonoText>
          <MonoText size={10} spaced={false} upper={false} color={colors.accent}>
            PLAN HIT %
          </MonoText>
        </View>
        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          {crewBoard.map((c) => (
            <View key={c.name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Avatar initials={c.initials} size={30} bg={c.avatarBg} fg={c.avatarFg} />
              <View style={{ width: 52 }}>
                <SansText size={13} weight={c.you ? 'extrabold' : 'medium'} color={colors.textOnDark}>
                  {c.name}
                </SansText>
              </View>
              <View style={{ flex: 1 }}>
                <RangeBar width={'100%' as unknown as number} pct={c.pct} trackColor={onDark(0.12)} fillColor={c.barColor} />
              </View>
              <View style={{ width: 34 }}>
                <MonoText size={10.5} spaced={false} upper={false} color={colors.textOnDark} style={{ textAlign: 'right' }}>
                  {c.pct}%
                </MonoText>
              </View>
            </View>
          ))}
        </View>
        <SansText size={12} color={colors.textOnDarkSecondary} style={{ marginTop: spacing.md, lineHeight: 18 }}>
          Ranked by sticking to your own plan — not by volume. Nobody wins by overtraining.
        </SansText>
      </Card>

      {/* activity feed */}
      <View style={{ gap: spacing.sm }}>
        <MonoText size={10} color={colors.textMuted} style={{ paddingHorizontal: 2 }}>
          Today in the crew
        </MonoText>
        {crewFeed.map((f, i) => (
          <Card key={i} tone="muted" radius={radii.lg}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Avatar initials={f.initials} size={34} bg={f.avatarBg} fg={f.avatarFg} />
              <View style={{ flex: 1 }}>
                <SansText size={14} weight="bold" color={colors.textPrimary}>
                  {f.name}{' '}
                  <SansText size={14} weight="medium" color={colors.textSecondary}>
                    {f.action}
                  </SansText>
                </SansText>
                <MonoText size={10} spaced={false} upper={false} color={colors.textMuted} style={{ marginTop: 2 }}>
                  {f.detail}
                </MonoText>
              </View>
            </View>
            <SansText size={13} color={colors.textSecondary} style={{ marginTop: spacing.md, lineHeight: 19.5 }}>
              {f.note}
            </SansText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md }}>
              <Pressable
                onPress={() => toggleRespect(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                  backgroundColor: f.respectBg,
                  borderWidth: 1.5,
                  borderColor: f.respectBorder,
                  borderRadius: radii.pill,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  minHeight: 20,
                }}
              >
                <SansText size={12} color={f.respectFg}>
                  ◆
                </SansText>
                <MonoText size={10} spaced={false} upper={false} color={f.respectFg}>
                  {f.respects}
                </MonoText>
              </Pressable>
              <MonoText size={9.5} spaced={false} upper={false} color={colors.textMuted}>
                {f.time}
              </MonoText>
            </View>
          </Card>
        ))}
      </View>

      {/* proposed shared session */}
      <Card tone="muted" radius={radii.md} onPress={() => router.push('/social/shared-session')} style={{ paddingVertical: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SansText size={13} weight="semibold">
            Mika proposed: Saturday track · 6 × 800m
          </SansText>
          <MonoText size={10} color={colors.primary}>
            RSVP →
          </MonoText>
        </View>
      </Card>

      {/* footer note */}
      <View style={{ backgroundColor: colors.cardMuted, borderRadius: radii.md, padding: spacing.lg }}>
        <SansText size={12.5} color={colors.textSecondary} style={{ lineHeight: 19 }}>
          <MonoText size={9.5} color={colors.primary}>
            no feed ·{' '}
          </MonoText>
          No followers, no strangers, no doom-scroll. Six people who know what Thursday&rsquo;s tempo felt like.
        </SansText>
      </View>
    </ScreenContainer>
  );
}
