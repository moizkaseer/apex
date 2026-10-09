import { View, Pressable } from 'react-native';
import { ScreenContainer, SerifText, SansText, MonoText, Card } from '@/components/ui';
import { colors, spacing, radii } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { returnToRunStages } from '@/data/mock';

const stageColors = (state: 'done' | 'now' | 'locked') => ({
  circleBorder: state === 'done' ? colors.primary : state === 'now' ? colors.ink : colors.trackStrong,
  circleBg: state === 'done' ? colors.primary : 'transparent',
  circleFg: state === 'done' ? colors.textOnDark : state === 'now' ? colors.textPrimary : '#b8b4a5',
  bg: state === 'now' ? colors.ink : colors.screen,
  border: state === 'now' ? colors.ink : colors.border,
  fg: state === 'now' ? colors.textOnDark : state === 'done' ? colors.textMuted : '#b8b4a5',
  sub: state === 'now' ? colors.textOnDarkSecondary : state === 'done' ? colors.textMuted : '#b8b4a5',
  tag: state === 'done' ? colors.primary : state === 'now' ? colors.accent : '#b8b4a5',
});

export default function ReturnProtocol() {
  const painToday = useAppStore((s) => s.painToday);
  const setPainToday = useAppStore((s) => s.setPainToday);

  const painOk = painToday <= 2;
  const painMsg = painOk
    ? '✓ Within the green zone — tomorrow moves to 30 min if this holds overnight.'
    : 'Above the line. Today becomes a rest day and stage 3 restarts — the protocol just protected you.';

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
      <View>
        <MonoText size={10}>Left achilles · day 9 of return</MonoText>
        <SerifText size={28} style={{ marginTop: spacing.sm, lineHeight: 34 }}>
          Stage 3 of 5 — earning back the road.
        </SerifText>
      </View>

      {/* gated stages */}
      <View style={{ gap: 9 }}>
        {returnToRunStages.map((st, i) => {
          const c = stageColors(st.state);
          const hasLine = i < returnToRunStages.length - 1;
          return (
            <View key={st.name} style={{ flexDirection: 'row', gap: 14 }}>
              <View style={{ alignItems: 'center', width: 26 }}>
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    borderWidth: 1.5,
                    borderColor: c.circleBorder,
                    backgroundColor: c.circleBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MonoText size={10} spaced={false} color={c.circleFg}>
                    {st.state === 'done' ? '✓' : String(i + 1)}
                  </MonoText>
                </View>
                {hasLine ? (
                  <View
                    style={{
                      width: 1.5,
                      flex: 1,
                      minHeight: 12,
                      backgroundColor: st.state === 'done' ? colors.primary : colors.divider,
                      marginTop: 4,
                    }}
                  />
                ) : null}
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: c.bg,
                  borderWidth: 1.5,
                  borderColor: c.border,
                  borderRadius: 16,
                  paddingVertical: 13,
                  paddingHorizontal: spacing.lg,
                  marginBottom: 4,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
                  <SansText size={14} weight="bold" color={c.fg}>
                    {st.name}
                  </SansText>
                  <MonoText size={9} color={c.tag}>
                    {st.tag}
                  </MonoText>
                </View>
                <SansText size={12} color={c.sub} style={{ marginTop: 3, lineHeight: 17 }}>
                  {st.sub}
                </SansText>
              </View>
            </View>
          );
        })}
      </View>

      {/* pain check-in */}
      <Card tone="muted" style={{ paddingVertical: 18 }}>
        <MonoText size={10}>Today&rsquo;s check-in · after 20 min jog</MonoText>
        <SansText size={15} weight="bold" style={{ marginTop: spacing.sm }}>
          Morning pain, 0–10?
        </SansText>
        <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md }}>
          {[0, 1, 2, 3, 4, 5].map((n) => {
            const sel = painToday === n;
            const hot = n >= 3;
            return (
              <Pressable
                key={n}
                onPress={() => setPainToday(n)}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: 10,
                  backgroundColor: sel ? (hot ? colors.danger : colors.ink) : colors.screen,
                  borderWidth: 1.5,
                  borderColor: sel ? (hot ? colors.danger : colors.ink) : colors.divider,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SansText size={14} weight="extrabold" color={sel ? colors.textOnDark : colors.textSecondary}>
                  {n}
                </SansText>
              </Pressable>
            );
          })}
        </View>
        <SansText size={12.5} weight="semibold" color={painOk ? colors.primary : colors.danger} style={{ marginTop: spacing.md, lineHeight: 19 }}>
          {painMsg}
        </SansText>
      </Card>

      <Card tone="muted" radius={radii.md} style={{ paddingVertical: 14, paddingHorizontal: 16, marginBottom: spacing.md }}>
        <SansText size={12.5} color={colors.textSecondary} style={{ lineHeight: 20 }}>
          <MonoText size={9.5} color={colors.primary}>
            rule ·{' '}
          </MonoText>
          Pain ≤ 2 that settles by morning: progress. Pain that lingers 24 h: repeat the stage. It&rsquo;s boring on
          purpose — boring heals.
        </SansText>
      </Card>
    </ScreenContainer>
  );
}
