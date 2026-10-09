import { View, Pressable } from 'react-native';
import { ScreenContainer, SerifText, SansText, MonoText } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { watchRepPaces } from '@/data/mock';

/**
 * Turn 17 — the Apple Watch companion, rendered as interactive watch-face
 * previews inside the phone app (the real watchOS build would reuse this
 * layout 1:1). Faces: morning glance, live intervals (tap to advance),
 * fueling nudge (tap an action), post-session RPE (tap a number).
 */

const WATCH_W = 224;
const WATCH_H = 272;

function WatchShell({ bg = colors.inkBlack, onPress, children }: { bg?: string; onPress?: () => void; children: React.ReactNode }) {
  const body = (
    <View
      style={{
        width: WATCH_W,
        height: WATCH_H,
        backgroundColor: '#000',
        borderRadius: 56,
        padding: 10,
        alignSelf: 'center',
      }}
    >
      {/* crown + side button */}
      <View style={{ position: 'absolute', right: -6, top: 78, width: 8, height: 42, borderRadius: 4, backgroundColor: '#2a2a28' }} />
      <View style={{ position: 'absolute', right: -4, top: 136, width: 6, height: 26, borderRadius: 3, backgroundColor: '#2a2a28' }} />
      <View style={{ flex: 1, borderRadius: 48, backgroundColor: bg, overflow: 'hidden', paddingVertical: 22, paddingHorizontal: 20 }}>
        {children}
      </View>
    </View>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress}>{body}</Pressable>;
}

function FaceHeader({ id, title, hint }: { id: string; title: string; hint?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl }}>
      <View style={{ backgroundColor: colors.ink, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: 10 }}>
        <MonoText size={11} weight="semibold" color={colors.canvas} spaced={false} upper={false}>
          {id}
        </MonoText>
      </View>
      <SansText size={14} weight="bold">
        {title}
      </SansText>
      {hint ? (
        <SansText size={13} color={colors.textMutedAlt}>
          {hint}
        </SansText>
      ) : null}
    </View>
  );
}

export default function WatchPreview() {
  const readiness = useAppStore((s) => s.readiness);
  const wRep = useAppStore((s) => s.wRep);
  const wAdvanceRep = useAppStore((s) => s.wAdvanceRep);
  const wFuel = useAppStore((s) => s.wFuel);
  const setWFuel = useAppStore((s) => s.setWFuel);
  const wRpe = useAppStore((s) => s.wRpe);
  const setWRpe = useAppStore((s) => s.setWRpe);

  const wDone = wRep >= 5;
  const dim = wDone ? onDark(0.6) : colors.textOnDarkMuted;
  const repStats = [
    { val: wDone ? '148' : String(168 + wRep * 2), label: 'BPM' },
    { val: wDone ? '4:08' : watchRepPaces[wRep], label: '/KM' },
    { val: wDone ? '0' : String(1200 - wRep * 150), label: 'M LEFT' },
  ];

  const rpeMsg =
    wRpe === null
      ? 'SYNCS TO TODAY’S LOG + TOMORROW’S PLAN'
      : wRpe >= 9
        ? `RPE ${wRpe} — TOMORROW’S TEMPO EASES OFF`
        : `RPE ${wRpe} LOGGED — PLAN ON TRACK`;

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
      <View>
        <MonoText size={10}>Apple Watch companion</MonoText>
        <SerifText size={26} style={{ marginTop: spacing.xs, lineHeight: 32 }}>
          Glance, don&rsquo;t read: the wrist gets three numbers max
        </SerifText>
      </View>

      {/* 17a — morning glance */}
      <FaceHeader id="17a" title="Morning glance" />
      <WatchShell>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <MonoText size={9} color={colors.textOnDarkMuted}>
            TUE 14
          </MonoText>
          <MonoText size={9} spaced={false} color={colors.textOnDarkMuted}>
            6:52
          </MonoText>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 46,
              borderWidth: 8,
              borderColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SerifText size={32} color={colors.textOnDark} style={{ lineHeight: 36 }}>
              {readiness}
            </SerifText>
            <MonoText size={7} color={colors.accent}>
              {readiness >= 75 ? 'Primed' : readiness >= 50 ? 'Steady' : 'Recover'}
            </MonoText>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <SansText size={12.5} weight="bold" color={colors.textOnDark}>
            Threshold 5 × 1200m
          </SansText>
          <MonoText size={8.5} color={colors.textOnDarkMuted} style={{ marginTop: 3 }}>
            17:30 · 68 MIN
          </MonoText>
        </View>
      </WatchShell>

      {/* 17b — live intervals */}
      <FaceHeader id="17b" title="Live intervals" hint="Tap face to finish the rep" />
      <WatchShell bg={wDone ? '#1f4a36' : colors.inkBlack} onPress={wAdvanceRep}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={9} color={dim}>
            {wDone ? 'SET COMPLETE' : `REP ${wRep + 1} OF 5`}
          </MonoText>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i < wRep ? colors.accent : i === wRep && !wDone ? colors.textOnDark : onDark(0.25),
                }}
              />
            ))}
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <SerifText size={54} color={colors.textOnDark} style={{ lineHeight: 58 }}>
            {wDone ? '✓' : watchRepPaces[wRep]}
          </SerifText>
          <MonoText size={9} color={dim} style={{ marginTop: 6 }}>
            {wDone ? 'AVG 4:08 — TARGET 4:10' : 'CURRENT PACE · TARGET 4:10'}
          </MonoText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {repStats.map((s) => (
            <View key={s.label} style={{ alignItems: 'center' }}>
              <SansText size={14} weight="extrabold" color={colors.textOnDark}>
                {s.val}
              </SansText>
              <MonoText size={7.5} color={dim}>
                {s.label}
              </MonoText>
            </View>
          ))}
        </View>
      </WatchShell>

      {/* 17c — fueling nudge */}
      <FaceHeader id="17c" title="Fueling nudge" hint="Tap an action" />
      <WatchShell>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              backgroundColor: colors.screen,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MonoText size={7} weight="semibold" color={colors.inkBlack} spaced={false}>
              AX
            </MonoText>
          </View>
          <MonoText size={8.5} color={colors.textOnDarkMuted}>
            FUELING · 16:50
          </MonoText>
        </View>
        {wFuel === null ? (
          <>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <SansText size={15} weight="bold" color={colors.textOnDark} style={{ lineHeight: 21 }}>
                48 g carbs short for squats at 17:30.
              </SansText>
              <MonoText size={9} color={colors.textOnDarkMuted} style={{ marginTop: 6 }}>
                BANANA + RICE CAKE COVERS IT
              </MonoText>
            </View>
            <View style={{ gap: 6 }}>
              <Pressable
                onPress={() => setWFuel('done')}
                style={{ backgroundColor: colors.primary, borderRadius: radii.pill, paddingVertical: 11, alignItems: 'center' }}
              >
                <SansText size={12.5} weight="extrabold" color={colors.textOnDark}>
                  Eating it now
                </SansText>
              </Pressable>
              <Pressable
                onPress={() => setWFuel('skip')}
                style={{ backgroundColor: onDark(0.14), borderRadius: radii.pill, paddingVertical: 11, alignItems: 'center' }}
              >
                <SansText size={12.5} weight="bold" color={colors.textOnDark}>
                  Skip
                </SansText>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: wFuel === 'done' ? colors.primary : onDark(0.14),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SansText size={18} color={colors.textOnDark}>
                {wFuel === 'done' ? '✓' : '—'}
              </SansText>
            </View>
            <SansText size={13} weight="bold" color={colors.textOnDark} style={{ textAlign: 'center', lineHeight: 18 }}>
              {wFuel === 'done' ? 'Logged. Session fueled.' : 'Noted — expect heavy legs on set 4.'}
            </SansText>
            <Pressable onPress={() => setWFuel(null)}>
              <MonoText size={8} color={colors.textOnDarkMuted}>
                RESET DEMO
              </MonoText>
            </Pressable>
          </View>
        )}
      </WatchShell>

      {/* 17d — post-session RPE */}
      <FaceHeader id="17d" title="Post-session · RPE" hint="Tap a number" />
      <WatchShell>
        <MonoText size={8.5} color={colors.textOnDarkMuted}>
          SESSION DONE · 63:40
        </MonoText>
        <SansText size={14} weight="bold" color={colors.textOnDark} style={{ marginTop: spacing.sm, lineHeight: 19 }}>
          How hard did that feel?
        </SansText>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
              const sel = wRpe === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => setWRpe(n)}
                  style={{
                    width: (WATCH_W - 20 - 40 - 4 * 5) / 5,
                    aspectRatio: 1,
                    borderRadius: 9,
                    backgroundColor: sel ? (n >= 9 ? colors.danger : colors.primary) : onDark(0.12),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SansText size={13} weight="extrabold" color={colors.textOnDark}>
                    {n}
                  </SansText>
                </Pressable>
              );
            })}
          </View>
        </View>
        <MonoText
          size={8.5}
          color={wRpe !== null && wRpe >= 9 ? colors.warning : colors.textOnDarkMuted}
          style={{ textAlign: 'center', lineHeight: 13 }}
        >
          {rpeMsg}
        </MonoText>
      </WatchShell>

      <View style={{ height: spacing.md }} />
    </ScreenContainer>
  );
}
