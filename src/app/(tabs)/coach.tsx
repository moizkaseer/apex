import { useState } from 'react';
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card } from '@/components/ui';
import { colors, spacing, radii, fontFamily } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { chatFull, suggestionSets } from '@/data/mock';
import { claude } from '@/services';

const aiConfigured = !!process.env.EXPO_PUBLIC_API_BASE_URL;

interface Msg {
  who: 'coach' | 'me';
  text: string;
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.who === 'me';
  return (
    <View style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
      <View
        style={{
          maxWidth: '82%',
          backgroundColor: mine ? colors.ink : colors.cardMuted,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderBottomLeftRadius: mine ? 18 : 4,
          borderBottomRightRadius: mine ? 4 : 18,
        }}
      >
        <SansText size={14} color={mine ? colors.textOnDark : colors.textPrimary} style={{ lineHeight: 22 }}>
          {msg.text}
        </SansText>
      </View>
    </View>
  );
}

export default function CoachScreen() {
  const chatStep = useAppStore((s) => s.chatStep);
  const advanceChatStep = useAppStore((s) => s.advanceChatStep);

  // Seeded with the design's scripted opening exchange; grows as the user sends messages.
  const [messages, setMessages] = useState<Msg[]>(chatFull.slice(0, 3).map((m) => ({ who: m.who, text: m.text })));
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');

  const suggestions = suggestionSets[Math.min(chatStep, 1)];

  async function send(text: string) {
    if (!text.trim() || typing) return;
    const history = [...messages, { who: 'me' as const, text }];
    setMessages(history);
    setDraft('');
    setTyping(true);

    let reply: string;
    if (aiConfigured) {
      reply = await claude.chatWithCoach(
        history.map((m) => ({ role: m.who === 'me' ? ('user' as const) : ('assistant' as const), content: m.text })),
        { readiness: useAppStore.getState().readiness },
      );
    } else {
      // Unconfigured backend: fall back to the design's scripted continuation.
      const scriptedNext = chatFull.find((m, i) => i >= history.length && m.who === 'coach');
      reply =
        scriptedNext?.text ??
        'Noted — I’ll fold that into tomorrow’s plan. (Connect the coaching backend in Settings to chat for real.)';
      await new Promise((r) => setTimeout(r, 700));
    }
    setMessages((m) => [...m, { who: 'coach', text: reply }]);
    setTyping(false);
    advanceChatStep();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg, flexGrow: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <SerifText size={30}>Coach</SerifText>
          <MonoText size={11} color={colors.primary} upper={false}>
            ● sees all your data
          </MonoText>
        </View>

        {/* pending plan change — deep link into the turn-7 proposal detail */}
        <Card tone="muted" onPress={() => router.push('/coach-chat')} style={{ paddingVertical: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <SansText size={13} weight="semibold">
              Plan change proposed — Saturday&rsquo;s long run
            </SansText>
            <MonoText size={10} color={colors.primary}>
              Review →
            </MonoText>
          </View>
        </Card>

        <View style={{ gap: spacing.md, flex: 1 }}>
          {messages.map((m, i) => (
            <Bubble key={i} msg={m} />
          ))}
          {typing ? (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  backgroundColor: colors.cardMuted,
                  paddingVertical: 14,
                  paddingHorizontal: 18,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  borderBottomRightRadius: 18,
                  borderBottomLeftRadius: 4,
                }}
              >
                <MonoText size={11} upper={false} spaced={false}>
                  coach is thinking…
                </MonoText>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{ gap: spacing.sm, paddingBottom: spacing.xs }}>
          <MonoText size={9.5}>Suggested</MonoText>
          <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
            {suggestions.map((s) => (
              <Pressable
                key={s}
                onPress={() => send(s)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.borderStrong,
                  borderRadius: radii.pill,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  backgroundColor: colors.screen,
                }}
              >
                <SansText size={13} weight="bold">
                  {s}
                </SansText>
              </Pressable>
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              backgroundColor: colors.cardMuted,
              borderRadius: radii.pill,
              paddingVertical: 6,
              paddingLeft: 18,
              paddingRight: 6,
              marginTop: spacing.xxs,
            }}
          >
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => send(draft)}
              placeholder="Ask anything…"
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, fontSize: 14, fontFamily: fontFamily.sans, color: colors.textPrimary, paddingVertical: 8 }}
            />
            <Pressable
              onPress={() => send(draft)}
              style={{
                width: 40,
                height: 40,
                borderRadius: radii.pill,
                backgroundColor: colors.ink,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: 9,
                  borderLeftColor: colors.textOnDark,
                  borderTopWidth: 6,
                  borderTopColor: 'transparent',
                  borderBottomWidth: 6,
                  borderBottomColor: 'transparent',
                  marginLeft: 3,
                }}
              />
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
