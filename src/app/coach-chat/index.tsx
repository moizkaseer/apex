import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, Pill } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';

const proposedRows = [
  { day: 'SAT', text: 'Long run · 24 km progressive', tag: 'MOVED', tagColor: colors.warning, struck: true, dim: false },
  { day: 'SUN', text: 'Long run · 24 km · start 7:00', tag: 'NEW', tagColor: colors.accent, struck: false, dim: false },
  { day: 'MON', text: 'Easy run → full rest (recovery guard)', tag: 'AUTO', tagColor: colors.textOnDarkSecondary, struck: false, dim: true },
];

const usedSources = ['strava history', 'hrv trend', 'race calendar'];

export default function CoachChatDetail() {
  const swapChoice = useAppStore((s) => s.swapChoice);
  const acceptSwap = useAppStore((s) => s.acceptSwap);
  const declineSwap = useAppStore((s) => s.declineSwap);

  const decided = swapChoice !== null;
  const resultColor = swapChoice === 'apply' ? colors.accent : colors.warning;
  const resultText = swapChoice === 'apply' ? 'APPLIED · WEEK RESYNCED TO WATCH' : 'DECLINED · ORIGINAL WEEK KEPT';
  const followUp =
    swapChoice === 'apply'
      ? 'Done. Sunday 7:00 start — I’ll ping you Saturday night with a fueling reminder. Enjoy the wedding, dance conservatively.'
      : 'Your call — Saturday it stays. I moved it to 6:00 so you’re showered before the ceremony, and cut Friday’s tempo by 20%.';

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SerifText size={26}>Coach</SerifText>
        <MonoText size={10} color={colors.primary} upper={false}>
          ● reading 4 sources
        </MonoText>
      </View>

      {/* user msg */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <View
          style={{
            maxWidth: '82%',
            backgroundColor: colors.ink,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 4,
          }}
        >
          <SansText size={14} color={colors.textOnDark} style={{ lineHeight: 22 }}>
            I have a wedding Saturday — can&rsquo;t do the long run. What do we do?
          </SansText>
        </View>
      </View>

      {/* coach msg */}
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            maxWidth: '86%',
            backgroundColor: colors.cardMuted,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 18,
          }}
        >
          <SansText size={14} style={{ lineHeight: 22 }}>
            No problem — the long run is the anchor of the week, so let&rsquo;s move it, not shrink it. Two ways this works,
            but one is clearly better for your race:
          </SansText>
        </View>
      </View>

      {/* inline plan card */}
      <Card tone="dark" style={{ marginLeft: spacing.md }}>
        <MonoText size={9.5} color={colors.textOnDarkSecondary}>
          Proposed change · wk 28
        </MonoText>
        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          {proposedRows.map((r) => (
            <View key={r.day} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <MonoText size={10} color={colors.textOnDarkSecondary} style={{ width: 32 }}>
                {r.day}
              </MonoText>
              <SansText
                size={13.5}
                weight={r.tag === 'NEW' ? 'bold' : 'regular'}
                color={r.struck ? colors.textOnDarkMuted : r.dim ? colors.textOnDarkSecondary : colors.textOnDark}
                style={{ flex: 1, textDecorationLine: r.struck ? 'line-through' : 'none' }}
              >
                {r.text}
              </SansText>
              <MonoText size={9} color={r.tagColor}>
                {r.tag}
              </MonoText>
            </View>
          ))}
        </View>
        {!decided ? (
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
            <Pressable
              onPress={acceptSwap}
              style={{ flex: 1, backgroundColor: colors.screen, borderRadius: radii.pill, paddingVertical: 12, alignItems: 'center' }}
            >
              <SansText size={13.5} weight="extrabold">
                Apply change
              </SansText>
            </Pressable>
            <Pressable
              onPress={declineSwap}
              style={{
                flex: 1,
                borderWidth: 1.5,
                borderColor: onDark(0.35),
                borderRadius: radii.pill,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <SansText size={13.5} weight="bold" color={colors.textOnDark}>
                Decline
              </SansText>
            </Pressable>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: resultColor }} />
            <MonoText size={10} color={resultColor}>
              {resultText}
            </MonoText>
          </View>
        )}
      </Card>

      {/* coach follow-up after decision */}
      {decided ? (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              maxWidth: '86%',
              backgroundColor: colors.cardMuted,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 18,
            }}
          >
            <SansText size={14} style={{ lineHeight: 22 }}>
              {followUp}
            </SansText>
          </View>
        </View>
      ) : null}

      {/* why row — taps through to the source breakdown */}
      <View style={{ flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', marginLeft: spacing.md }}>
        {usedSources.map((s) => (
          <Pill key={s} label={`used: ${s}`} size="sm" bg={colors.cardMuted} color={colors.textMuted} onPress={() => router.push('/coach-chat/why')} />
        ))}
      </View>

      <View style={{ marginTop: spacing.sm }}>
        <Pressable onPress={() => router.push('/coach-chat/why')}>
          <MonoText size={10} color={colors.textPrimary}>
            Why this advice →
          </MonoText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
