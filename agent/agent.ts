import { createGateway } from "ai";
import { defineAgent, defineDynamic } from "eve";
import { DEFAULT_MODEL_ID, getGatewayToken, resolveTeamIdOrSlug } from "./lib/gateway";

export default defineAgent({
  // Resolved per model call (step.started) rather than once per session,
  // because building a texter's own gateway client requires a live
  // LanguageModel bound to their personal AI Gateway token -- session- and
  // turn-scoped selections must serialize to a plain model id string.
  //
  // There is deliberately NO shared/default credential fallback: every model
  // call runs on the texter's own Vercel AI Gateway token. The Linq channel
  // (agent/channels/linq.ts) gates unconnected texters before any run starts,
  // so by the time this resolver runs a token should exist. If it somehow
  // doesn't (e.g. the token was revoked mid-session), we throw rather than
  // silently billing a shared account.
  model: defineDynamic({
    events: {
      "step.started": async (_event, ctx) => {
        const senderId = ctx.session.auth.current?.principalId;
        if (!senderId) {
          throw new Error("No authenticated texter on the session; cannot resolve a per-user AI Gateway model.");
        }

        const token = await getGatewayToken(senderId);
        if (!token) {
          throw new Error("This texter has not connected their own Vercel AI Gateway account; refusing to run on a shared credential.");
        }

        const teamIdOrSlug = await resolveTeamIdOrSlug(token);
        const gateway = createGateway({ apiKey: token, teamIdOrSlug });
        return gateway(DEFAULT_MODEL_ID);
      },
    },
  }),
});
