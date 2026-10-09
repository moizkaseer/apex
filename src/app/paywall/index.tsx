import { useEffect, useState } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import type { PurchasesOffering } from 'react-native-purchases';
import { ScreenContainer, SerifText, SansText, MonoText, MonoText as Mono, Button } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { pwHooks, tierDefs } from '@/data/mock';
import { purchases } from '@/services';

export default function Paywall() {
  const pwTier = useAppStore((s) => s.pwTier);
  const setPwTier = useAppStore((s) => s.setPwTier);
  const pwAnnual = useAppStore((s) => s.pwAnnual);
  const setPwAnnual = useAppStore((s) => s.setPwAnnual);

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    // Real store products load when RevenueCat keys are configured; the
    // designed tier copy/prices stand in until then.
    purchases.initPurchases().then(() => purchases.fetchOfferings().then(setOffering));
  }, []);

  async function startTrial() {
    if (!purchases.isPurchasesConfigured() || !offering) {
      Alert.alert(
        'Purchases not configured',
        'Add EXPO_PUBLIC_REVENUECAT_IOS_KEY and store products to enable the real checkout. Selection saved for the demo.',
      );
      router.back();
      return;
    }
    const wantAnnual = pwAnnual;
    const pkg =
      offering.availablePackages.find((p) =>
        wantAnnual ? p.packageType === 'ANNUAL' : p.packageType === 'MONTHLY',
      ) ?? offering.availablePackages[0];
    if (!pkg) return;
    setBuying(true);
    const info = await purchases.purchase(pkg);
    setBuying(false);
    if (info) router.back();
  }

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xl, gap: spacing.lg, flexGrow: 1 }}>
      <Pressable onPress={() => router.back()} style={{ alignSelf: 'flex-end', padding: spacing.xs }}>
        <MonoText size={12}>✕</MonoText>
      </Pressable>

      {/* personal hook */}
      <View>
        <MonoText size={10}>Based on your last 4 weeks</MonoText>
        <SerifText size={30} style={{ marginTop: spacing.sm, lineHeight: 36 }}>
          Your data already knows what&rsquo;s holding you back.
        </SerifText>
      </View>

      <View style={{ gap: spacing.sm }}>
        {pwHooks.map((h) => (
          <View
            key={h.tag}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              backgroundColor: colors.cardMuted,
              borderRadius: radii.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
            <SansText size={13} style={{ flex: 1, lineHeight: 19 }}>
              {h.text}
            </SansText>
            <MonoText size={8.5}>{h.tag}</MonoText>
          </View>
        ))}
      </View>

      {/* billing toggle */}
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', backgroundColor: colors.cardMuted, borderRadius: radii.pill, padding: 4 }}>
          {[
            { label: 'ANNUAL · −33%', annual: true },
            { label: 'MONTHLY', annual: false },
          ].map((opt) => {
            const active = pwAnnual === opt.annual;
            return (
              <Pressable
                key={opt.label}
                onPress={() => setPwAnnual(opt.annual)}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.lg,
                  borderRadius: radii.pill,
                  backgroundColor: active ? colors.ink : 'transparent',
                }}
              >
                <Mono size={10} color={active ? colors.textOnDark : colors.textMuted}>
                  {opt.label}
                </Mono>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* tiers */}
      <View style={{ gap: spacing.sm }}>
        {tierDefs.map((t, i) => {
          const sel = pwTier === i;
          const fg = sel ? colors.textOnDark : colors.textPrimary;
          const subColor = sel ? colors.textOnDarkSecondary : colors.textMuted;
          return (
            <Pressable key={t.name} onPress={() => setPwTier(i)}>
              <View
                style={{
                  backgroundColor: sel ? colors.ink : colors.screen,
                  borderWidth: 1.5,
                  borderColor: sel ? colors.borderStrong : colors.border,
                  borderRadius: radii.lg,
                  paddingVertical: 18,
                  paddingHorizontal: spacing.xl,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <SansText size={16} weight="extrabold" color={fg}>
                        {t.name}
                      </SansText>
                      {t.flagged ? (
                        <View
                          style={{
                            backgroundColor: colors.primary,
                            borderRadius: radii.pill,
                            paddingVertical: 3,
                            paddingHorizontal: spacing.sm,
                          }}
                        >
                          <MonoText size={8} color={colors.textOnDark}>
                            Most athletes
                          </MonoText>
                        </View>
                      ) : null}
                    </View>
                    <SansText size={12} color={subColor} style={{ marginTop: 3 }}>
                      {t.sub}
                    </SansText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <SansText size={20} weight="extrabold" color={fg}>
                      {pwAnnual ? t.priceA : t.priceM}
                    </SansText>
                    <MonoText size={8.5} color={subColor}>
                      {pwAnnual ? '/ MO · BILLED YEARLY' : '/ MONTH'}
                    </MonoText>
                  </View>
                </View>
                {sel ? (
                  <View
                    style={{
                      marginTop: spacing.lg,
                      paddingTop: spacing.md,
                      borderTopWidth: 1,
                      borderTopColor: sel ? onDark(0.16) : colors.border,
                      gap: 7,
                    }}
                  >
                    {t.features.map((f) => (
                      <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <MonoText size={10} color={colors.accent} spaced={false}>
                          ✓
                        </MonoText>
                        <SansText size={13} color={fg}>
                          {f}
                        </SansText>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingBottom: spacing.md, gap: spacing.sm }}>
        <Button label={`Start free trial · ${tierDefs[pwTier].name}`} variant="dark" loading={buying} onPress={startTrial} />
        <SansText size={11.5} color={colors.textMuted} style={{ textAlign: 'center' }}>
          7-day free trial · cancel anytime · your data stays yours
        </SansText>
      </View>
    </ScreenContainer>
  );
}
