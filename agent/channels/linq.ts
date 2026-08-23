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
    //
    // This whole block is wrapped so that NOTHING here can throw its way out
    // of onMessage -- an unhandled rejection here makes krill silently fail to
    // respond at all. On any trouble we still try to send a friendly note and
    // then drop the turn.
    let token: string | null = null;
    try {
      token = await getGatewayToken(senderId);
    } catch (err) {
      console.log("[v0] getGatewayToken threw for sender", senderId, err);
      token = null;
    }

    if (!token) {
      const firstName = (message.author.fullName ?? "").trim().split(/\s+/)[0];
      const hello = firstName ? `u-um... hi ${firstName}!` : "u-um... hi!";

      let url: string | null = null;
      try {
        url = await getGatewayConnectUrl(senderId);
      } catch (err) {
        console.log("[v0] getGatewayConnectUrl threw for sender", senderId, err);
      }

      const body = url
        ? [
            `${hello} i'm krill~ before we can chat, you'll need to connect your own (free) Vercel AI Gateway account, so our conversations run on your credits and not a shared little pool.`,
            "",
            "tap here to connect (it only takes a moment):",
            url,
            "",
            "...then just text me again and i'll be right here! (i'm a little shy, but i promise i'll do my best~)",
          ].join("\n")
        : `${hello} i'm krill~ i'm having a little trouble reaching the connect service right now (sorry!). could you try texting me again in a moment?`;

      try {
        await ctx.thread.post(body);
      } catch (err) {
        console.log("[v0] ctx.thread.post threw while sending connect prompt", err);
      }
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
