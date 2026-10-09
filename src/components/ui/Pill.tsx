import { View, Pressable, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';
import { MonoText, SansText } from './Text';

interface PillProps {
  label: string;
  bg?: string;
  color?: string;
  onPress?: () => void;
  mono?: boolean;
  size?: 'sm' | 'md';
}

/** Rounded-full tag/badge — status labels, tab chips, filter chips. */
export function Pill({ label, bg = colors.cardMuted, color = colors.textPrimary, onPress, mono = true, size = 'md' }: PillProps) {
  const body = (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          paddingVertical: size === 'sm' ? 4 : 6,
          paddingHorizontal: size === 'sm' ? 10 : 14,
        },
      ]}
    >
      {mono ? (
        <MonoText size={size === 'sm' ? 9 : 10} color={color}>
          {label}
        </MonoText>
      ) : (
        <SansText size={size === 'sm' ? 12 : 13} weight="semibold" color={color}>
          {label}
        </SansText>
      )}
    </View>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress}>{body}</Pressable>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
});
