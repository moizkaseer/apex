import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, Button, BarChart, ExpandableRow } from '@/components/ui';
import { colors, spacing, radii } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { whyDefs } from '@/data/mock';

export default function WhyPanel() {
  const openWhy = useAppStore((s) => s.openWhy);
  const toggleOpenWhy = useAppStore((s) => s.toggleOpenWhy);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
      <View>
        <MonoText size={10}>Behind this advice</MonoText>
        <SerifText size={28} style={{ marginTop: spacing.sm, lineHeight: 34 }}>
          &ldquo;Move the long run to Sunday.&rdquo;
        </SerifText>
        <SansText size={13.5} color={colors.textSecondary} style={{ marginTop: spacing.sm, lineHeight: 21 }}>
          Every recommendation shows its work. The coach weighed these four signals:
        </SansText>
      </View>

      <View style={{ gap: spacing.sm }}>
        {whyDefs.map((w, i) => {
          const isOpen = openWhy === i;
          return (
            <ExpandableRow
              key={w.title}
              isOpen={isOpen}
              onPress={() => toggleOpenWhy(i)}
              leading={
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isOpen ? colors.ink : colors.cardMuted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MonoText size={10} weight="semibold" color={isOpen ? colors.textOnDark : colors.textMuted}>
                    {w.initials}
                  </MonoText>
                </View>
              }
              title={w.title}
              subtitle={w.sub}
              trailing={
                <MonoText size={9} color={w.weightLabel === 'WEIGHT HIGH' ? colors.primary : colors.textMuted}>
                  {w.weightLabel}
                </MonoText>
              }
            >
              <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 21 }}>
                {w.detail}
              </SansText>
              <View style={{ marginTop: spacing.md }}>
                <BarChart
                  height={36}
                  gap={4}
                  radius={3}
                  absolute
                  bars={w.heights.map((h, j) => ({ h, color: j === w.heights.length - 1 ? w.accent : colors.cardFlat }))}
                />
              </View>
              <MonoText size={9} style={{ marginTop: spacing.xs }}>
                {w.barCaption}
              </MonoText>
            </ExpandableRow>
          );
        })}
      </View>

      <Card tone="muted" radius={radii.md} style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
        <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 21 }}>
          <MonoText size={10} color={colors.primary}>
            principle ·{' '}
          </MonoText>
          Never delete the key session. Move it, protect what&rsquo;s around it, and keep the week&rsquo;s intent intact.
        </SansText>
      </Card>

      <View style={{ paddingVertical: spacing.lg }}>
        <Button label="Back to chat" variant="dark" onPress={() => router.back()} />
      </View>
    </ScreenContainer>
  );
}
