import { createGateway } from "ai";
import { defineAgent, defineDynamic } from "eve";
import { DEFAULT_MODEL_ID, getGatewayToken, resolveTeamIdOrSlug } from "./lib/gateway";

export default defineAgent({
  // Resolved per model call (step.started) rather than once per session,
  // because building a texter's own gateway client requires a live
  // LanguageModel bound to their personal AI Gateway token -- session- and
  // turn-scoped selections must serialize to a plain model id string.
  model: defineDynamic({
    events: {
      "step.started": async (_event, ctx) => {
        const senderId = ctx.session.auth.current?.principalId;
        if (!senderId) return DEFAULT_MODEL_ID;

        const token = await getGatewayToken(senderId);
        if (!token) return DEFAULT_MODEL_ID;

        const teamIdOrSlug = await resolveTeamIdOrSlug(token);
        const gateway = createGateway({ apiKey: token, teamIdOrSlug });
        return gateway(DEFAULT_MODEL_ID);
      },
    },
  }),
});
