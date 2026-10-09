import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';

import { ScreenContainer, Card, SerifText, MonoText, SansText, ToggleSwitch } from '@/components/ui';
import { colors, radii, spacing } from '@/theme/tokens';
import { nudgeTypeDefs } from '@/data/mock';
import { useAppStore } from '@/store/useAppStore';
import { notifications } from '@/services';

const SESSION_REMINDER_INDEX = nudgeTypeDefs.findIndex((t) => t.name === 'Session reminders');

function budgetCopy(budget: number): { label: string; note: string } {
  if (budget <= 3) {
    return {
      label: 'ESSENTIALS ONLY',
      note: 'Only fueling windows and recovery alerts make the cut. Everything else stays in the app.',
    };
  }
  if (budget <= 6) {
    return {
      label: 'BALANCED',
      note: `The coach ranks candidates by impact and sends the top ${budget}. Yesterday, 11 competed for 5 slots.`,
    };
  }
  return {
    label: 'EVERYTHING',
    note: 'Generous budget — you’ll also get milestones and minor plan changes as they happen.',
  };
}

/** 12b — Notification controls: daily nudge budget stepper + per-type toggles, wired to real OS permissions. */
export default function NotificationSettingsScreen() {
  const nudgeBudget = useAppStore((s) => s.nudgeBudget);
  const setNudgeBudget = useAppStore((s) => s.setNudgeBudget);
  const nudgeTypes = useAppStore((s) => s.nudgeTypes);
  const toggleNudgeType = useAppStore((s) => s.toggleNudgeType);

  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [scheduled, setScheduled] = useState(false);

  const { label: budgetLabel, note: budgetNote } = budgetCopy(nudgeBudget);

  const onEnableNotifications = async () => {
    const granted = await notifications.requestNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
  };

  const onToggleType = (i: number) => {
    const turningOn = !nudgeTypes[i];
    toggleNudgeType(i);
    if (turningOn && i === SESSION_REMINDER_INDEX) {
      notifications
        .scheduleNudge(
          { title: nudgeTypeDefs[i].name, body: nudgeTypeDefs[i].example.replace(/^"|"$/g, ''), category: 'session' },
          10,
        )
        .then((res) => setScheduled(!!res))
        .catch(() => setScheduled(false));
    }
  };

  return (
    <ScreenContainer>
      <View>
        <SerifText size={28} style={{ marginTop: spacing.sm }}>
          Nudges
        </SerifText>
        <SansText size={13} color={colors.textSecondary} style={{ lineHeight: 19, marginTop: 6 }}>
          Every notification competes for a limited daily budget. The coach sends only its best.
        </SansText>
      </View>

      {/* enable notifications */}
      <Card
        tone="muted"
        radius={radii.md}
        onPress={onEnableNotifications}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16 }}
      >
        <View style={{ flex: 1 }}>
          <SansText size={14} weight="bold">
            Enable notifications
          </SansText>
          <SansText size={12} color={colors.textMuted} style={{ marginTop: 2, lineHeight: 17 }}>
            {permissionStatus === 'granted'
              ? 'Enabled — nudges can reach your lock screen.'
              : permissionStatus === 'denied'
                ? 'Not enabled — allow notifications in system settings.'
                : 'Tap to allow APEX to send real nudges to this device.'}
            {scheduled ? ' Session reminder test fired in ~10s.' : ''}
          </SansText>
        </View>
        <MonoText
          size={10}
          color={permissionStatus === 'granted' ? colors.accent : colors.textMuted}
          upper={false}
          spaced={false}
        >
          {permissionStatus === 'granted' ? 'ON' : 'ENABLE'}
        </MonoText>
      </Card>

      {/* budget */}
      <Card tone="dark" radius={radii.lg}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            Daily budget
          </MonoText>
          <MonoText size={10} color={colors.accent} upper={false} spaced={false}>
            {budgetLabel}
          </MonoText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14 }}>
          <Pressable
            onPress={() => setNudgeBudget(nudgeBudget - 1)}
            style={{
              width: 44,
              height: 44,
              borderRadius: radii.pill,
              borderWidth: 1.5,
              borderColor: 'rgba(250,249,246,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SansText size={20} color={colors.textOnDark}>
              −
            </SansText>
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <SerifText size={44} color={colors.textOnDark} style={{ lineHeight: 44 }}>
              {nudgeBudget}
            </SerifText>
            <SansText size={12} color={colors.textOnDarkSecondary} style={{ marginTop: 4 }}>
              nudges per day, max
            </SansText>
          </View>
          <Pressable
            onPress={() => setNudgeBudget(nudgeBudget + 1)}
            style={{
              width: 44,
              height: 44,
              borderRadius: radii.pill,
              borderWidth: 1.5,
              borderColor: 'rgba(250,249,246,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SansText size={20} color={colors.textOnDark}>
              +
            </SansText>
          </Pressable>
        </View>
        <SansText size={12} color={colors.textOnDarkSecondary} style={{ lineHeight: 18, marginTop: 12 }}>
          {budgetNote}
        </SansText>
      </Card>

      {/* nudge types */}
      <View style={{ gap: 9 }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          What can interrupt you
        </MonoText>
        {nudgeTypeDefs.map((t, i) => (
          <Card
            key={t.name}
            tone="muted"
            radius={radii.md}
            onPress={() => onToggleType(i)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, minHeight: 44 }}
          >
            <View style={{ flex: 1 }}>
              <SansText size={14} weight="bold">
                {t.name}
              </SansText>
              <MonoText size={11.5} color={colors.textMuted} upper={false} spaced={false} style={{ marginTop: 2, lineHeight: 16 }}>
                {t.example}
              </MonoText>
            </View>
            <ToggleSwitch on={!!nudgeTypes[i]} onToggle={() => onToggleType(i)} onColor={colors.primary} />
          </Card>
        ))}
      </View>

      {/* lock-screen preview */}
      <Card tone="muted" radius={radii.md} onPress={() => router.push('/notifications/lock-screen-preview')} style={{ paddingVertical: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <SansText size={13} weight="semibold">
            See what a day of nudges looks like
          </SansText>
          <MonoText size={10} color={colors.primary}>
            Preview →
          </MonoText>
        </View>
      </Card>

      {/* quiet hours */}
      <Card tone="muted" radius={radii.md}>
        <SansText size={12.5} color={colors.textSecondary} style={{ lineHeight: 19 }}>
          <MonoText size={9.5} color={colors.primary} upper spaced>
            quiet hours ·{' '}
          </MonoText>
          Nothing between 22:00 and 6:30 — sleep beats every nudge. Race-morning alerts are the only exception.
        </SansText>
      </Card>
    </ScreenContainer>
  );
}
