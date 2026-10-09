import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer, Card, SerifText, MonoText, SansText, Pill, Button } from '@/components/ui';
import { colors, radii, spacing } from '@/theme/tokens';
import { connectionDefs, dataTypeDefs, dataModeLabels } from '@/data/mock';
import { useAppStore } from '@/store/useAppStore';
import { healthkit, strava } from '@/services';
import type { StravaTokens } from '@/services/strava';

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dataModes = useAppStore((s) => s.dataModes);
  const cycleDataMode = useAppStore((s) => s.cycleDataMode);

  const entry = connectionDefs.find((c) => c.key === id);

  // strava real state
  const [stravaTokens, setStravaTokens] = useState<StravaTokens | null>(null);
  const [connecting, setConnecting] = useState(false);
  const stravaConfigured = strava.isStravaConfigured();

  // apple health real state
  const [hkAvailable, setHkAvailable] = useState<boolean | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [hkGranted, setHkGranted] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (id === 'strava') {
      strava
        .getStoredStravaTokens()
        .then((t) => {
          if (!cancelled) setStravaTokens(t);
        })
        .catch(() => {
          if (!cancelled) setStravaTokens(null);
        });
    }
    if (id === 'appleHealth') {
      healthkit
        .isHealthKitAvailable()
        .then((ok) => {
          if (!cancelled) setHkAvailable(ok);
        })
        .catch(() => {
          if (!cancelled) setHkAvailable(null);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleConnectStrava = async () => {
    setConnecting(true);
    try {
      const tokens = await strava.connectStrava();
      setStravaTokens(tokens);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectStrava = async () => {
    await strava.disconnectStrava();
    setStravaTokens(null);
  };

  const handleGrantHealthKit = async () => {
    setRequesting(true);
    try {
      const ok = await healthkit.requestHealthKitAuthorization();
      setHkGranted(ok);
    } finally {
      setRequesting(false);
    }
  };

  if (!entry) {
    return (
      <ScreenContainer>
        <SerifText size={24} style={{ marginTop: spacing.sm }}>
          Unknown integration
        </SerifText>
        <SansText size={13} color={colors.textMuted}>
          Nothing is configured for “{id}”.
        </SansText>
      </ScreenContainer>
    );
  }

  const isStrava = entry.key === 'strava';
  const isAppleHealth = entry.key === 'appleHealth';

  let statusText = entry.status;
  let statusOk = entry.ok;
  if (isStrava) {
    if (stravaTokens) {
      statusText = `Connected · athlete ${stravaTokens.athleteId} · since March 2026`;
      statusOk = true;
    } else if (!stravaConfigured) {
      statusText = 'Not connected';
      statusOk = false;
    }
  }
  if (isAppleHealth && hkAvailable !== null) {
    statusText = hkAvailable ? 'Available on this device · synced 6:41' : 'Not available on this device';
    statusOk = hkAvailable;
  }

  const iconBg = isAppleHealth ? colors.ink : isStrava ? colors.warning : colors.cardFlat;
  const iconFg = isAppleHealth || isStrava ? colors.textOnDark : colors.textSecondary;

  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: spacing.sm }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            backgroundColor: iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MonoText size={12} weight="semibold" spaced={false} upper={false} color={iconFg}>
            {entry.initials}
          </MonoText>
        </View>
        <View style={{ flex: 1 }}>
          <SerifText size={24}>{entry.name}</SerifText>
          <SansText size={12} color={statusOk ? colors.primary : colors.danger}>
            {statusText}
          </SansText>
        </View>
      </View>

      {isStrava && (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Card tone="muted" radius={14} style={{ flex: 1 }}>
            <MonoText size={9}>Imported</MonoText>
            <SerifText size={18} weight="semibold" style={{ marginTop: 4 }}>
              312
            </SerifText>
            <SansText size={11} color={colors.textMuted}>
              activities
            </SansText>
          </Card>
          <Card tone="muted" radius={14} style={{ flex: 1 }}>
            <MonoText size={9}>Last sync</MonoText>
            <SerifText size={18} weight="semibold" style={{ marginTop: 4 }}>
              6:41
            </SerifText>
            <SansText size={11} color={colors.textMuted}>
              this morning
            </SansText>
          </Card>
          <Card tone="muted" radius={14} style={{ flex: 1 }}>
            <MonoText size={9}>Conflicts</MonoText>
            <SerifText size={18} weight="semibold" style={{ marginTop: 4 }}>
              3
            </SerifText>
            <SansText size={11} color={colors.textMuted}>
              auto-resolved
            </SansText>
          </Card>
        </View>
      )}

      {isStrava && !stravaTokens && (
        <View style={{ gap: spacing.xs }}>
          <Button
            label={connecting ? 'Connecting…' : 'Connect Strava'}
            variant="dark"
            loading={connecting}
            disabled={!stravaConfigured}
            onPress={handleConnectStrava}
          />
          {!stravaConfigured && (
            <SansText size={11.5} color={colors.textMuted} style={{ textAlign: 'center' }}>
              Add EXPO_PUBLIC_STRAVA_CLIENT_ID to enable
            </SansText>
          )}
        </View>
      )}

      {isAppleHealth && (
        <View style={{ gap: spacing.xs }}>
          <Button
            label={requesting ? 'Requesting…' : 'Grant access'}
            variant="dark"
            loading={requesting}
            onPress={handleGrantHealthKit}
          />
          {hkGranted !== null && (
            <SansText size={11.5} color={hkGranted ? colors.primary : colors.danger} style={{ textAlign: 'center' }}>
              {hkGranted ? 'Access granted' : 'Access was not granted'}
            </SansText>
          )}
        </View>
      )}

      {/* data types */}
      <View style={{ gap: 9 }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          What {entry.name} can touch — tap to change
        </MonoText>
        {dataTypeDefs.map((d, i) => {
          const mode = dataModes[i] ?? 0;
          const modeFg = mode === 0 ? colors.textMuted : colors.textOnDark;
          const modeBg = mode === 0 ? colors.cardFlat : mode === 1 ? colors.textMutedAlt : colors.primary;
          return (
            <Card
              key={d.name}
              tone="muted"
              radius={radii.md}
              onPress={() => cycleDataMode(i)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, minHeight: 44 }}
            >
              <View style={{ flex: 1 }}>
                <SansText size={14} weight="bold">
                  {d.name}
                </SansText>
                <SansText size={11.5} color={colors.textMuted} style={{ marginTop: 2 }}>
                  {d.sub}
                </SansText>
              </View>
              <Pill label={dataModeLabels[mode]} bg={modeBg} color={modeFg} />
            </Card>
          );
        })}
      </View>

      {isStrava && (
        <Card tone="dark" radius={radii.lg}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            This morning&rsquo;s run · 2 sources
          </MonoText>
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: colors.accent }} />
              <SansText size={13} color={colors.textOnDark} style={{ flex: 1 }}>
                Strava · 12.42 km · GPS + power
              </SansText>
              <MonoText size={9} color={colors.accent}>
                KEPT
              </MonoText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: colors.textMutedAlt }} />
              <SansText size={13} color={colors.textOnDarkSecondary} style={{ flex: 1 }}>
                Apple Watch · 12.38 km · HR only
              </SansText>
              <MonoText size={9} color={colors.textMutedAlt}>
                MERGED HR
              </MonoText>
            </View>
          </View>
          <SansText size={12} color={colors.textOnDarkSecondary} style={{ marginTop: spacing.md, lineHeight: 18 }}>
            Rule: richer file wins, heart rate merged from the watch. One run, no double-counted load.
          </SansText>
        </Card>
      )}

      {isStrava && stravaTokens && (
        <SansText
          size={13}
          weight="bold"
          color={colors.danger}
          style={{ textAlign: 'center', paddingVertical: spacing.xs }}
          onPress={handleDisconnectStrava}
        >
          Disconnect Strava
        </SansText>
      )}
    </ScreenContainer>
  );
}
