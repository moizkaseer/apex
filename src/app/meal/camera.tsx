import { useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonoText, SansText } from '@/components/ui';
import { colors, radii, spacing, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { prepareForAnalysis } from '@/services/image';

/** 5a — meal camera capture: real device viewfinder + shutter, mirrors the design's dark full-bleed camera screen. */
export default function MealCameraScreen() {
  const shotTaken = useAppStore((s) => s.shotTaken);
  const takeShot = useAppStore((s) => s.takeShot);
  const retakeShot = useAppStore((s) => s.retakeShot);
  const setLastPhotoBase64 = useAppStore((s) => s.setLastPhotoBase64);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted]);

  const onShutter = async () => {
    if (shotTaken) return;
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
      if (photo) setLastPhotoBase64(await prepareForAnalysis(photo.uri, photo.width, photo.height));
    } catch (err) {
      console.warn('[meal/camera] capture failed', err);
    }
    takeShot();
  };

  const onRetake = () => retakeShot();
  const onUsePhoto = () => router.push('/meal/analysis');

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.inkBlack }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.xxl, paddingTop: spacing.md, paddingBottom: spacing.lg }}>
        {/* header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SansText size={14} weight="bold" color={colors.textOnDark}>Snap a meal</SansText>
          <Pressable onPress={() => router.back()}>
            <MonoText size={10} color={colors.textOnDarkMuted}>close</MonoText>
          </Pressable>
        </View>

        {/* viewfinder */}
        <View
          style={{
            position: 'relative',
            borderRadius: radii.xl,
            overflow: 'hidden',
            marginTop: spacing.lg,
            height: 420,
            backgroundColor: colors.inkDeep,
          }}
        >
          {permission?.granted ? (
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
              <MonoText size={10} color={colors.textOnDarkMuted} style={{ textAlign: 'center', lineHeight: 18 }}>
                {permission?.canAskAgain === false
                  ? 'camera access denied\nenable it in settings'
                  : 'requesting camera access…'}
              </MonoText>
            </View>
          )}

          {/* corner brackets */}
          <View style={[cornerStyle.base, { top: 14, left: 14, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 6 }]} />
          <View style={[cornerStyle.base, { top: 14, right: 14, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 6 }]} />
          <View style={[cornerStyle.base, { bottom: 14, left: 14, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 6 }]} />
          <View style={[cornerStyle.base, { bottom: 14, right: 14, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 6 }]} />

          {shotTaken && (
            <View
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(16,16,16,0.55)',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: radii.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <SansText size={18} color={colors.textOnDark}>✓</SansText>
              </View>
              <MonoText size={10} color={colors.textOnDark}>FRAME LOOKS GOOD</MonoText>
            </View>
          )}
        </View>

        {/* tip */}
        <View style={{ backgroundColor: colors.inkRaised, borderRadius: radii.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <SansText size={12.5} color={colors.textOnDarkSecondary} style={{ lineHeight: 18 }}>
            <MonoText size={9.5} color={colors.accent}>TIP · </MonoText>
            Shoot from above, get the whole plate in frame. Cutlery helps me judge portion size.
          </SansText>
        </View>

        <View style={{ flex: 1 }} />

        {/* shutter row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.lg, paddingHorizontal: spacing.md }}>
          <View style={{ width: 46, height: 46, borderRadius: radii.md, backgroundColor: colors.inkRaised, alignItems: 'center', justifyContent: 'center' }}>
            <MonoText size={8} color={colors.textOnDarkMuted} style={{ textAlign: 'center' }}>last{'\n'}meal</MonoText>
          </View>
          <Pressable
            onPress={onShutter}
            style={{
              width: 74,
              height: 74,
              borderRadius: radii.pill,
              borderWidth: 4,
              borderColor: onDark(0.85),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 58, height: 58, borderRadius: radii.pill, backgroundColor: shotTaken ? colors.primary : colors.textOnDark }} />
          </Pressable>
          <View style={{ width: 46, height: 46, borderRadius: radii.pill, backgroundColor: colors.inkRaised, alignItems: 'center', justifyContent: 'center' }}>
            <MonoText size={9} color={colors.textOnDarkMuted}>flip</MonoText>
          </View>
        </View>

        {shotTaken && (
          <View style={{ flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.lg }}>
            <Pressable
              onPress={onRetake}
              style={{ width: 92, borderWidth: 1.5, borderColor: onDark(0.3), borderRadius: radii.pill, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}
            >
              <SansText size={13.5} weight="bold" color={colors.textOnDark}>Retake</SansText>
            </Pressable>
            <Pressable
              onPress={onUsePhoto}
              style={{ flex: 1, backgroundColor: colors.textOnDark, borderRadius: radii.pill, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}
            >
              <SansText size={14} weight="extrabold" color={colors.inkBlack}>Use photo → analyze</SansText>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const cornerStyle = {
  base: { position: 'absolute' as const, width: 26, height: 26, borderColor: onDark(0.6) },
};
