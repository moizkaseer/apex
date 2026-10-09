/**
 * Server-only proxy to the Claude Messages API for the AI coach chat.
 * Keeps ANTHROPIC_API_KEY off the client. See .env.example.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const MODEL = 'claude-sonnet-5';

const COACH_SYSTEM_PROMPT = `You are the AI coach inside APEX, a training app for competitive runners, cyclists,
triathletes and serious lifters. You have access to the athlete's training history, Apple
Health/Strava data, meal logs and body-composition trends supplied in the user message as
JSON context. Answer like a sharp, data-literate human coach: specific numbers, no filler,
willing to disagree with the athlete when the data says so. Keep replies under ~80 words
unless the athlete asks for detail.`;

export async function POST(request: Request) {
  if (!ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }, { status: 501 });
  }

  const { messages, context } = (await request.json()) as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    context?: Record<string, unknown>;
  };

  const anthropicMessages = messages.map((m, i) =>
    i === 0 && context ? { role: m.role, content: `Context: ${JSON.stringify(context)}\n\n${m.content}` } : m
  );

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      system: COACH_SYSTEM_PROMPT,
      messages: anthropicMessages,
    }),
  });

  if (!res.ok) {
    return Response.json({ error: 'Claude request failed', detail: await res.text() }, { status: 502 });
  }

  const json = (await res.json()) as { content: { type: string; text?: string }[] };
  const reply = json.content.find((b) => b.type === 'text')?.text ?? '';
  return Response.json({ reply });
}
