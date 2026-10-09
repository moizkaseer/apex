/**
 * Expo Router API route (server-only — never bundled into the client).
 * Handles the Strava OAuth code/refresh exchange so STRAVA_CLIENT_SECRET
 * stays off-device. Requires EXPO_PUBLIC_STRAVA_CLIENT_ID and
 * STRAVA_CLIENT_SECRET to be set wherever this is deployed (or `expo start`
 * for local dev).
 */
import { rateLimit } from '@/server/claude';

const CLIENT_ID = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET ?? '';

export async function POST(request: Request) {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return Response.json({ error: 'Strava is not configured on the server (missing client id/secret).' }, { status: 501 });
  }

  const limited = rateLimit(request, 'strava-token', 10);
  if (limited) return limited;

  const body = (await request.json()) as { code?: string; refreshToken?: string };

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    ...(body.code
      ? { code: body.code, grant_type: 'authorization_code' }
      : body.refreshToken
        ? { refresh_token: body.refreshToken, grant_type: 'refresh_token' }
        : {}),
  });

  if (!body.code && !body.refreshToken) {
    return Response.json({ error: 'Provide either `code` or `refreshToken`.' }, { status: 400 });
  }

  const res = await fetch('https://www.strava.com/oauth/token', { method: 'POST', body: params });
  if (!res.ok) {
    return Response.json({ error: 'Strava token exchange failed', detail: await res.text() }, { status: 502 });
  }

  const json = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    athlete?: { id: number };
  };

  return Response.json({
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: json.expires_at,
    athleteId: json.athlete?.id ?? 0,
  });
}
