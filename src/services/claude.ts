import { getAccessToken } from './supabase';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

/** POSTs JSON to our API with the signed-in user's session token attached. */
async function postApi(path: string, body: unknown): Promise<Response> {
  const token = await getAccessToken();
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** AI coach chat (turn 7). `context` is arbitrary JSON — readiness, recent training, meal log, etc. */
export async function chatWithCoach(messages: ChatMessage[], context?: Record<string, unknown>): Promise<string> {
  try {
    const res = await postApi('/api/claude/chat', { messages, context });
    if (!res.ok) throw new Error(await res.text());
    const json = (await res.json()) as { reply: string };
    return json.reply;
  } catch (err) {
    console.warn('[claude] chatWithCoach failed, falling back to canned reply', err);
    return "I can't reach the coaching model right now — try again in a moment.";
  }
}

export interface MealAnalysis {
  items: { name: string; grams: number; kcal: number; proteinG: number }[];
  confidencePct: number;
}

/** Meal photo -> macro breakdown (turn 5). base64 excludes the `data:image/...;base64,` prefix. */
export async function analyzeMealPhoto(base64: string, mediaType = 'image/jpeg'): Promise<MealAnalysis | null> {
  try {
    const res = await postApi('/api/claude/vision', { imageBase64: base64, mediaType, kind: 'meal' });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as MealAnalysis;
  } catch (err) {
    console.warn('[claude] analyzeMealPhoto failed', err);
    return null;
  }
}

export interface ProgressAnalysis {
  verdict: string;
  estBodyFatPct: number;
  notes: string[];
}

/** Progress photo -> body-comp read (turn 6). */
export async function analyzeProgressPhoto(base64: string, mediaType = 'image/jpeg'): Promise<ProgressAnalysis | null> {
  try {
    const res = await postApi('/api/claude/vision', { imageBase64: base64, mediaType, kind: 'progress' });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as ProgressAnalysis;
  } catch (err) {
    console.warn('[claude] analyzeProgressPhoto failed', err);
    return null;
  }
}
