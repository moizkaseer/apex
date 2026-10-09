import { View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SerifText, SansText, MonoText } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { raceCheckDefs } from '@/data/mock';

const stats = [
  { val: '4:25', label: 'GOAL /KM', color: colors.textOnDark },
  { val: '1:33:10', label: 'TARGET', color: colors.textOnDark },
  { val: '92', label: 'READINESS', color: colors.accent },
];

export default function RaceMorning() {
  const raceChecks = useAppStore((s) => s.raceChecks);
  const toggleRaceCheck = useAppStore((s) => s.toggleRaceCheck);
  const doneCount = raceCheckDefs.filter((_, i) => raceChecks[i]).length;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.inkBlack }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 26, paddingTop: spacing.xl, paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        <MonoText size={10} color={colors.textOnDarkMuted}>
          Sunday · Sept 6 · Race day
        </MonoText>
        <SerifText size={32} color={colors.textOnDark} style={{ marginTop: spacing.sm, lineHeight: 37 }}>
          City Half Marathon.
        </SerifText>

        {/* countdown */}
        <View style={{ alignItems: 'center', paddingTop: 26, paddingBottom: spacing.xl }}>
          <MonoText size={10} color={colors.textOnDarkMuted}>
            Gun in
          </MonoText>
          <SerifText size={66} color={colors.textOnDark} style={{ lineHeight: 74 }}>
            1:47
          </SerifText>
          <View style={{ flexDirection: 'row', gap: 18, marginTop: spacing.sm }}>
            {stats.map((s) => (
              <View key={s.label} style={{ alignItems: 'center' }}>
                <SansText size={15} weight="extrabold" color={s.color}>
                  {s.val}
                </SansText>
                <MonoText size={8.5} color={colors.textOnDarkMuted}>
                  {s.label}
                </MonoText>
              </View>
            ))}
          </View>
        </View>

        {/* checklist */}
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2, paddingBottom: 4 }}>
            <MonoText size={10} color={colors.textOnDarkMuted}>
              The plan until the gun
            </MonoText>
            <MonoText size={10} color={colors.accent}>
              {doneCount} / {raceCheckDefs.length}
            </MonoText>
          </View>
          {raceCheckDefs.map((c, i) => {
            const done = !!raceChecks[i];
            return (
              <Pressable
                key={c.name}
                onPress={() => toggleRaceCheck(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: done ? colors.inkRaised : colors.inkDeep,
                  borderWidth: 1.5,
                  borderColor: done ? colors.inkRaised : onDark(0.14),
                  borderRadius: 16,
                  paddingVertical: 15,
                  paddingHorizontal: spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    borderWidth: 1.5,
                    borderColor: done ? colors.accent : onDark(0.35),
                    backgroundColor: done ? colors.accent : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {done ? (
                    <SansText size={13} color={colors.inkBlack}>
                      ✓
                    </SansText>
                  ) : null}
                </View>
                <View style={{ flex: 1 }}>
                  <SansText
                    size={14.5}
                    weight="bold"
                    color={done ? colors.textOnDarkMuted : colors.textOnDark}
                    style={{ textDecorationLine: done ? 'line-through' : 'none' }}
                  >
                    {c.name}
                  </SansText>
                  <SansText size={11.5} color={colors.textOnDarkMuted} style={{ marginTop: 2 }}>
                    {c.sub}
                  </SansText>
                </View>
                <MonoText size={10} spaced={false} color={colors.textOnDarkMuted}>
                  {c.time}
                </MonoText>
              </Pressable>
            );
          })}
        </View>

        {/* coach note */}
        <View style={{ backgroundColor: colors.inkRaised, borderRadius: 16, paddingVertical: 14, paddingHorizontal: spacing.lg, marginTop: 14 }}>
          <SansText size={12.5} color={colors.textOnDarkSecondary} style={{ lineHeight: 19 }}>
            <MonoText size={9.5} color={colors.accent}>
              coach ·{' '}
            </MonoText>
            12 weeks say you&rsquo;re ready. First 5K conservative — the race starts at km 16. See you at the finish.
          </SansText>
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: spacing.lg }}>
          <Pressable
            onPress={() => router.push('/race-day/debrief')}
            style={{ backgroundColor: colors.screen, borderRadius: radii.pill, paddingVertical: 17, alignItems: 'center' }}
          >
            <SansText size={15} weight="extrabold" color={colors.inkBlack}>
              Start race mode on Watch
            </SansText>
          </Pressable>
          <MonoText size={9} color={colors.textOnDarkMuted} style={{ textAlign: 'center', marginTop: spacing.sm }}>
            All nudges silenced until you finish
          </MonoText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
