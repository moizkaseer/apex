import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, fontFamily } from '@/theme/tokens';

type Weight = 'regular' | 'medium' | 'semibold';

interface SerifProps extends TextProps {
  size?: number;
  weight?: Weight;
  color?: string;
}

const serifFamily: Record<Weight, string> = {
  regular: fontFamily.serifRegular,
  medium: fontFamily.serif,
  semibold: fontFamily.serifSemibold,
};

/** Newsreader serif — hero numbers, headings, big kcal/weight figures. */
export function SerifText({ size = 24, weight = 'medium', color = colors.textPrimary, style, ...rest }: SerifProps) {
  return <RNText style={[{ fontFamily: serifFamily[weight], fontSize: size, color, letterSpacing: -0.3 }, style]} {...rest} />;
}

interface MonoProps extends TextProps {
  size?: number;
  weight?: Weight;
  color?: string;
  spaced?: boolean;
  upper?: boolean;
}

const monoFamily: Record<Weight, string> = {
  regular: fontFamily.monoRegular,
  medium: fontFamily.mono,
  semibold: fontFamily.monoSemibold,
};

/** IBM Plex Mono — uppercase labels, timestamps, data readouts. Matches the design's ubiquitous mono-cap treatment. */
export function MonoText({
  size = 10,
  weight = 'medium',
  color = colors.textMuted,
  spaced = true,
  upper = true,
  style,
  ...rest
}: MonoProps) {
  return (
    <RNText
      style={[
        {
          fontFamily: monoFamily[weight],
          fontSize: size,
          color,
          letterSpacing: spaced ? size * 0.12 : 0,
          textTransform: upper ? 'uppercase' : 'none',
        },
        style,
      ]}
      {...rest}
    />
  );
}

interface SansProps extends TextProps {
  size?: number;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
}

const sansFamily: Record<NonNullable<SansProps['weight']>, string> = {
  regular: fontFamily.sans,
  medium: fontFamily.sansMedium,
  semibold: fontFamily.sansSemibold,
  bold: fontFamily.sansBold,
  extrabold: fontFamily.sansExtrabold,
};

/** Manrope — the default body/UI sans used everywhere else. */
export function SansText({ size = 14, weight = 'regular', color = colors.textPrimary, style, ...rest }: SansProps) {
  return <RNText style={[{ fontFamily: sansFamily[weight], fontSize: size, color }, style]} {...rest} />;
}

export const textStyles = StyleSheet.create({
  base: { color: colors.textPrimary },
});
