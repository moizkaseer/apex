import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, ExpandableRow, RangeBar } from '@/components/ui';
import { colors, spacing, radii } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { meals, fuelMacros } from '@/data/mock';

function dateLabel() {
  const d = new Date();
  return `${d.toLocaleDateString('en-US', { weekday: 'short' })} · ${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}`;
}

export default function FuelScreen() {
  const openMeal = useAppStore((s) => s.openMeal);
  const toggleOpenMeal = useAppStore((s) => s.toggleOpenMeal);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SerifText size={30}>Fuel</SerifText>
        <MonoText size={11}>{dateLabel()}</MonoText>
      </View>

      {/* daily budget */}
      <Card tone="muted">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10}>Today&rsquo;s budget</MonoText>
          <MonoText size={10} color={colors.primary}>
            +310 kcal · run bonus
          </MonoText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm }}>
          <SerifText size={34}>1,180</SerifText>
          <SansText size={13} color={colors.textSecondary}>
            kcal left of 3,050
          </SansText>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <RangeBar width="100%" pct={61} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          {fuelMacros.map((m) => (
            <View key={m.name} style={{ flex: 1, backgroundColor: colors.screen, borderRadius: radii.md, padding: spacing.md }}>
              <MonoText size={9}>{m.name}</MonoText>
              <SansText size={15} weight="bold" style={{ marginTop: 4 }}>
                {m.val}
              </SansText>
              <View style={{ marginTop: spacing.sm }}>
                <RangeBar width="100%" height={4} pct={m.pct} trackColor={colors.border} />
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* snap CTA */}
      <Card
        tone="dark"
        radius={radii.pill}
        padded={false}
        onPress={() => router.push('/meal/camera')}
        style={{ paddingVertical: 15, alignItems: 'center' }}
      >
        <SansText size={14} weight="bold" color={colors.textOnDark}>
          Snap a meal — AI logs it
        </SansText>
      </Card>

      {/* meals */}
      <View style={{ gap: spacing.sm }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          Meals today
        </MonoText>
        {meals.map((meal, i) => (
          <ExpandableRow
            key={meal.title}
            isOpen={openMeal === i}
            onPress={() => toggleOpenMeal(i)}
            leading={
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: radii.md,
                  backgroundColor: colors.cardFlat,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MonoText size={7.5}>{meal.slot}</MonoText>
              </View>
            }
            title={meal.title}
            subtitle={meal.sub}
            trailing={
              <View style={{ alignItems: 'flex-end' }}>
                <SerifText size={19}>{meal.kcal}</SerifText>
                <MonoText size={9} color={meal.good ? colors.primary : colors.textMuted}>
                  {meal.tag}
                </MonoText>
              </View>
            }
          >
            {meal.rows.map((r) => (
              <View key={r.k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SansText size={13}>{r.k}</SansText>
                <MonoText size={11.5} spaced={false} upper={false} color={colors.textSecondary}>
                  {r.v}
                </MonoText>
              </View>
            ))}
          </ExpandableRow>
        ))}
      </View>
    </ScreenContainer>
  );
}
