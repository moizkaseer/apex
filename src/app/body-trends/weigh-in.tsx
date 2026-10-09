import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, Card, SerifText, MonoText, SansText, Button, KeyValueRow, BarChart } from '@/components/ui';
import { colors, radii, spacing, fontFamily, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { weighWhyRows, morningWeighHeights } from '@/data/mock';

export default function WeighInScreen() {
  const whyOpen = useAppStore((s) => s.weighWhyOpen);
  const toggleWhy = useAppStore((s) => s.toggleWeighWhy);

  const morningBars = morningWeighHeights.map((h, i) => ({
    h,
    color: i === morningWeighHeights.length - 1 ? colors.warning : onDark(0.3),
  }));

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, flexGrow: 1 }}>
      <MonoText size={10} color={colors.textMuted}>
        Wed 6:52 · from smart scale
      </MonoText>

      {/* big number */}
      <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <SerifText size={76}>79.1</SerifText>
          <SansText size={16} color={colors.textMuted}>
            kg
          </SansText>
        </View>
        <MonoText size={11} color={colors.danger} style={{ marginTop: 10 }}>
          +0.7 KG VS YESTERDAY
        </MonoText>
      </View>

      {/* the reframe */}
      <Card tone="muted" radius={radii.lg}>
        <SerifText size={21} style={{ lineHeight: 27.3 }}>
          Ignore this one. Your trend is still falling.
        </SerifText>
        <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20.8, marginTop: 10, fontFamily: fontFamily.sans }}>
          Yesterday: 24 km long run + 340 g carbs to refuel. You're holding water and glycogen, not fat. The 7-day
          trend — the number that matters — is{' '}
          <Text style={{ fontFamily: fontFamily.sansExtrabold, color: colors.primary }}>78.3 kg, down 0.4 this week</Text>.
        </Text>

        {whyOpen ? (
          <View
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: colors.divider,
              gap: 8,
            }}
          >
            {weighWhyRows.map((w) => (
              <KeyValueRow key={w.k} label={w.k} value={w.v} />
            ))}
          </View>
        ) : null}

        <Text
          onPress={toggleWhy}
          style={{ fontSize: 13, fontFamily: fontFamily.sansExtrabold, color: colors.primary, marginTop: 14 }}
        >
          {whyOpen ? 'Hide the math ↑' : 'Why? Show the math →'}
        </Text>
      </Card>

      {/* trend strip */}
      <Card tone="dark" radius={radii.lg} style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            Last 14 mornings
          </MonoText>
          <MonoText size={10} color={colors.accent} upper={false} spaced={false}>
            TREND −0.4 / WK
          </MonoText>
        </View>
        <View style={{ marginTop: 14 }}>
          <BarChart bars={morningBars} height={52} gap={4} radius={2} absolute />
        </View>
      </Card>

      <View style={{ flex: 1 }} />

      <View style={{ flexDirection: 'row', gap: 12, paddingTop: 18 }}>
        <View style={{ flex: 1 }}>
          <Button label="Log a note" variant="outline" />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="Got it" variant="dark" onPress={() => router.back()} />
        </View>
      </View>
    </ScreenContainer>
  );
}
