import {
  getTokenResponse,
  startAuthorization,
  UserAuthorizationRequiredError,
  NoValidTokenError,
  type ConnectTokenSubject,
} from "@vercel/connect";

/** Vercel Connect connector UID for the "AI Gateway Access" connector. */
export const GATEWAY_CONNECTOR = "mcp.vercel.com/ai-gateway-access";

/** The default gateway model id krill uses, shared or per-texter. */
export const DEFAULT_MODEL_ID = "zai/glm-5.2";

/** Builds the Connect subject for one texter, keyed by their Linq user id. */
export function gatewaySubject(senderId: string): ConnectTokenSubject {
  return { type: "user", id: senderId, issuer: "krill" };
}

/**
 * Resolves the texter's own AI Gateway token, or `null` when they haven't
 * connected yet. Never throws for the "not connected" case.
 */
export async function getGatewayToken(senderId: string): Promise<string | null> {
  try {
    const res = await getTokenResponse(GATEWAY_CONNECTOR, {
      subject: gatewaySubject(senderId),
      scopes: ["*"],
    });
    return res.token;
  } catch (err) {
    if (err instanceof UserAuthorizationRequiredError || err instanceof NoValidTokenError) {
      return null;
    }
    throw err;
  }
}

/** Returns a hosted consent URL the texter can open on their phone to connect. */
export async function getGatewayConnectUrl(senderId: string): Promise<string> {
  const { url } = await startAuthorization(GATEWAY_CONNECTOR, {
    subject: gatewaySubject(senderId),
    scopes: ["*"],
  });
  return url;
}

/**
 * Resolves the Vercel team to bill for a texter's own gateway token. A
 * personal token usually sees exactly one team; when it can see more than
 * one, this picks the first rather than blocking the reply on a text-based
 * team picker.
 */
export async function resolveTeamIdOrSlug(token: string): Promise<string | undefined> {
  try {
    const res = await fetch("https://api.vercel.com/v2/teams", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { teams?: Array<{ id: string }> };
    return data.teams?.[0]?.id;
  } catch {
    return undefined;
  }
}
