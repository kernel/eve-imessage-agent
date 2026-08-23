import { connectLinqCredentials } from "@vercel/connect/eve";
import { linqChannel } from "eve/channels/linq";
import { getGatewayConnectUrl, getGatewayToken } from "../lib/gateway";

export default linqChannel({
  // Vercel Connect connector UID created for this agent's Linq account and
  // phone number(s). Finish the connector's browser setup (creating or
  // linking a Linq line) from the Vercel project settings if this hasn't
  // been completed yet.
  credentials: connectLinqCredentials("linq/krill-imessage"),
  async onMessage(ctx, message) {
    if (message.author.isBot) return null;

    const senderId = message.author.userId;

    // Hard gate: krill runs every model call on the texter's OWN Vercel AI
    // Gateway account -- there is no shared credential. If this texter hasn't
    // connected yet, reply with a canned (non-model) message containing their
    // personal connect link and drop the message so NO model call happens.
    const token = await getGatewayToken(senderId);
    if (!token) {
      const url = await getGatewayConnectUrl(senderId);
      const firstName = (message.author.fullName ?? "").trim().split(/\s+/)[0];
      const hello = firstName ? `u-um... hi ${firstName}!` : "u-um... hi!";
      await ctx.thread.post(
        [
          `${hello} i'm krill~ before we can chat, you'll need to connect your own (free) Vercel AI Gateway account, so our conversations run on your credits and not a shared little pool.`,
          "",
          "tap here to connect (it only takes a moment):",
          url,
          "",
          "...then just text me again and i'll be right here! (i'm a little shy, but i promise i'll do my best~)",
        ].join("\n"),
      );
      return null;
    }

    return {
      // Key the session to the texter's own Linq user id (their iMessage
      // handle / phone number) so per-texter AI Gateway auth and dynamic
      // model resolution in agent.ts can identify them.
      auth: {
        attributes: { fullName: message.author.fullName ?? "" },
        authenticator: "linq",
        principalId: senderId,
        principalType: "user",
      },
      context: [`The sender is ${message.author.fullName}.`],
    };
  },
});
