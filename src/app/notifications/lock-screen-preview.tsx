import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { MonoText, SansText } from '@/components/ui';
import { colors, radii, spacing, onDark } from '@/theme/tokens';
import { lockScreenNudges } from '@/data/mock';

/**
 * 12a — Lock-screen nudges: a visual preview of how the coach's nudges land on the
 * lock screen. This is a mockup (stacked notification cards over a fake lock-screen
 * clock), not a real OS notification — the real controls live at /notifications/settings.
 */
export default function LockScreenPreviewScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.inkDeep }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.md }}>
        <MonoText size={10} color={colors.textOnDarkMuted}>Preview · not a real notification</MonoText>
        <Pressable onPress={() => router.back()}>
          <MonoText size={10} color={colors.textOnDarkMuted}>close</MonoText>
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, gap: 10 }}>
        <View style={{ alignItems: 'center', paddingVertical: 12, paddingBottom: 18 }}>
          <SansText size={15} weight="semibold" color={onDark(0.7)}>
            Tuesday, July 14
          </SansText>
          <SansText size={68} weight="regular" color={colors.textOnDark} style={{ letterSpacing: -1.3, lineHeight: 68, marginTop: 2 }}>
            21:44
          </SansText>
        </View>

        {lockScreenNudges.map((n, i) => (
          <View
            key={i}
            style={{
              backgroundColor: onDark(0.14),
              borderRadius: 18,
              padding: 14,
              paddingHorizontal: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: colors.ink,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MonoText size={9} weight="semibold" spaced={false} color={colors.textOnDark}>
                  AX
                </MonoText>
              </View>
              <SansText size={12.5} weight="bold" color={colors.textOnDark} style={{ flex: 1 }}>
                {n.title}
              </SansText>
              <MonoText size={10} spaced={false} color={onDark(0.55)}>
                {n.time}
              </MonoText>
            </View>
            <SansText size={13.5} color={onDark(0.92)} style={{ lineHeight: 20, marginTop: 8 }}>
              {n.body}
            </SansText>
            {n.hasActions && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <View style={{ flex: 1, backgroundColor: onDark(0.18), borderRadius: radii.pill, paddingVertical: 9, alignItems: 'center' }}>
                  <SansText size={12.5} weight="bold" color={colors.textOnDark}>
                    {n.action1}
                  </SansText>
                </View>
                <View style={{ flex: 1, backgroundColor: onDark(0.18), borderRadius: radii.pill, paddingVertical: 9, alignItems: 'center' }}>
                  <SansText size={12.5} weight="bold" color={colors.textOnDark}>
                    {n.action2}
                  </SansText>
                </View>
              </View>
            )}
          </View>
        ))}

        <MonoText size={9.5} color={onDark(0.4)} style={{ textAlign: 'center', paddingTop: 10 }}>
          5 OF 5 TODAY — BUDGET RESPECTED
        </MonoText>
      </View>

      <View style={{ paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, paddingTop: spacing.sm }}>
        <Pressable
          onPress={() => router.push('/notifications/settings')}
          style={{
            borderRadius: radii.pill,
            borderWidth: 1.5,
            borderColor: onDark(0.3),
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <SansText size={14} weight="bold" color={colors.textOnDark}>
            Manage nudge settings
          </SansText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
