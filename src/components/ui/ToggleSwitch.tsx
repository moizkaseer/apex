import { Pressable, View } from 'react-native';
import { colors } from '@/theme/tokens';

interface ToggleSwitchProps {
  on: boolean;
  onToggle: () => void;
  onColor?: string;
  offColor?: string;
}

/** iOS-style pill switch — coach prefs, nudge type toggles. */
export function ToggleSwitch({ on, onToggle, onColor = colors.primary, offColor = colors.trackAlt }: ToggleSwitchProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        backgroundColor: on ? onColor : offColor,
        padding: 3,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          backgroundColor: colors.white,
          transform: [{ translateX: on ? 18 : 0 }],
        }}
      />
    </Pressable>
  );
}
