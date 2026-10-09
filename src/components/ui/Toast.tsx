import { View, Pressable } from 'react-native';
import { colors, radii, spacing, shadow } from '@/theme/tokens';
import { SansText } from './Text';

interface ToastProps {
  text: string;
  onDismiss?: () => void;
}

/** Small floating confirmation banner — quick-action taps, logged confirmations. */
export function Toast({ text, onDismiss }: ToastProps) {
  return (
    <Pressable onPress={onDismiss}>
      <View
        style={[
          {
            backgroundColor: colors.ink,
            borderRadius: radii.lg,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
          },
          shadow.raised,
        ]}
      >
        <SansText size={13} weight="medium" color={colors.white} style={{ lineHeight: 18 }}>
          {text}
        </SansText>
      </View>
    </Pressable>
  );
}
