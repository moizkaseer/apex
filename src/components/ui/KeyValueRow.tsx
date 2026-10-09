import { View } from 'react-native';
import { colors } from '@/theme/tokens';
import { SansText, MonoText } from './Text';

interface KeyValueRowProps {
  label: string;
  value: string;
  valueColor?: string;
  dark?: boolean;
}

/** The recurring "label ......... VALUE" mono readout row (session steps, macros, splits). */
export function KeyValueRow({ label, value, valueColor, dark = false }: KeyValueRowProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <SansText size={13} color={dark ? colors.textOnDark : colors.textPrimary}>
        {label}
      </SansText>
      <MonoText size={11} spaced={false} upper={false} color={valueColor ?? (dark ? colors.textOnDarkSecondary : colors.textMuted)}>
        {value}
      </MonoText>
    </View>
  );
}
