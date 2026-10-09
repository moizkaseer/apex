/**
 * Server-only proxy to Claude's vision capability for meal photo logging and
 * progress photo body-composition analysis (turns 5 & 6 of the design).
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const MODEL = 'claude-sonnet-5';

const MEAL_PROMPT = `Identify every distinct food item in this photo. Reply with ONLY minified JSON:
{"items":[{"name":string,"grams":number,"kcal":number,"proteinG":number}],"confidencePct":number}
Estimate portion sizes visually. Be decisive — this feeds a calorie tracker, not a hedge.`;

const PROGRESS_PROMPT = `This is a physique progress-check photo. Reply with ONLY minified JSON:
{"verdict":string,"estBodyFatPct":number,"notes":[string]}
"verdict" is one encouraging but honest sentence about visible change. "notes" are 2-4 short,
specific visual observations (posture, muscle definition, waist, symmetry). Do not diagnose
health conditions or comment on anything outside visible physique change.`;

export async function POST(request: Request) {
  if (!ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }, { status: 501 });
  }

  const { imageBase64, mediaType, kind } = (await request.json()) as {
    imageBase64: string;
    mediaType: string;
    kind: 'meal' | 'progress';
  };

  const prompt = kind === 'meal' ? MEAL_PROMPT : PROGRESS_PROMPT;

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
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: prompt },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    return Response.json({ error: 'Claude vision request failed', detail: await res.text() }, { status: 502 });
  }

  const json = (await res.json()) as { content: { type: string; text?: string }[] };
  const text = json.content.find((b) => b.type === 'text')?.text ?? '{}';
  try {
    const parsed = JSON.parse(text.trim().replace(/^```json\s*|```$/g, ''));
    return Response.json(parsed);
  } catch {
    return Response.json({ error: 'Could not parse model output', raw: text }, { status: 502 });
  }
}
