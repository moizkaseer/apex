import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SerifText, SansText, MonoText, BarChart } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { sleepStageSeq, sleepNightMetrics } from '@/data/mock';

// stage codes: 3 = deep, 2 = REM, 1 = light/core — heights/colors per the design's hypnogram
const stageBar = (s: number) => ({
  h: s === 3 ? 64 : s === 2 ? 44 : 24,
  color: s === 3 ? colors.primary : s === 2 ? '#5b8c72' : onDark(0.28),
});

const stageLegend = [
  { color: colors.primary, label: 'DEEP 1:38' },
  { color: '#5b8c72', label: 'REM 1:54' },
  { color: onDark(0.28), label: 'CORE 4:10' },
];

const tonightStats = [
  { val: '8h 15m', label: 'TARGET' },
  { val: '21:30', label: 'WIND-DOWN' },
  { val: 'no caffeine 14:00+', label: 'RULE' },
];

export default function SleepDetail() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.inkBlack }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 26, paddingTop: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <MonoText size={10} color={colors.textOnDarkMuted}>
              Mon → Tue · via Apple Health
            </MonoText>
            <SerifText size={30} color={colors.textOnDark} style={{ marginTop: spacing.xs }}>
              7h 42m
            </SerifText>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.accent,
              borderRadius: radii.pill,
              paddingVertical: 5,
              paddingHorizontal: 12,
            }}
          >
            <MonoText size={10} color={colors.accent}>
              Quality 86
            </MonoText>
          </View>
        </View>

        {/* hypnogram */}
        <View style={{ backgroundColor: colors.inkRaised, borderRadius: radii.lg, paddingVertical: 18, paddingHorizontal: spacing.xl }}>
          <MonoText size={10} color={colors.textOnDarkMuted}>
            Stages · 22:41 – 6:28
          </MonoText>
          <View style={{ marginTop: spacing.lg }}>
            <BarChart height={74} gap={2} radius={2} absolute bars={sleepStageSeq.map(stageBar)} />
          </View>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: spacing.md }}>
            {stageLegend.map((l) => (
              <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: l.color }} />
                <MonoText size={8.5} color={colors.textOnDarkMuted}>
                  {l.label}
                </MonoText>
              </View>
            ))}
          </View>
        </View>

        {/* overnight metrics */}
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {sleepNightMetrics.map((m) => (
            <View key={m.name} style={{ flex: 1, backgroundColor: colors.inkRaised, borderRadius: radii.md, padding: 14 }}>
              <MonoText size={9} color={colors.textOnDarkMuted}>
                {m.name}
              </MonoText>
              <SansText size={17} weight="extrabold" color={colors.textOnDark} style={{ marginTop: 5 }}>
                {m.val}
              </SansText>
              <MonoText size={8.5} color={m.good ? colors.accent : colors.textOnDarkMuted} style={{ marginTop: 3 }}>
                {m.delta}
              </MonoText>
            </View>
          ))}
        </View>

        {/* what it means */}
        <View style={{ backgroundColor: colors.inkRaised, borderRadius: 16, paddingVertical: 14, paddingHorizontal: spacing.lg }}>
          <SansText size={12.5} color={colors.textOnDarkSecondary} style={{ lineHeight: 19 }}>
            <MonoText size={9.5} color={colors.accent}>
              read ·{' '}
            </MonoText>
            Deep sleep did its job after yesterday&rsquo;s intervals — HRV rebounded past baseline. This is what earned
            today&rsquo;s 82.
          </SansText>
        </View>

        {/* tonight's prescription */}
        <View style={{ backgroundColor: colors.screen, borderRadius: radii.lg, padding: spacing.xl }}>
          <MonoText size={10}>Tonight&rsquo;s prescription</MonoText>
          <SerifText size={22} style={{ marginTop: spacing.sm, lineHeight: 28 }}>
            In bed by 22:00 — squats today, tempo tomorrow.
          </SerifText>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: spacing.md }}>
            {tonightStats.map((s) => (
              <View key={s.label}>
                <SansText size={15} weight="extrabold">
                  {s.val}
                </SansText>
                <MonoText size={8.5}>{s.label}</MonoText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
