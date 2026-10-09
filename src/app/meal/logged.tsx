import { View, Pressable } from 'react-native';
import { router } from 'expo-router';

import { MonoText, SansText, SerifText, ScreenContainer } from '@/components/ui';
import { colors, radii, spacing } from '@/theme/tokens';

/** 5c — logged confirmation: meal is in, daily budget updates, coach reacts. */
export default function MealLoggedScreen() {
  const onDone = () => router.replace('/(tabs)/fuel');

  return (
    <ScreenContainer tone="screen" contentStyle={{ paddingTop: spacing.xl, gap: 0 }}>
      <MonoText size={10} color={colors.primary}>● Logged · lunch · 12:39</MonoText>
      <SerifText size={34} weight="medium" color={colors.textPrimary} style={{ lineHeight: 39, marginTop: 12 }}>
        That closes the protein gap.
      </SerifText>
      <SansText size={14} color={colors.textSecondary} style={{ lineHeight: 22, marginTop: 8 }}>
        862 kcal logged in one photo. You're now on pace to land the day within 3% of target.
      </SansText>

      {/* updated budget */}
      <View style={{ backgroundColor: colors.cardMuted, borderRadius: radii.xl, padding: spacing.xl, marginTop: 22 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textMuted}>Day so far</MonoText>
          <MonoText size={10} color={colors.textMuted}>2,732 of 3,050 planned</MonoText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <SerifText size={34} weight="medium" color={colors.textPrimary}>318</SerifText>
          <SansText size={13} color={colors.textSecondary} style={{ flex: 1 }}>
            kcal left · dinner is planned at 780 → coach trimmed it to 318 + snack
          </SansText>
        </View>
        <View style={{ height: 8, borderRadius: radii.pill, backgroundColor: colors.track, marginTop: 14, overflow: 'hidden', flexDirection: 'row' }}>
          <View style={{ width: '61%', height: '100%', backgroundColor: colors.primary }} />
          <View style={{ width: '28%', height: '100%', backgroundColor: '#7fae94' }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <MonoText size={9} color={colors.textMuted}>earlier meals</MonoText>
          <MonoText size={9} color={colors.primary}>this meal</MonoText>
          <MonoText size={9} color={colors.textMuted}>remaining</MonoText>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <View style={{ flex: 1, backgroundColor: colors.screen, borderRadius: radii.md, padding: 12 }}>
            <MonoText size={9} color={colors.textMuted}>Protein</MonoText>
            <SansText size={15} weight="bold" color={colors.primary} style={{ marginTop: 4 }}>180 / 190g</SansText>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.screen, borderRadius: radii.md, padding: 12 }}>
            <MonoText size={9} color={colors.textMuted}>Carbs</MonoText>
            <SansText size={15} weight="bold" color={colors.textPrimary} style={{ marginTop: 4 }}>276 / 340g</SansText>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.screen, borderRadius: radii.md, padding: 12 }}>
            <MonoText size={9} color={colors.textMuted}>Fat</MonoText>
            <SansText size={15} weight="bold" color={colors.textPrimary} style={{ marginTop: 4 }}>71 / 85g</SansText>
          </View>
        </View>
      </View>

      {/* coach reaction */}
      <View style={{ backgroundColor: colors.cardMuted, borderRadius: radii.lg, paddingVertical: 14, paddingHorizontal: 16, marginTop: 14 }}>
        <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 20 }}>
          <MonoText size={10} color={colors.primary}>coach · </MonoText>
          Good timing after this morning's intervals. Keep dinner light — I'd go the salmon option and bank the rest for Saturday's long run.
        </SansText>
      </View>

      {/* save as favorite */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14, paddingBottom: 8 }}>
        <View style={{ flex: 1, borderWidth: 1.5, borderColor: colors.ink, borderRadius: radii.pill, paddingVertical: 13, alignItems: 'center' }}>
          <SansText size={13.5} weight="bold" color={colors.textPrimary}>☆ Save as favorite</SansText>
        </View>
        <View style={{ flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.pill, paddingVertical: 13, alignItems: 'center' }}>
          <SansText size={13.5} weight="bold" color={colors.textMuted}>Edit items</SansText>
        </View>
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingVertical: spacing.lg }}>
        <Pressable onPress={onDone} style={{ backgroundColor: colors.ink, borderRadius: radii.pill, paddingVertical: 16, alignItems: 'center' }}>
          <SansText size={15} weight="extrabold" color={colors.textOnDark}>Done</SansText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
