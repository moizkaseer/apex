import { View, ViewProps, Pressable, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';

type Tone = 'screen' | 'muted' | 'mutedAlt' | 'dark' | 'darkRaised' | 'outline';

const toneBg: Record<Tone, string | undefined> = {
  screen: colors.screen,
  muted: colors.cardMuted,
  mutedAlt: colors.cardMutedAlt,
  dark: colors.ink,
  darkRaised: colors.inkRaised,
  outline: 'transparent',
};

interface CardProps extends ViewProps {
  tone?: Tone;
  onPress?: () => void;
  radius?: number;
  bordered?: boolean;
  selected?: boolean;
  padded?: boolean;
}

/** The rounded-rect container used for nearly every block in the design (readiness card, session card, list rows...). */
export function Card({
  tone = 'screen',
  onPress,
  radius = radii.lg,
  bordered = false,
  selected = false,
  padded = true,
  style,
  children,
  ...rest
}: CardProps) {
  const content = (
    <View
      style={[
        {
          backgroundColor: toneBg[tone],
          borderRadius: radius,
          padding: padded ? spacing.xl : 0,
          borderWidth: bordered ? 1 : 0,
          borderColor: selected ? colors.borderStrong : colors.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
      {content}
    </Pressable>
  );
}

export const cardStyles = StyleSheet.create({
  divider: { height: 1, backgroundColor: colors.border },
});
