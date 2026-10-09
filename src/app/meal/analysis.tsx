import { useEffect, useMemo, useState } from 'react';
import { View, Pressable, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { MonoText, SansText, SerifText, ScreenContainer } from '@/components/ui';
import { colors, radii, spacing } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { mealItemDefs, portionSizeMult, portionSizeLabels } from '@/data/mock';
import { analyzeMealPhoto, MealAnalysis } from '@/services/claude';

interface ItemBase {
  name: string;
  baseG: number;
  baseKcal: number;
  baseP: number;
  note: string;
}

/** 5b — AI reads the plate: portion-adjustable item list computed from mealItemDefs/store.portions (or a live vision result). */
export default function MealAnalysisScreen() {
  const lastPhotoBase64 = useAppStore((s) => s.lastPhotoBase64);
  const portions = useAppStore((s) => s.portions);
  const cyclePortion = useAppStore((s) => s.cyclePortion);

  const [loading, setLoading] = useState(!!lastPhotoBase64);
  const [aiResult, setAiResult] = useState<MealAnalysis | null>(null);

  useEffect(() => {
    if (!lastPhotoBase64) return;
    let cancelled = false;
    setLoading(true);
    analyzeMealPhoto(lastPhotoBase64).then((result) => {
      if (cancelled) return;
      setAiResult(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemBases: ItemBase[] = useMemo(() => {
    if (aiResult && aiResult.items.length > 0) {
      return aiResult.items.map((it) => ({
        name: it.name,
        baseG: it.grams,
        baseKcal: it.kcal,
        baseP: it.proteinG,
        note: '',
      }));
    }
    return mealItemDefs.map((d) => ({ name: d.name, baseG: d.baseG, baseKcal: d.baseKcal, baseP: d.baseP, note: d.note }));
  }, [aiResult]);

  const confidencePct = aiResult ? Math.round(aiResult.confidencePct) : 93;

  let mealTotal = 0;
  let mealProtein = 0;
  const mealItems = itemBases.map((d, i) => {
    const sz = portions[i] ?? 1;
    const mult = portionSizeMult[sz];
    const kcal = Math.round(d.baseKcal * mult);
    const grams = Math.round(d.baseG * mult);
    const prot = Math.round(d.baseP * mult);
    mealTotal += kcal;
    mealProtein += prot;
    return { name: d.name, grams, kcal, prot, sz };
  });

  const onLog = () => router.push('/meal/logged');

  return (
    <ScreenContainer tone="screen" contentStyle={{ paddingTop: spacing.xl, gap: 0 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <MonoText size={10} color={colors.textMuted}>Lunch · 12:38</MonoText>
        <View style={{ borderWidth: 1, borderColor: colors.primary, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: 12 }}>
          <MonoText size={10} color={colors.primary}>AI · {confidencePct}% SURE</MonoText>
        </View>
      </View>

      {/* photo strip */}
      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, alignItems: 'center' }}>
        {lastPhotoBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${lastPhotoBase64}` }}
            style={{ width: 96, height: 96, borderRadius: radii.lg, backgroundColor: colors.cardFlat }}
          />
        ) : (
          <View style={{ width: 96, height: 96, borderRadius: radii.lg, backgroundColor: colors.cardFlat, alignItems: 'center', justifyContent: 'center' }}>
            <MonoText size={8} color={colors.textMuted} style={{ textAlign: 'center' }}>meal{'\n'}photo</MonoText>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <SerifText size={24} weight="medium" color={colors.textPrimary}>Chicken rice bowl</SerifText>
          <SansText size={13} color={colors.textSecondary} style={{ marginTop: 4 }}>
            {loading ? 'AI analyzing…' : `${mealItems.length} items detected · tap any to resize`}
          </SansText>
        </View>
      </View>

      {loading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl * 1.5, gap: spacing.md }}>
          <ActivityIndicator color={colors.primary} />
          <MonoText size={10} color={colors.textMuted}>AI analyzing…</MonoText>
        </View>
      ) : (
        <>
          {/* detected items */}
          <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
            {mealItems.map((it, i) => (
              <Pressable
                key={i}
                onPress={() => cyclePortion(i)}
                style={{ backgroundColor: colors.screen, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.lg, paddingVertical: 15, paddingHorizontal: 18 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ flex: 1 }}>
                    <SansText size={15} weight="bold" color={colors.textPrimary}>{it.name}</SansText>
                    <MonoText size={12} color={colors.textMuted} upper={false} spaced={false} style={{ marginTop: 2 }}>
                      {it.grams} g · {it.prot} g protein
                    </MonoText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <SerifText size={20} color={colors.textPrimary}>{it.kcal}</SerifText>
                    <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                      {portionSizeLabels.map((label, idx) => {
                        const active = idx === it.sz;
                        return (
                          <View
                            key={label}
                            style={{
                              paddingVertical: 3,
                              paddingHorizontal: 7,
                              borderRadius: radii.pill,
                              backgroundColor: active ? colors.ink : colors.cardMutedAlt,
                            }}
                          >
                            <MonoText size={8.5} color={active ? colors.textOnDark : colors.textMuted}>{label}</MonoText>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
            <View style={{ borderWidth: 1.5, borderColor: colors.trackStrong, borderStyle: 'dashed', borderRadius: radii.lg, paddingVertical: 13, alignItems: 'center' }}>
              <SansText size={13} color={colors.textMuted}>+ add something I missed</SansText>
            </View>
          </View>

          {/* total */}
          <View
            style={{
              backgroundColor: colors.ink,
              borderRadius: radii.xl,
              paddingVertical: 18,
              paddingHorizontal: 20,
              marginTop: spacing.lg,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <MonoText size={9.5} color={colors.textOnDarkSecondary}>Meal total</MonoText>
              <SerifText size={28} color={colors.textOnDark} style={{ marginTop: 2 }}>{mealTotal.toLocaleString()} kcal</SerifText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <MonoText size={10.5} color={colors.textOnDarkSecondary} style={{ textAlign: 'right', lineHeight: 17 }}>
                {mealProtein} g protein{'\n'}fits today's budget
              </MonoText>
            </View>
          </View>

          <View style={{ paddingVertical: spacing.lg }}>
            <Pressable onPress={onLog} style={{ backgroundColor: colors.primary, borderRadius: radii.pill, paddingVertical: 16, alignItems: 'center' }}>
              <SansText size={15} weight="extrabold" color={colors.textOnDark}>Log this meal</SansText>
            </Pressable>
          </View>
        </>
      )}
    </ScreenContainer>
  );
}
