import { View, Pressable, Share } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, BarChart, ExpandableRow } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { filmstripLabels, bodyFatHeights, milestoneDefs } from '@/data/mock';

export default function TwelveWeekReport() {
  const openMilestone = useAppStore((s) => s.openMilestone);
  const toggleMilestone = useAppStore((s) => s.toggleMilestone);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
      <View>
        <MonoText size={10}>Body report · 12 weeks</MonoText>
        <SerifText size={34} style={{ marginTop: spacing.md, lineHeight: 40 }}>
          The photos agree with the scale.
        </SerifText>
        <SansText size={14} color={colors.textSecondary} style={{ marginTop: spacing.sm, lineHeight: 22 }}>
          −4.1 kg on the scale, and the AI sees it where it counts: waist down, shoulders holding, legs unchanged.
        </SansText>
      </View>

      {/* filmstrip */}
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {filmstripLabels.map((label, i) => {
          const latest = i === filmstripLabels.length - 1;
          return (
            <View key={label} style={{ flex: 1, alignItems: 'center' }}>
              <View
                style={{
                  height: 84,
                  alignSelf: 'stretch',
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: latest ? colors.primary : colors.border,
                  backgroundColor: colors.cardFlat,
                }}
              />
              <MonoText size={8} color={latest ? colors.primary : colors.textMuted} style={{ marginTop: spacing.xs }}>
                {label}
              </MonoText>
            </View>
          );
        })}
      </View>

      {/* body fat trend */}
      <Card tone="dark">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            Est. body fat
          </MonoText>
          <MonoText size={10} spaced={false} color={colors.accent}>
            16.8% → 14.2%
          </MonoText>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <BarChart
            height={64}
            gap={5}
            radius={3}
            absolute
            bars={bodyFatHeights.map((h, i) => ({ h, color: i === bodyFatHeights.length - 1 ? colors.accent : onDark(0.25) }))}
          />
        </View>
        <SansText size={12.5} color={colors.textOnDarkSecondary} style={{ marginTop: spacing.md, lineHeight: 19 }}>
          Lean mass held at 66.9 ±0.3 kg the whole cut — the strength work is doing its job.
        </SansText>
      </Card>

      {/* milestones */}
      <View style={{ gap: 9 }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          Milestones
        </MonoText>
        {milestoneDefs.map((ms, i) => (
          <ExpandableRow
            key={ms.title}
            isOpen={openMilestone === i}
            onPress={() => toggleMilestone(i)}
            leading={<View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />}
            title={ms.title}
            trailing={<MonoText size={9.5}>{ms.week}</MonoText>}
          >
            <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 20, paddingLeft: 20 }}>
              {ms.detail}
            </SansText>
          </ExpandableRow>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.md }}>
        <Pressable
          onPress={() =>
            Share.share({ message: '12-week body report: −4.1 kg, est. body fat 16.8% → 14.2%, lean mass held. Photos agree with the scale.' })
          }
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
            Share with coach
          </SansText>
        </Pressable>
        <Pressable
          onPress={() => router.dismissTo('/(tabs)/body')}
          style={{ flex: 1, backgroundColor: colors.ink, borderRadius: radii.pill, paddingVertical: 15, alignItems: 'center' }}
        >
          <SansText size={14} weight="extrabold" color={colors.textOnDark}>
            Done
          </SansText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
