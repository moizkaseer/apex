import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/** Foreground presentation for local nudges — matches the design's lock-screen nudge mocks (turn 12). */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

export interface NudgePayload {
  title: string;
  body: string;
  category?: string;
}

/** Schedules a one-off local nudge — fueling windows, session reminders, sleep protection (turn 12 toggle list). */
export async function scheduleNudge(payload: NudgePayload, secondsFromNow: number) {
  if (Platform.OS === 'web') return null;
  const granted = await requestNotificationPermission();
  if (!granted) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title: payload.title, body: payload.body, data: { category: payload.category } },
    trigger: { seconds: Math.max(1, secondsFromNow), type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL },
  });
}

export async function cancelAllNudges() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getPushToken(): Promise<string | null> {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return null;
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (err) {
    console.warn('[notifications] getPushToken failed (needs a physical device + EAS project id)', err);
    return null;
  }
}
