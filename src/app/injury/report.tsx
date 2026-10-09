import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, MonoText, SansText, KeyValueRow } from '@/components/ui';
import { colors, onDark, radii, spacing } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { injuryZoneNames, severityDefs, nigLevelDefs } from '@/data/mock';

/**
 * Turn 15a — niggle report. Body-zone + severity picker whose plan-reaction card
 * recomputes instantly from `nigLevelDefs`.
 * Source: Fitness Dashboard Options.dc.html lines 289-361 (markup), 3148-3198 (logic).
 */
export default function NiggleReportScreen() {
  const nigZone = useAppStore((s) => s.nigZone);
  const setNigZone = useAppStore((s) => s.setNigZone);
  const nigSev = useAppStore((s) => s.nigSev);
  const setNigSev = useAppStore((s) => s.setNigSev);

  const [applied, setApplied] = useState(false);

  const level = nigLevelDefs(injuryZoneNames[nigZone].toLowerCase())[nigSev];
  const toneColor: Record<'good' | 'warn' | 'danger', string> = {
    good: colors.accent,
    warn: colors.warning,
    danger: colors.danger,
  };
  const changeToneColor: Record<'good' | 'warn' | 'danger' | 'neutral', string> = {
    good: colors.accent,
    warn: colors.warning,
    danger: colors.danger,
    neutral: colors.textOnDarkSecondary,
  };

  const zoneRows: string[][] = [];
  for (let i = 0; i < injuryZoneNames.length; i += 3) zoneRows.push(injuryZoneNames.slice(i, i + 3));

  const onApply = () => {
    setApplied(true);
    if (router.canGoBack()) router.back();
  };

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl }}>
      <View>
        <MonoText size={10}>Something feel off?</MonoText>
        <SerifText size={28} weight="medium" style={{ marginTop: 8, lineHeight: 34 }}>
          Where is it?
        </SerifText>
      </View>

      {/* body zones */}
      <View style={{ gap: 8 }}>
        {zoneRows.map((row, ri) => (
          <View key={ri} style={{ flexDirection: 'row', gap: 8 }}>
            {row.map((name, ci) => {
              const idx = ri * 3 + ci;
              const sel = nigZone === idx;
              return (
                <Pressable
                  key={name}
                  onPress={() => setNigZone(idx)}
                  style={{
                    flex: 1,
                    minHeight: 44,
                    backgroundColor: sel ? colors.ink : colors.screen,
                    borderWidth: 1.5,
                    borderColor: sel ? colors.ink : colors.border,
                    borderRadius: radii.md,
                    paddingVertical: 13,
                    paddingHorizontal: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SansText size={12.5} weight="bold" color={sel ? colors.textOnDark : colors.textPrimary} style={{ textAlign: 'center' }}>
                    {name}
                  </SansText>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* severity */}
      <View>
        <MonoText size={10} style={{ marginBottom: 8 }}>
          How bad, during yesterday&rsquo;s run?
        </MonoText>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {severityDefs.map((s, i) => {
            const sel = nigSev === i;
            return (
              <Pressable
                key={s.name}
                onPress={() => setNigSev(i)}
                style={{
                  flex: 1,
                  backgroundColor: sel ? colors.ink : colors.screen,
                  borderWidth: 1.5,
                  borderColor: sel ? colors.ink : colors.border,
                  borderRadius: radii.md,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  alignItems: 'center',
                }}
              >
                <SansText size={13} weight="extrabold" color={sel ? colors.textOnDark : colors.textPrimary}>
                  {s.name}
                </SansText>
                <MonoText
                  size={10.5}
                  spaced={false}
                  upper={false}
                  color={sel ? colors.textOnDarkSecondary : colors.textMuted}
                  style={{ marginTop: 2, textAlign: 'center' }}
                >
                  {s.sub}
                </MonoText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* plan reaction */}
      <View style={{ backgroundColor: colors.ink, borderRadius: radii.xl, padding: spacing.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            Plan reaction · instant
          </MonoText>
          <MonoText size={10} spaced={false} upper color={toneColor[level.tone]}>
            {level.badge}
          </MonoText>
        </View>
        <SerifText size={21} weight="medium" color={colors.textOnDark} style={{ marginTop: 10, lineHeight: 27 }}>
          {level.verdict}
        </SerifText>
        <View
          style={{
            gap: 8,
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: onDark(0.14),
          }}
        >
          {level.changes.map((c) => (
            <KeyValueRow key={c.k} label={c.k} value={c.v} valueColor={changeToneColor[c.tone]} dark />
          ))}
        </View>
        <SansText size={12} color={colors.textOnDarkSecondary} style={{ marginTop: 12, lineHeight: 18 }}>
          {level.note}
        </SansText>
        <Pressable onPress={() => router.push('/injury/protocol')} style={{ marginTop: 14, alignSelf: 'flex-start' }}>
          <MonoText size={10} color={colors.accent}>
            View return-to-run protocol →
          </MonoText>
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <Pressable
          onPress={() => router.push('/coach-chat')}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: colors.ink,
            borderRadius: radii.pill,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SansText size={14} weight="bold" color={colors.textPrimary}>
            Talk to coach
          </SansText>
        </Pressable>
        <Pressable
          onPress={onApply}
          style={{
            flex: 1,
            backgroundColor: colors.ink,
            borderRadius: radii.pill,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SansText size={14} weight="extrabold" color={colors.textOnDark}>
            {applied ? 'Applied ✓' : 'Apply changes'}
          </SansText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
