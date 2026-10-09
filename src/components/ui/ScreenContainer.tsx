import { ScrollView, ScrollViewProps, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme/tokens';

interface ScreenContainerProps extends ScrollViewProps {
  tone?: 'screen' | 'dark' | 'canvas';
  edges?: Edge[];
  scroll?: boolean;
  contentStyle?: ViewStyle;
}

const toneBg = { screen: colors.screen, dark: colors.ink, canvas: colors.canvas };

/** Standard screen shell — safe area + scroll body with the design's ~24px horizontal padding. */
export function ScreenContainer({
  tone = 'screen',
  edges = ['top', 'left', 'right'],
  scroll = true,
  contentStyle,
  children,
  ...rest
}: ScreenContainerProps) {
  const body = (
    <View style={[{ paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxxl, gap: spacing.lg }, contentStyle]}>{children}</View>
  );
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: toneBg[tone] }}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} {...rest}>
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}
