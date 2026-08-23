import { createGateway } from "ai";
import { defineAgent, defineDynamic } from "eve";
import { DEFAULT_MODEL_ID, getGatewayToken, resolveTeamIdOrSlug } from "./lib/gateway";

export default defineAgent({
  // Resolved per model call (step.started) rather than once per session,
  // because building a texter's own gateway client requires a live
  // LanguageModel bound to their personal AI Gateway token -- session- and
  // turn-scoped selections must serialize to a plain model id string.
  //
  // IMPORTANT: this resolver runs on EVERY step (including every tool step,
  // e.g. the Kernel browser), so it must NEVER throw. A thrown error here
  // kills the whole turn silently -- krill just stops replying. Any time we
  // can't build the texter's own gateway client, we fall back to the shared
  // default model id string so krill keeps working instead of going dead.
  model: defineDynamic({
    events: {
      "step.started": async (_event, ctx) => {
        try {
          const senderId = ctx.session.auth.current?.principalId;
          if (!senderId) return DEFAULT_MODEL_ID;

          const token = await getGatewayToken(senderId);
          if (!token) return DEFAULT_MODEL_ID;

          const teamIdOrSlug = await resolveTeamIdOrSlug(token);
          const gateway = createGateway({ apiKey: token, teamIdOrSlug });
          return gateway(DEFAULT_MODEL_ID);
        } catch (err) {
          console.log("[v0] per-user gateway resolve failed; using default model", err);
          return DEFAULT_MODEL_ID;
        }
      },
    },
  }),
});
