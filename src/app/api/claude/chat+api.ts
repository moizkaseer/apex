/**
 * Server-only proxy to the Claude Messages API for the AI coach chat.
 * Keeps ANTHROPIC_API_KEY off the client. See .env.example.
 */
import { z } from 'zod';

import { chargeQuota, requireUser } from '@/server/auth';
import { FALLBACK_BETA, MODEL, getClient, rateLimit, readJson, upstreamError } from '@/server/claude';

const COACH_SYSTEM_PROMPT = `You are the AI coach inside APEX, a training app for competitive runners, cyclists,
triathletes and serious lifters. You have access to the athlete's training history, Apple
Health data, meal logs and body-composition trends supplied in the user message as
JSON context. Answer like a sharp, data-literate human coach: specific numbers, no filler,
willing to disagree with the athlete when the data says so. Keep replies under ~80 words
unless the athlete asks for detail. You are not a doctor: for pain, injury or medical
symptoms, say plainly that they should see a professional.`;

const ChatRequest = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(4_000),
      }),
    )
    .min(1)
    .max(40)
    .refine((m) => m[0].role === 'user' && m[m.length - 1].role === 'user', {
      message: 'Conversation must start and end with a user message.',
    }),
  context: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const client = getClient();
  if (!client) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }, { status: 501 });
  }

  const auth = await requireUser(request);
  if ('error' in auth) return auth.error;

  const limited = rateLimit(request, 'chat', 20, auth.user?.id);
  if (limited) return limited;

  const read = await readJson(request, 64_000);
  if ('error' in read) return read.error;
  const parsed = ChatRequest.safeParse(read.body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid chat request.' }, { status: 400 });
  }
  const { messages, context } = parsed.data;

  const anthropicMessages = messages.map((m, i) =>
    i === 0 && context ? { role: m.role, content: `Context: ${JSON.stringify(context)}\n\n${m.content}` } : m,
  );

  const overQuota = await chargeQuota(auth.user, 'chat');
  if (overQuota) return overQuota;

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4_000,
      output_config: { effort: 'low' },
      betas: [FALLBACK_BETA],
      fallbacks: 'default',
      system: COACH_SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    if (response.stop_reason === 'refusal') {
      return Response.json({ reply: "I can't help with that one — ask me about your training, recovery or fuel." });
    }
    const reply = response.content.find((b) => b.type === 'text')?.text ?? '';
    return Response.json({ reply });
  } catch (err) {
    return upstreamError(err);
  }
}
