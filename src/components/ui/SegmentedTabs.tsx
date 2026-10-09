import { View, Pressable } from 'react-native';
import { colors, radii } from '@/theme/tokens';
import { MonoText } from './Text';

interface Segment {
  label: string;
  onPress: () => void;
}

interface SegmentedTabsProps {
  segments: Segment[];
  activeIndex: number;
  activeBg?: string;
  activeFg?: string;
  inactiveBg?: string;
  inactiveFg?: string;
}

/** Pill-group range/pose/tier selector — "4W 12W 6M", "FRONT SIDE BACK". */
export function SegmentedTabs({
  segments,
  activeIndex,
  activeBg = colors.ink,
  activeFg = colors.white,
  inactiveBg = colors.cardMuted,
  inactiveFg = colors.textMuted,
}: SegmentedTabsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {segments.map((s, i) => {
        const active = i === activeIndex;
        return (
          <Pressable
            key={s.label}
            onPress={s.onPress}
            style={{
              paddingVertical: 7,
              paddingHorizontal: 14,
              borderRadius: radii.pill,
              backgroundColor: active ? activeBg : inactiveBg,
            }}
          >
            <MonoText size={10} color={active ? activeFg : inactiveFg} weight="semibold">
              {s.label}
            </MonoText>
          </Pressable>
        );
      })}
    </View>
  );
}
