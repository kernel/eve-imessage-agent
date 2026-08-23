import { defineDynamic, defineInstructions } from "eve/instructions";
import { getGatewayConnectUrl, getGatewayToken } from "../lib/gateway";

/**
 * Once per session, tells krill whether this texter has connected their own
 * Vercel AI Gateway account. If not, hands krill a one-time link it can
 * casually offer -- so the texter's own usage runs on their own account
 * instead of everyone sharing krill's default credential.
 */
export default defineDynamic({
  events: {
    "session.started": async (_event, ctx) => {
      const senderId = ctx.session.auth.current?.principalId;
      if (!senderId) return null;

      const token = await getGatewayToken(senderId);
      if (token) {
        return defineInstructions({
          content: "This texter has already connected their own Vercel AI Gateway account. Do not bring this up again.",
        });
      }

      const url = await getGatewayConnectUrl(senderId);
      return defineInstructions({
        content: [
          "This texter has NOT yet connected their own Vercel AI Gateway account, so they are currently riding on krill's shared, tiny (small krill!) default AI credential.",
          "",
          "In your very next reply, after answering whatever they said, warmly and clearly offer them the option to connect their own free Vercel AI Gateway account so their chats run on their own credits instead of your shared one. Keep it short and in-character, make clear it's optional, and include this exact link on its own line so it's tappable:",
          "",
          url,
          "",
          "If they ask how to connect their own AI account at any later point, give them this same link again. Once they've connected, stop bringing it up.",
        ].join("\n"),
      });
    },
  },
});
