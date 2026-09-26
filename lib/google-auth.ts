export type GoogleIdentity = {
  subject: string;
  email: string;
  displayName: string;
};

export type GoogleClaims = {
  aud?: string | string[];
  email?: string;
  email_verified?: boolean;
  exp?: number;
  iat?: number;
  iss?: string;
  name?: string;
  sub?: string;
};

type GoogleJwk = JsonWebKey & { alg?: string; kid?: string; use?: string };
type GoogleJwks = { keys?: GoogleJwk[] };

let cachedKeys: GoogleJwk[] = [];
let cachedUntil = 0;

function base64UrlBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function decodeSegment<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(base64UrlBytes(value))) as T;
}

export function validateGoogleClaims(claims: GoogleClaims, clientId: string, nowSeconds = Math.floor(Date.now() / 1000)): GoogleIdentity | null {
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  const validIssuer = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
  if (!validIssuer || !audiences.includes(clientId)) return null;
  if (!claims.exp || claims.exp <= nowSeconds || (claims.iat && claims.iat > nowSeconds + 60)) return null;
  if (!claims.sub || !claims.email || claims.email_verified !== true) return null;
  const email = claims.email.trim().toLowerCase();
  if (!email || email.length > 254) return null;
  return { subject: claims.sub, email, displayName: claims.name?.trim() || email.split("@")[0] };
}

async function googleKeys(): Promise<GoogleJwk[]> {
  if (cachedKeys.length && cachedUntil > Date.now()) return cachedKeys;
  const response = await fetch("https://www.googleapis.com/oauth2/v3/certs", {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Impossible de vérifier l’identité Google");
  const payload = await response.json() as GoogleJwks;
  cachedKeys = payload.keys ?? [];
  cachedUntil = Date.now() + 60 * 60 * 1000;
  return cachedKeys;
}

export async function verifyGoogleCredential(credential: string, clientId: string): Promise<GoogleIdentity | null> {
  const parts = credential.split(".");
  if (parts.length !== 3 || credential.length > 12_000) return null;
  let header: { alg?: string; kid?: string };
  let claims: GoogleClaims;
  try {
    header = decodeSegment(parts[0]);
    claims = decodeSegment(parts[1]);
  } catch {
    return null;
  }
  if (header.alg !== "RS256" || !header.kid) return null;
  const jwk = (await googleKeys()).find((key) => key.kid === header.kid && key.kty === "RSA");
  if (!jwk) return null;
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlBytes(parts[2]) as BufferSource,
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  return verified ? validateGoogleClaims(claims, clientId) : null;
}
