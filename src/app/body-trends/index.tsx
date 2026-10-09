import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SegmentedTabs, Card, SerifText, MonoText, SansText, Sparkline } from '@/components/ui';
import { colors, radii, spacing } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { bodyTrendRangeNames, bodyMetricDefs } from '@/data/mock';

export default function BodyTrendsScreen() {
  const bodyRange = useAppStore((s) => s.bodyRange);
  const setBodyRange = useAppStore((s) => s.setBodyRange);
  const bodyMetric = useAppStore((s) => s.bodyMetric);
  const setBodyMetric = useAppStore((s) => s.setBodyMetric);

  const activeMetric = bodyMetricDefs[bodyMetric];
  const rangeSlice = bodyRange === 0 ? 8 : bodyRange === 1 ? 12 : 16;
  const curve = activeMetric.curve.slice(16 - rangeSlice);
  const axisStart = bodyRange === 0 ? 'WK 24' : bodyRange === 1 ? 'WK 16' : 'FEB';

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <SerifText size={28}>Body</SerifText>
        <SegmentedTabs
          segments={bodyTrendRangeNames.map((n, i) => ({ label: n, onPress: () => setBodyRange(i) }))}
          activeIndex={bodyRange}
        />
      </View>

      {/* headline */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
          <SerifText size={52}>{activeMetric.headline}</SerifText>
          <MonoText size={11} color={colors.primary} upper={false} spaced={false}>
            {activeMetric.hDelta}
          </MonoText>
        </View>
        <SansText size={13} color={colors.textSecondary} style={{ marginTop: 6, lineHeight: 19.5 }}>
          {activeMetric.hNote}
        </SansText>
      </View>

      {/* chart */}
      <Card tone="muted" radius={radii.lg} style={{ gap: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textMuted}>
            {activeMetric.chartLabel}
          </MonoText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: colors.trackAlt }} />
              <MonoText size={8.5} color={colors.textMuted}>
                DAILY
              </MonoText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: colors.primary }} />
              <MonoText size={8.5} color={colors.textMuted}>
                7-DAY TREND
              </MonoText>
            </View>
          </View>
        </View>
        <View style={{ height: 96, marginTop: 16 }}>
          <Sparkline values={curve} width={310} height={96} color={colors.primary} filled dotAtEnd />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <MonoText size={8.5} color={colors.textMuted}>
            {axisStart}
          </MonoText>
          <MonoText size={8.5} color={colors.textMuted}>
            TODAY
          </MonoText>
        </View>
      </Card>

      {/* metric rows */}
      <View style={{ gap: 9 }}>
        {bodyMetricDefs.map((m, i) => {
          const active = i === bodyMetric;
          const deltaColor = m.good === true ? colors.primary : colors.textMuted;
          return (
            <Pressable
              key={m.name}
              onPress={() => setBodyMetric(i)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: colors.screen,
                borderWidth: 1.5,
                borderColor: active ? colors.borderStrong : colors.border,
                borderRadius: radii.md + 2,
                paddingVertical: 14,
                paddingHorizontal: 16,
                minHeight: 44,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: active ? colors.primary : colors.track,
                }}
              />
              <View style={{ flex: 1 }}>
                <SansText size={14} weight="bold">
                  {m.name}
                </SansText>
                <MonoText size={11.5} color={colors.textMuted} upper={false} spaced={false} style={{ marginTop: 2 }}>
                  {m.source}
                </MonoText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <SansText size={15} weight="extrabold">
                  {m.val}
                </SansText>
                <MonoText size={9.5} color={deltaColor} style={{ marginTop: 2 }}>
                  {m.delta}
                </MonoText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* coach's read */}
      <Card tone="dark" radius={radii.lg}>
        <MonoText size={9.5} color={colors.textOnDarkSecondary}>
          Coach's read
        </MonoText>
        <SansText size={13.5} color={colors.textOnDark} style={{ marginTop: 8, lineHeight: 20.8 }}>
          Scale is down 4.1 kg but power is flat and lean mass held — this is a clean cut, not a slow starve. Two more
          weeks at this rate, then we hold for race prep.
        </SansText>
      </Card>

      <Pressable
        onPress={() => router.push('/body-trends/weigh-in')}
        style={{
          alignSelf: 'center',
          paddingVertical: 6,
        }}
      >
        <SansText size={13} weight="bold" color={colors.primary}>
          Log a new weigh-in
        </SansText>
      </Pressable>
    </ScreenContainer>
  );
}
