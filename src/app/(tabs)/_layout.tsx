import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme/tokens';
import { MonoText } from '@/components/ui';

const TAB_LABELS: Record<string, string> = {
  today: 'Today',
  train: 'Train',
  fuel: 'Fuel',
  body: 'Body',
  coach: 'Coach',
};

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.screen,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.md,
        paddingBottom: insets.bottom + spacing.sm,
        paddingHorizontal: spacing.lg,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const label = TAB_LABELS[route.name] ?? route.name;
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{ flex: 1, alignItems: 'center', gap: 5 }}
          >
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: focused ? colors.primary : 'transparent' }} />
            <MonoText size={10} weight={focused ? 'semibold' : 'medium'} color={focused ? colors.textPrimary : colors.textMuted}>
              {label}
            </MonoText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="today" />
      <Tabs.Screen name="train" />
      <Tabs.Screen name="fuel" />
      <Tabs.Screen name="body" />
      <Tabs.Screen name="coach" />
    </Tabs>
  );
}
