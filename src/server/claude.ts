/**
 * Server-only helpers shared by the src/app/api/claude/* routes. Never import
 * this from a screen — it reads ANTHROPIC_API_KEY and would leak it into the
 * client bundle.
 */
import Anthropic from '@anthropic-ai/sdk';

// Override per deployment with CLAUDE_MODEL (e.g. claude-sonnet-5-5 for lower cost).
export const MODEL = process.env.CLAUDE_MODEL || 'claude-opus-5-5';

// Server-side refusal fallback: if the model declines, the API re-runs the
// request on Anthropic's recommended fallback model inside the same call.
export const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

let client: Anthropic | null = null;

/** Returns null when ANTHROPIC_API_KEY is unset so routes can answer 501 instead of throwing. */
export function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();
  return client;
}

// ── rate limiting ──
// Fixed-window counter per client IP. In-memory, so it is per server
// instance — enough to stop a leaked URL from draining the API budget until
// per-user limits arrive with accounts (roadmap Phase 1).
const windows = new Map<string, { start: number; count: number }>();

export function rateLimit(request: Request, bucket: string, limit: number, windowMs = 60_000): Response | null {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || now - entry.start >= windowMs) {
    windows.set(key, { start: now, count: 1 });
    if (windows.size > 10_000) pruneWindows(now, windowMs);
    return null;
  }
  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);
    return Response.json(
      { error: 'Too many requests — try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }
  entry.count += 1;
  return null;
}

function pruneWindows(now: number, windowMs: number) {
  for (const [key, entry] of windows) {
    if (now - entry.start >= windowMs) windows.delete(key);
  }
}

// ── request parsing ──

/** Reads a JSON body, rejecting anything over maxBytes before parsing it. */
export async function readJson(request: Request, maxBytes: number): Promise<{ body: unknown } | { error: Response }> {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > maxBytes) {
    return { error: Response.json({ error: 'Request body too large.' }, { status: 413 }) };
  }
  const text = await request.text();
  if (text.length > maxBytes) {
    return { error: Response.json({ error: 'Request body too large.' }, { status: 413 }) };
  }
  try {
    return { body: JSON.parse(text) };
  } catch {
    return { error: Response.json({ error: 'Body must be JSON.' }, { status: 400 }) };
  }
}

/** Maps SDK errors to a response without echoing upstream details to the client. */
export function upstreamError(err: unknown): Response {
  if (err instanceof Anthropic.RateLimitError) {
    return Response.json({ error: 'The coaching model is busy — try again shortly.' }, { status: 503 });
  }
  if (err instanceof Anthropic.APIError) {
    console.error(`[claude] API error ${err.status}:`, err.message);
  } else {
    console.error('[claude] request failed:', err);
  }
  return Response.json({ error: 'The coaching model request failed.' }, { status: 502 });
}
