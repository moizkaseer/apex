import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MonoText, SansText, SerifText } from '@/components/ui';
import { colors, onDark, radii, spacing } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { strengthRpeByeSet, strengthSetLabel } from '@/data/mock';

/**
 * Turn 4b — strength set logger. Full-bleed dark workout screen.
 * Source: Fitness Dashboard Options.dc.html lines 2005-2080 (markup),
 * 3701-3717 + 4039-4043 (derived state).
 */
export default function StrengthLoggerScreen() {
  const setsLogged = useAppStore((s) => s.setsLogged);
  const logSet = useAppStore((s) => s.logSet);
  const undoSet = useAppStore((s) => s.undoSet);

  const resting = setsLogged > 0 && setsLogged < 5;
  const allLogged = setsLogged >= 5;
  const strengthCta = allLogged ? 'Next: Romanian deadlift' : `${setsLogged} of 5 sets logged`;

  const sets = [0, 1, 2, 3, 4].map((i) => {
    const logged = i < setsLogged;
    const current = i === setsLogged;
    const onTap = () => {
      if (current) logSet();
      else if (logged && i === setsLogged - 1) undoSet();
    };
    return {
      i,
      n: logged ? '✓' : String(i + 1),
      label: `Set ${i + 1} · ${strengthSetLabel}`,
      meta: logged ? `RPE ${strengthRpeByeSet[i]}` : current ? 'TAP WHEN DONE' : 'WAITING',
      onTap,
      tappable: current || (logged && i === setsLogged - 1),
      bg: current ? colors.inkRaised : 'transparent',
      border: logged ? colors.primary : current ? colors.textOnDark : colors.trackOnDark,
      numBg: logged ? colors.primary : current ? colors.textOnDark : colors.inkRaised,
      numFg: logged ? colors.textOnDark : current ? colors.inkBlack : colors.textOnDarkMuted,
      fg: logged || current ? colors.textOnDark : colors.textSecondary,
      metaColor: logged ? colors.accent : current ? colors.textOnDark : colors.textSecondary,
    };
  });

  const onCta = () => {
    if (allLogged) router.push('/workout/complete');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.inkBlack }}>
      <View style={{ flex: 1, paddingHorizontal: 26, paddingTop: spacing.lg, paddingBottom: spacing.sm }}>
        {/* header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} spaced upper color={colors.textOnDarkMuted}>
            Lower body · 2 of 5 exercises
          </MonoText>
          <MonoText size={10} spaced={false} upper={false} color={colors.textOnDarkMuted}>
            32:14
          </MonoText>
        </View>

        {/* exercise title */}
        <View style={{ marginTop: spacing.lg }}>
          <SerifText size={34} weight="medium" color={colors.textOnDark}>Back squat</SerifText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 }}>
            <MonoText size={11} spaced={false} upper={false} color={colors.textOnDarkSecondary}>5 × 5 @ 122 kg</MonoText>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.accent,
                borderRadius: radii.pill,
                paddingVertical: 3,
                paddingHorizontal: 10,
              }}
            >
              <MonoText size={9.5} spaced={false} upper color={colors.accent}>+2.5 KG VS LAST WEEK</MonoText>
            </View>
          </View>
        </View>

        {/* plate math */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            marginTop: spacing.lg,
            backgroundColor: colors.inkRaised,
            borderRadius: 14,
            padding: spacing.md,
            paddingHorizontal: spacing.lg,
          }}
        >
          <MonoText size={9.5} spaced upper color={colors.textOnDarkMuted}>PER SIDE</MonoText>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            <Plate size={22} bg={colors.warning} fg={colors.inkBlack} fontSize={8} label="25" />
            <Plate size={22} bg={colors.info} fg={colors.textOnDark} fontSize={8} label="20" />
            <Plate size={18} bg={colors.textOnDarkSecondary} fg={colors.inkBlack} fontSize={8} label="5" />
            <Plate size={16} bg={colors.textSecondary} fg={colors.textOnDark} fontSize={7} label=".5" />
          </View>
          <View style={{ flex: 1 }} />
          <MonoText size={10} spaced={false} upper={false} color={colors.textOnDarkSecondary}>bar 20 kg</MonoText>
        </View>

        {/* sets */}
        <View style={{ gap: 9, marginTop: 18 }}>
          {sets.map((st) => (
            <Pressable
              key={st.i}
              onPress={st.onTap}
              disabled={!st.tappable}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: st.bg,
                borderWidth: 1.5,
                borderColor: st.border,
                borderRadius: radii.lg,
                paddingVertical: 14,
                paddingHorizontal: spacing.lg,
                opacity: pressed && st.tappable ? 0.8 : 1,
              })}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: radii.pill,
                  backgroundColor: st.numBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MonoText size={12} weight="semibold" spaced={false} upper={false} color={st.numFg}>{st.n}</MonoText>
              </View>
              <SansText size={15} weight="bold" color={st.fg} style={{ flex: 1 }}>{st.label}</SansText>
              <MonoText size={10.5} spaced={false} upper color={st.metaColor}>{st.meta}</MonoText>
            </Pressable>
          ))}
        </View>

        {resting && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: colors.primary,
              borderRadius: radii.lg,
              paddingVertical: 16,
              paddingHorizontal: 18,
              marginTop: spacing.md,
            }}
          >
            <View>
              <MonoText size={9.5} spaced upper color={onDark(0.7)}>Rest</MonoText>
              <SerifText size={26} weight="medium" color={colors.textOnDark} style={{ marginTop: 2 }}>2:30</SerifText>
            </View>
            <SansText size={12.5} color={onDark(0.8)} style={{ maxWidth: 170, lineHeight: 17.5, textAlign: 'right' }}>
              Full recovery — this is a top set, not a race.
            </SansText>
          </View>
        )}

        {/* up next */}
        <View style={{ backgroundColor: colors.inkRaised, borderRadius: radii.lg, padding: 14, marginTop: spacing.md }}>
          <MonoText size={9.5} spaced upper color={colors.textOnDarkMuted}>Up next</MonoText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
            <SansText size={14.5} weight="bold" color={colors.textOnDark}>Romanian deadlift</SansText>
            <MonoText size={10.5} spaced={false} upper={false} color={colors.textOnDarkMuted}>3 × 8 @ 90 kg</MonoText>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* controls */}
        <View style={{ flexDirection: 'row', gap: spacing.md, paddingVertical: 18 }}>
          <View
            style={{
              width: 92,
              borderWidth: 1.5,
              borderColor: onDark(0.3),
              borderRadius: radii.pill,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SansText size={14} weight="bold" color={colors.textOnDark}>Swap</SansText>
          </View>
          <Pressable
            onPress={onCta}
            disabled={!allLogged}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: colors.textOnDark,
              borderRadius: radii.pill,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed && allLogged ? 0.85 : 1,
            })}
          >
            <SansText size={15} weight="extrabold" color={colors.inkBlack}>{strengthCta}</SansText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Plate({ size, bg, fg, fontSize, label }: { size: number; bg: string; fg: string; fontSize: number; label: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radii.pill,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MonoText size={fontSize} weight="semibold" spaced={false} upper={false} color={fg}>{label}</MonoText>
    </View>
  );
}
