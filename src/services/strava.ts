import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

WebBrowser.maybeCompleteAuthSession();

/**
 * Strava OAuth2 (authorization-code flow). Strava does not support PKCE, so
 * the code-for-token exchange needs the app's client secret — that call is
 * proxied through src/app/api/strava/token+api.ts so the secret never ships
 * in the client bundle. This module only needs EXPO_PUBLIC_STRAVA_CLIENT_ID.
 */

const CLIENT_ID = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID ?? '';
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const TOKEN_KEY = 'apex.strava.tokens';

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
};

export interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix seconds
  athleteId: number;
}

export function isStravaConfigured() {
  return CLIENT_ID.length > 0;
}

export async function getStoredStravaTokens(): Promise<StravaTokens | null> {
  const raw = await SecureStore.getItemAsync(TOKEN_KEY);
  return raw ? (JSON.parse(raw) as StravaTokens) : null;
}

async function storeTokens(tokens: StravaTokens) {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
}

export async function disconnectStrava() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/**
 * Kicks off the Strava consent screen, then hands the returned `code` to our
 * backend for the secret-bearing token exchange. Call from a button press —
 * AuthSession opens a native browser sheet.
 */
export async function connectStrava(): Promise<StravaTokens | null> {
  if (!isStravaConfigured()) {
    console.warn('[strava] EXPO_PUBLIC_STRAVA_CLIENT_ID is not set — see .env.example');
    return null;
  }
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'apexfitness', path: 'strava-auth' });
  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    scopes: ['read', 'activity:read_all', 'profile:read_all'],
    extraParams: { approval_prompt: 'auto' },
  });
  const result = await request.promptAsync(discovery);
  if (result.type !== 'success' || !result.params.code) return null;

  const res = await fetch(`${API_BASE}/api/strava/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: result.params.code }),
  });
  if (!res.ok) {
    console.warn('[strava] token exchange failed', await res.text());
    return null;
  }
  const tokens = (await res.json()) as StravaTokens;
  await storeTokens(tokens);
  return tokens;
}

async function refreshIfNeeded(tokens: StravaTokens): Promise<StravaTokens> {
  if (tokens.expiresAt > Date.now() / 1000 + 60) return tokens;
  const res = await fetch(`${API_BASE}/api/strava/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });
  if (!res.ok) return tokens;
  const fresh = (await res.json()) as StravaTokens;
  await storeTokens(fresh);
  return fresh;
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distanceMeters: number;
  movingTimeSec: number;
  averageHeartrate: number | null;
  startDateLocal: string;
}

/** Recent activities for the "8.1 km · 5:32/km · via Strava" style rows. Returns [] if not connected. */
export async function fetchRecentActivities(perPage = 10): Promise<StravaActivity[]> {
  const tokens = await getStoredStravaTokens();
  if (!tokens) return [];
  const fresh = await refreshIfNeeded(tokens);
  const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`, {
    headers: { Authorization: `Bearer ${fresh.accessToken}` },
  });
  if (!res.ok) return [];
  const raw = (await res.json()) as any[];
  return raw.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    distanceMeters: a.distance,
    movingTimeSec: a.moving_time,
    averageHeartrate: a.average_heartrate ?? null,
    startDateLocal: a.start_date_local,
  }));
}
