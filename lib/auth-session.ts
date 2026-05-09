const SESSION_COOKIE_NAME = "nilingua_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: number;
  exp: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSessionSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "nilingua-dev-session-secret"
  );
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + padding);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signPayload(payload: Uint8Array) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, payload as any);
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(userId: number) {
  const payload: SessionPayload = {
    sub: userId,
    exp: Date.now() + SESSION_TTL_MS,
  };

  const payloadBytes = encoder.encode(JSON.stringify(payload));
  const signature = await signPayload(payloadBytes);

  return `${bytesToBase64Url(payloadBytes)}.${signature}`;
}

export async function verifySessionToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split(".");

  if (!payloadPart || !signaturePart) {
    return null;
  }

  try {
    const payloadBytes = base64UrlToBytes(payloadPart);
    const key = await getSigningKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signaturePart) as any,
      payloadBytes as any
    );

    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(decoder.decode(payloadBytes)) as SessionPayload;

    if (typeof payload.sub !== "number" || typeof payload.exp !== "number") {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
