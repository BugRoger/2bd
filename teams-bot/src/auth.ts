import * as jose from "jose";

// Microsoft's OpenID configuration endpoints
const OPENID_METADATA_URL =
  "https://login.botframework.com/v1/.well-known/openid-configuration";

// Cache for JWKS
let jwks: jose.JWTVerifyGetKey | null = null;
let jwksExpiry = 0;

const JWKS_CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getJWKS(): Promise<jose.JWTVerifyGetKey> {
  const now = Date.now();

  if (jwks && now < jwksExpiry) {
    return jwks;
  }

  // Fetch OpenID configuration to get JWKS URI
  const configResponse = await fetch(OPENID_METADATA_URL);
  const config = (await configResponse.json()) as { jwks_uri: string };

  // Create JWKS client
  jwks = jose.createRemoteJWKSet(new URL(config.jwks_uri));
  jwksExpiry = now + JWKS_CACHE_DURATION_MS;

  return jwks;
}

export async function validateToken(
  authHeader: string | undefined
): Promise<boolean> {
  // In development, allow skipping auth validation
  if (process.env.SKIP_AUTH === "true") {
    console.warn("⚠️ Auth validation skipped (SKIP_AUTH=true)");
    return true;
  }

  if (!authHeader) {
    return false;
  }

  // Extract Bearer token
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return false;
  }

  const token = parts[1];

  try {
    const jwks = await getJWKS();

    // Verify the token
    const { payload } = await jose.jwtVerify(token, jwks, {
      // Bot Framework tokens have these issuers
      issuer: [
        "https://api.botframework.com",
        "https://sts.windows.net/d6d49420-f39b-4df7-a1dc-d59a935871db/",
        "https://login.microsoftonline.com/d6d49420-f39b-4df7-a1dc-d59a935871db/v2.0",
      ],
      // Audience should be your bot's App ID
      audience: process.env.MICROSOFT_APP_ID,
    });

    // Additional validation
    if (!payload.serviceurl) {
      console.warn("Token missing serviceurl claim");
    }

    return true;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
}

// Get an access token for calling Teams APIs (sending messages)
let accessToken: string | null = null;
let tokenExpiry = 0;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 5 min buffer)
  if (accessToken && now < tokenExpiry - 5 * 60 * 1000) {
    return accessToken;
  }

  const appId = process.env.MICROSOFT_APP_ID;
  const appPassword = process.env.MICROSOFT_APP_PASSWORD;
  const tenantId = process.env.MICROSOFT_APP_TENANT_ID || "botframework.com";

  if (!appId || !appPassword) {
    throw new Error("Missing MICROSOFT_APP_ID or MICROSOFT_APP_PASSWORD");
  }

  // Request token from Azure AD
  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: appId,
      client_secret: appPassword,
      scope: "https://api.botframework.com/.default",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  accessToken = data.access_token;
  tokenExpiry = now + data.expires_in * 1000;

  return accessToken;
}
