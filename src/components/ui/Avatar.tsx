import { View } from 'react-native';
import { colors } from '@/theme/tokens';
import { MonoText } from './Text';

interface AvatarProps {
  initials: string;
  size?: number;
  bg?: string;
  fg?: string;
}

/** Colored-circle initials avatar used for the athlete + crew members throughout. */
export function Avatar({ initials, size = 40, bg = colors.ink, fg = colors.white }: AvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MonoText size={size * 0.28} color={fg} spaced={false}>
        {initials}
      </MonoText>
    </View>
  );
}
