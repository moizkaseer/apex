/**
 * Server-only proxy to Claude's vision capability for meal photo logging and
 * progress photo body-composition analysis (turns 5 & 6 of the design).
 * Output is constrained to a JSON schema, so the response always parses.
 */
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

import { chargeQuota, requireUser } from '@/server/auth';
import { FALLBACK_BETA, MODEL, getClient, rateLimit, readJson, upstreamError } from '@/server/claude';

const MealAnalysis = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      grams: z.number(),
      kcal: z.number(),
      proteinG: z.number(),
    }),
  ),
  confidencePct: z.number(),
});

const ProgressAnalysis = z.object({
  verdict: z.string(),
  estBodyFatPct: z.number(),
  notes: z.array(z.string()),
});

const MEAL_PROMPT = `Identify every distinct food item in this photo and estimate each portion visually.
Be decisive — this feeds a calorie tracker. confidencePct is your overall confidence (0-100)
that the items and portions are right. If the photo shows no food, return an empty items list
with confidencePct 0.`;

const PROGRESS_PROMPT = `This is a physique progress-check photo. "verdict" is one encouraging but honest
sentence about visible change. "estBodyFatPct" is a rough visual estimate only. "notes" are 2-4
short, specific visual observations (posture, muscle definition, waist, symmetry). Do not
diagnose health conditions or comment on anything outside visible physique change.`;

// ~1.5M base64 chars ≈ 1.1 MB image; the app resizes to 1024 px before upload.
const MAX_IMAGE_B64 = 1_500_000;

const VisionRequest = z.object({
  imageBase64: z.string().min(100).max(MAX_IMAGE_B64),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  kind: z.enum(['meal', 'progress']),
});

export async function POST(request: Request) {
  const client = getClient();
  if (!client) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }, { status: 501 });
  }

  const auth = await requireUser(request);
  if ('error' in auth) return auth.error;

  const limited = rateLimit(request, 'vision', 10, auth.user?.id);
  if (limited) return limited;

  const read = await readJson(request, MAX_IMAGE_B64 + 1_000);
  if ('error' in read) return read.error;
  const parsed = VisionRequest.safeParse(read.body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid image request.' }, { status: 400 });
  }
  const { imageBase64, mediaType, kind } = parsed.data;

  const image = { type: 'image' as const, source: { type: 'base64' as const, media_type: mediaType, data: imageBase64 } };

  const overQuota = await chargeQuota(auth.user, 'vision');
  if (overQuota) return overQuota;

  try {
    const response =
      kind === 'meal'
        ? await client.beta.messages.parse({
            model: MODEL,
            max_tokens: 8_000,
            output_config: { effort: 'medium', format: betaZodOutputFormat(MealAnalysis) },
            betas: [FALLBACK_BETA],
            fallbacks: 'default',
            messages: [{ role: 'user', content: [image, { type: 'text', text: MEAL_PROMPT }] }],
          })
        : await client.beta.messages.parse({
            model: MODEL,
            max_tokens: 8_000,
            output_config: { effort: 'medium', format: betaZodOutputFormat(ProgressAnalysis) },
            betas: [FALLBACK_BETA],
            fallbacks: 'default',
            messages: [{ role: 'user', content: [image, { type: 'text', text: PROGRESS_PROMPT }] }],
          });

    if (response.stop_reason === 'refusal' || !response.parsed_output) {
      return Response.json({ error: 'Could not analyze this photo.' }, { status: 422 });
    }
    return Response.json(response.parsed_output);
  } catch (err) {
    return upstreamError(err);
  }
}
