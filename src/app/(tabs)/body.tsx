import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, BarChart, Button } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { bodyRangeData, bodyMeasurements, photoRows } from '@/data/mock';

const rangeNames = ['4W', '8W', '6M'];

export default function BodyScreen() {
  const bodyRange = useAppStore((s) => s.bodyRange);
  const setBodyRange = useAppStore((s) => s.setBodyRange);
  const photoOpen = useAppStore((s) => s.photoOpen);
  const togglePhoto = useAppStore((s) => s.togglePhoto);

  const rd = bodyRangeData[bodyRange];

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SerifText size={30}>Body</SerifText>
        <MonoText size={11}>goal 76.5 kg</MonoText>
      </View>

      {/* weight card */}
      <Card tone="muted">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10}>Weight · 8 weeks</MonoText>
          <View style={{ flexDirection: 'row', gap: spacing.xs }}>
            {rangeNames.map((n, i) => {
              const active = i === bodyRange;
              return (
                <Pressable
                  key={n}
                  onPress={() => setBodyRange(i)}
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: radii.pill,
                    backgroundColor: active ? colors.ink : colors.screen,
                  }}
                >
                  <MonoText size={9.5} color={active ? colors.textOnDark : colors.textMuted}>
                    {n}
                  </MonoText>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm }}>
          <SerifText size={34}>78.4</SerifText>
          <SansText size={13} color={colors.textSecondary}>
            kg
          </SansText>
          <MonoText size={10} color={colors.primary}>
            {rd.delta}
          </MonoText>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <BarChart
            height={72}
            gap={5}
            radius={4}
            absolute
            bars={rd.bars.map((h, i) => ({ h, color: i === rd.bars.length - 1 ? colors.primary : colors.track }))}
          />
        </View>
        <SansText size={12} color={colors.textMuted} style={{ marginTop: spacing.sm, lineHeight: 18 }}>
          Trend −0.23 kg/wk. Slow enough to hold strength — exactly the target band.
        </SansText>
        <Pressable onPress={() => router.push('/body-trends')} style={{ marginTop: spacing.md }}>
          <MonoText size={10} color={colors.textPrimary}>
            Full trends →
          </MonoText>
        </Pressable>
      </Card>

      {/* AI photo check-in */}
      <Card tone="dark" onPress={togglePhoto}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            AI photo check-in
          </MonoText>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            {photoOpen ? 'close' : 'tap for analysis'}
          </MonoText>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
          {[
            { label: 'wk 24 photo', caption: '4 WKS AGO', highlight: false },
            { label: 'wk 28 photo', caption: 'SUNDAY', highlight: true },
          ].map((p) => (
            <View key={p.label} style={{ flex: 1, alignItems: 'center' }}>
              <View
                style={{
                  height: 130,
                  alignSelf: 'stretch',
                  borderRadius: radii.md,
                  backgroundColor: onDark(0.06),
                  borderWidth: p.highlight ? 1 : 0,
                  borderColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MonoText size={8} color={colors.textOnDarkSecondary}>
                  {p.label}
                </MonoText>
              </View>
              <MonoText size={9.5} color={p.highlight ? colors.primary : colors.textOnDarkSecondary} style={{ marginTop: spacing.sm }}>
                {p.caption}
              </MonoText>
            </View>
          ))}
        </View>
        <SerifText size={19} color={colors.textOnDark} style={{ marginTop: spacing.lg }}>
          Leaner through the waist, delts up.
        </SerifText>
        {photoOpen ? (
          <View
            style={{
              marginTop: spacing.lg,
              paddingTop: spacing.lg,
              borderTopWidth: 1,
              borderTopColor: onDark(0.14),
              gap: 9,
            }}
          >
            {photoRows.map((r) => (
              <View key={r.k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SansText size={13} color={colors.textOnDark}>
                  {r.k}
                </SansText>
                <MonoText size={11} spaced={false} upper={false} color={colors.textOnDarkSecondary}>
                  {r.v}
                </MonoText>
              </View>
            ))}
            <View style={{ marginTop: spacing.xxs }}>
              <Button label="Take Sunday's photo now" variant="light" onPress={() => router.push('/progress-photo/capture')} />
            </View>
          </View>
        ) : null}
      </Card>

      {/* pro insight teaser (turn 11b locked-feature moment) */}
      <Card tone="muted" radius={radii.md} onPress={() => router.push('/paywall/locked')} style={{ paddingVertical: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SansText size={13} weight="semibold">
            ◆ Pro insight ready — wk 24 → 28 analysis
          </SansText>
          <MonoText size={10} color={colors.primary}>
            View →
          </MonoText>
        </View>
      </Card>

      {/* measurements */}
      <Card tone="muted" style={{ marginBottom: spacing.sm }}>
        <MonoText size={10}>Measurements · vs. block start</MonoText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
          {bodyMeasurements.map((m) => (
            <View
              key={m.name}
              style={{
                flexBasis: '47%',
                flexGrow: 1,
                backgroundColor: colors.screen,
                borderRadius: radii.md,
                paddingVertical: spacing.md,
                paddingHorizontal: 14,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <SansText size={13} weight="semibold">
                {m.name}
              </SansText>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
                <SerifText size={17}>{m.val}</SerifText>
                <MonoText size={9.5} spaced={false} color={m.good ? colors.primary : colors.textMuted}>
                  {m.delta}
                </MonoText>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </ScreenContainer>
  );
}
