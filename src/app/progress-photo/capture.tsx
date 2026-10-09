import { useRef } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { colors, radii, spacing } from '@/theme/tokens';
import { SansText, MonoText } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { poseNames } from '@/data/mock';

/** Turn 6a — guided pose capture with a real camera feed + a dashed "ghost" alignment outline. */
export default function Screen() {
  const ppStep = useAppStore((s) => s.ppStep);
  const ppPose = useAppStore((s) => s.ppPose);
  const ppAdvance = useAppStore((s) => s.ppAdvance);
  const ppReset = useAppStore((s) => s.ppReset);
  const setPpPose = useAppStore((s) => s.setPpPose);

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const ppCaptured = ppStep === 2;
  const ghostColor = ppStep === 0 ? colors.warning : colors.accent;
  const alignMsg = ppStep === 0 ? 'STEP BACK 20 CM — FILL THE OUTLINE' : ppStep === 1 ? 'ALIGNED — HOLD STILL' : 'CAPTURED';
  const alignMsgColor = ppStep === 0 ? colors.warning : colors.accent;
  const ppLeftLabel = ppStep === 2 ? 'Retake' : 'Skip';
  const ppCtaBg = ppStep === 2 ? colors.primary : colors.white;
  const ppCtaFg = ppStep === 2 ? colors.white : colors.inkBlack;
  const isLastPose = ppPose === poseNames.length - 1;
  const ppCtaLabel =
    ppStep === 0 ? 'Align me' : ppStep === 1 ? 'Capture' : isLastPose ? 'See AI comparison' : `Next pose: ${poseNames[ppPose + 1].toLowerCase()} ↺`;

  const handleCta = async () => {
    if (ppStep === 1) {
      // Moving from "aligned" to "captured" — take the real frame.
      try {
        const photo = await cameraRef.current?.takePictureAsync({ base64: false, quality: 0.5, skipProcessing: true });
        void photo;
      } catch {
        // Camera not ready / simulator — fall through, the flow still advances.
      }
      ppAdvance();
      return;
    }
    if (ppStep === 2) {
      if (isLastPose) {
        ppReset();
        router.push('/progress-photo/comparison');
      } else {
        setPpPose(ppPose + 1);
        ppReset();
      }
      return;
    }
    ppAdvance();
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
      <View style={styles.body}>
        <View style={styles.header}>
          <SansText size={14} weight="bold" color={colors.textOnDark}>
            Sunday check-in · wk 28
          </SansText>
          <MonoText size={10} color={colors.textMutedAlt} spaced={false}>
            ✕ later
          </MonoText>
        </View>

        <View style={styles.poseTabs}>
          {poseNames.map((name, i) => {
            const active = i === ppPose;
            return (
              <View
                key={name}
                style={[styles.poseTab, { backgroundColor: active ? colors.white : colors.inkRaised }]}
              >
                <MonoText size={9.5} color={active ? colors.inkBlack : colors.textMutedAlt}>
                  {name}
                </MonoText>
              </View>
            );
          })}
        </View>

        <View style={styles.viewfinder}>
          {permission?.granted ? (
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.permissionFallback]}>
              <MonoText size={10} color={colors.textOnDarkSecondary} style={{ textAlign: 'center' }}>
                CAMERA ACCESS NEEDED
              </MonoText>
              <Button label="Enable camera" variant="light" fullWidth={false} onPress={() => requestPermission()} />
            </View>
          )}

          {/* ghost silhouette alignment guide */}
          <View style={styles.ghostWrap} pointerEvents="none">
            <View style={[styles.ghostBody, { borderColor: ghostColor }]}>
              <View style={[styles.ghostHead, { borderColor: ghostColor }]} />
            </View>
          </View>

          <View style={styles.alignMsgWrap} pointerEvents="none">
            <View style={styles.alignMsgPill}>
              <MonoText size={9.5} color={alignMsgColor} spaced style={{ letterSpacing: 1.4 }}>
                {alignMsg}
              </MonoText>
            </View>
          </View>

          <View style={styles.ghostCaptionWrap} pointerEvents="none">
            <View style={styles.ghostCaptionPill}>
              <MonoText size={9} color={colors.textMutedAlt} spaced={false}>
                ghost: last Sunday&apos;s frame
              </MonoText>
            </View>
          </View>

          {ppCaptured ? (
            <View style={styles.capturedOverlay} pointerEvents="none">
              <View style={styles.capturedCheck}>
                <SansText size={18} color={colors.textOnDark}>
                  ✓
                </SansText>
              </View>
              <MonoText size={10} color={colors.textOnDark} style={{ letterSpacing: 1.4 }}>
                {poseNames[ppPose]} POSE MATCHED · 98%
              </MonoText>
            </View>
          ) : null}
        </View>

        <View style={styles.whyCard}>
          <SansText size={12.5} color={colors.textOnDarkSecondary} style={{ lineHeight: 18 }}>
            <MonoText size={9.5} color={colors.accent} spaced={false} style={{ textTransform: 'uppercase' }}>
              why ·{' '}
            </MonoText>
            Matching last week&apos;s exact pose and lighting is what lets the AI measure real change, not camera tricks.
          </SansText>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.ctaRow}>
          <Pressable onPress={ppReset} style={styles.leftBtn}>
            <SansText size={13.5} weight="bold" color={colors.textOnDark}>
              {ppLeftLabel}
            </SansText>
          </Pressable>
          <Pressable onPress={handleCta} style={[styles.ctaBtn, { backgroundColor: ppCtaBg }]}>
            <SansText size={14.5} weight="extrabold" color={ppCtaFg}>
              {ppCtaLabel}
            </SansText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.inkBlack },
  body: { flex: 1, paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: spacing.md, gap: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  poseTabs: { flexDirection: 'row', gap: spacing.sm, marginTop: 14 },
  poseTab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: radii.pill },
  viewfinder: {
    position: 'relative',
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginTop: 14,
    height: 430,
    backgroundColor: colors.inkRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionFallback: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  ghostWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  ghostBody: {
    width: 150,
    height: 340,
    borderRadius: 80,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.7,
    alignItems: 'center',
    paddingTop: 14,
  },
  ghostHead: { width: 54, height: 54, borderRadius: radii.pill, borderWidth: 2, borderStyle: 'dashed' },
  alignMsgWrap: { position: 'absolute', top: 14, left: 0, right: 0, alignItems: 'center' },
  alignMsgPill: { backgroundColor: 'rgba(16,16,16,0.7)', borderRadius: radii.pill, paddingVertical: 6, paddingHorizontal: 14 },
  ghostCaptionWrap: { position: 'absolute', bottom: 14, left: 0, right: 0, alignItems: 'center' },
  ghostCaptionPill: { backgroundColor: 'rgba(16,16,16,0.7)', borderRadius: radii.pill, paddingVertical: 5, paddingHorizontal: 12 },
  capturedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16,16,16,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  capturedCheck: { width: 44, height: 44, borderRadius: radii.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  whyCard: { backgroundColor: colors.inkRaised, borderRadius: radii.md, paddingVertical: 12, paddingHorizontal: 16, marginTop: 14 },
  ctaRow: { flexDirection: 'row', gap: spacing.md, paddingVertical: 16 },
  leftBtn: {
    width: 92,
    borderWidth: 1.5,
    borderColor: 'rgba(250,249,246,0.3)',
    borderRadius: radii.pill,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtn: { flex: 1, borderRadius: radii.pill, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
});
