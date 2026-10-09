import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { colors, radii, spacing } from '@/theme/tokens';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SerifText, SansText, MonoText } from '@/components/ui/Text';
import { Pill } from '@/components/ui/Pill';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { KeyValueRow } from '@/components/ui/KeyValueRow';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { poseNames, poseData } from '@/data/mock';

/** Turn 6b — AI comparison: pose tabs, before/after placeholder pair, verdict + deltas. */
export default function Screen() {
  const ppPose = useAppStore((s) => s.ppPose);
  const setPpPose = useAppStore((s) => s.setPpPose);

  const pose = poseData[ppPose];

  return (
    <ScreenContainer tone="screen">
      <View style={styles.headerRow}>
        <MonoText size={10} color={colors.textMuted}>
          Wk 24 → Wk 28
        </MonoText>
        <Pill label="Pose match 98%" bg="transparent" color={colors.primary} size="sm" />
      </View>

      <SegmentedTabs
        segments={poseNames.map((name, i) => ({ label: name, onPress: () => setPpPose(i) }))}
        activeIndex={ppPose}
      />

      <View style={styles.photoRow}>
        <View style={styles.photoCol}>
          <View style={[styles.photoCard, styles.photoCardStriped]}>
            <MonoText size={8} color={colors.textMuted} style={{ textAlign: 'center' }}>
              {pose.label}
              {'\n'}wk 24
            </MonoText>
          </View>
          <MonoText size={9.5} color={colors.textMuted} style={{ marginTop: 8 }}>
            4 WKS AGO
          </MonoText>
        </View>
        <View style={styles.photoCol}>
          <View style={[styles.photoCard, styles.photoCardStriped, styles.photoCardActive]}>
            <MonoText size={8} color={colors.textMuted} style={{ textAlign: 'center' }}>
              {pose.label}
              {'\n'}wk 28
            </MonoText>
          </View>
          <MonoText size={9.5} color={colors.primary} style={{ marginTop: 8 }}>
            TODAY
          </MonoText>
        </View>
      </View>

      <SerifText size={23} weight="medium" style={styles.verdict}>
        {pose.verdict}
      </SerifText>

      <View style={styles.deltas}>
        {pose.deltas.map((d) => (
          <View key={d.k} style={styles.deltaRow}>
            <KeyValueRow
              label={d.k}
              value={d.v}
              valueColor={d.good === true ? colors.primary : colors.textMuted}
            />
          </View>
        ))}
        <MonoText size={9.5} color={colors.textMuted} spaced={false} style={styles.footnote}>
          Estimates from photos + scale data. Not medical measurements.
        </MonoText>
      </View>

      <Button label="See 12-week report" variant="dark" onPress={() => router.push('/progress-photo/report')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  photoRow: { flexDirection: 'row', gap: spacing.md },
  photoCol: { flex: 1, alignItems: 'center' },
  photoCard: {
    width: '100%',
    height: 250,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCardStriped: { backgroundColor: colors.cardFlat },
  photoCardActive: { borderWidth: 1.5, borderColor: colors.primary },
  verdict: { lineHeight: 29, marginTop: 4 },
  deltas: { gap: spacing.sm },
  deltaRow: { backgroundColor: colors.cardMuted, borderRadius: radii.md, paddingVertical: 12, paddingHorizontal: 16 },
  footnote: { lineHeight: 15, paddingHorizontal: 2, paddingTop: 4 },
});
