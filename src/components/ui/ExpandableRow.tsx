import { View } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';
import { Card } from './Card';
import { SansText, MonoText } from './Text';

interface ExpandableRowProps {
  title: string;
  subtitle?: string;
  /** Optional leading element (e.g. a day/dot column, a photo-slot avatar) rendered before the title block. */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  isOpen: boolean;
  onPress: () => void;
  tone?: 'screen' | 'muted' | 'dark';
  children?: React.ReactNode;
}

/**
 * The "tap a row, border darkens, detail rows fade in below" pattern used for
 * plan days, meals, recovery factors, connections, why-sources, milestones...
 */
export function ExpandableRow({ title, subtitle, leading, trailing, isOpen, onPress, tone = 'screen', children }: ExpandableRowProps) {
  const dark = tone === 'dark';
  return (
    <Card tone={tone} bordered selected={isOpen} onPress={onPress}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }}>
        {leading}
        <View style={{ flex: 1, gap: 2 }}>
          <SansText size={14} weight="semibold" color={dark ? colors.textOnDark : colors.textPrimary}>
            {title}
          </SansText>
          {subtitle ? (
            <MonoText size={9.5} color={dark ? colors.textOnDarkSecondary : colors.textMuted}>
              {subtitle}
            </MonoText>
          ) : null}
        </View>
        {trailing}
      </View>
      {isOpen && children ? (
        <View
          style={{
            marginTop: spacing.md,
            paddingTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: dark ? 'rgba(250,249,246,0.14)' : colors.border,
            gap: spacing.sm,
          }}
        >
          {children}
        </View>
      ) : null}
    </Card>
  );
}

export const rowRadius = radii.lg;
