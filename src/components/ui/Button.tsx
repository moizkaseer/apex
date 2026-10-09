import { Pressable, PressableProps, ActivityIndicator } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';
import { SansText } from './Text';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: 'primary' | 'dark' | 'light' | 'ghost' | 'outline';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyle: Record<NonNullable<ButtonProps['variant']>, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, fg: colors.white },
  dark: { bg: colors.ink, fg: colors.white },
  light: { bg: colors.white, fg: colors.ink },
  ghost: { bg: 'transparent', fg: colors.textSecondary },
  outline: { bg: 'transparent', fg: colors.textPrimary, border: colors.border },
};

/** Full-width pill CTA — the "Start on Apple Watch", "Continue", "Start free trial" pattern. */
export function Button({ label, variant = 'primary', loading = false, fullWidth = true, disabled, ...rest }: ButtonProps) {
  const v = variantStyle[variant];
  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: v.bg,
        borderRadius: radii.pill,
        paddingVertical: 14,
        paddingHorizontal: spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        borderWidth: v.border ? 1 : 0,
        borderColor: v.border,
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
      })}
      {...rest}
    >
      {loading ? <ActivityIndicator color={v.fg} /> : <SansText size={14} weight="bold" color={v.fg}>{label}</SansText>}
    </Pressable>
  );
}
