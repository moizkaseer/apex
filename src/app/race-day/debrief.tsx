import { View, Pressable, Share } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, RangeBar, ExpandableRow } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { raceSplits, raceLearningDefs } from '@/data/mock';

export default function PostRaceDebrief() {
  const openLearning = useAppStore((s) => s.openLearning);
  const toggleOpenLearning = useAppStore((s) => s.toggleOpenLearning);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
      <View>
        <MonoText size={10}>City Half · final</MonoText>
        <SerifText size={56} style={{ marginTop: spacing.sm, lineHeight: 62 }}>
          1:32:41
        </SerifText>
        <SansText size={14} weight="bold" color={colors.primary} style={{ marginTop: spacing.sm }}>
          29 s under target · personal best by 3:12
        </SansText>
      </View>

      {/* splits */}
      <Card tone="dark">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            5K splits · via Strava
          </MonoText>
          <MonoText size={10} color={colors.accent}>
            Negative split ✓
          </MonoText>
        </View>
        <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
          {raceSplits.map((s) => (
            <View key={s.seg} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <MonoText size={10} color={colors.textOnDarkSecondary} style={{ width: 46 }}>
                {s.seg}
              </MonoText>
              <View style={{ flex: 1 }}>
                <RangeBar
                  width="100%"
                  height={10}
                  pct={s.pct}
                  trackColor={onDark(0.12)}
                  fillColor={s.fast ? colors.accent : onDark(0.45)}
                />
              </View>
              <MonoText size={10.5} spaced={false} color={colors.textOnDark} style={{ width: 44, textAlign: 'right' }}>
                {s.pace}
              </MonoText>
            </View>
          ))}
        </View>
        <SansText size={12.5} color={colors.textOnDarkSecondary} style={{ marginTop: spacing.md, lineHeight: 19 }}>
          Exactly the shape we planned: patient to 10K, pressed from 16. HR never left threshold until the last 3 km.
        </SansText>
      </Card>

      {/* learnings */}
      <View style={{ gap: 9 }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          What the coach learned
        </MonoText>
        {raceLearningDefs.map((l, i) => (
          <ExpandableRow
            key={l.title}
            isOpen={openLearning === i}
            onPress={() => toggleOpenLearning(i)}
            leading={<View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />}
            title={l.title}
          >
            <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 21, paddingLeft: 20 }}>
              {l.detail}
            </SansText>
          </ExpandableRow>
        ))}
      </View>

      {/* recovery week */}
      <Card tone="muted" radius={radii.md} style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
        <SansText size={12.5} color={colors.textSecondary} style={{ lineHeight: 20 }}>
          <MonoText size={9.5} color={colors.primary}>
            next ·{' '}
          </MonoText>
          Recovery week loaded: no running until Thursday, easy spins only. Your next block proposal arrives Friday.
        </SansText>
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.md }}>
        <Pressable
          onPress={() => Share.share({ message: 'City Half Marathon — 1:32:41, a 3:12 personal best. Negative split ✓' })}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: colors.borderStrong,
            borderRadius: radii.pill,
            paddingVertical: 15,
            alignItems: 'center',
          }}
        >
          <SansText size={14} weight="bold">
            Share result
          </SansText>
        </Pressable>
        <Pressable
          onPress={() => router.push('/training-plan/block')}
          style={{ flex: 1, backgroundColor: colors.ink, borderRadius: radii.pill, paddingVertical: 15, alignItems: 'center' }}
        >
          <SansText size={14} weight="extrabold" color={colors.textOnDark}>
            Plan next race
          </SansText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
