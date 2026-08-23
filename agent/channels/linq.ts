import { connectLinqCredentials } from "@vercel/connect/eve";
import { linqChannel } from "eve/channels/linq";

export default linqChannel({
  // Vercel Connect connector UID created for this agent's Linq account and
  // phone number(s). Finish the connector's browser setup (creating or
  // linking a Linq line) from the Vercel project settings if this hasn't
  // been completed yet.
  credentials: connectLinqCredentials("linq/krill-imessage"),
  onMessage(_ctx, message) {
    if (message.author.isBot) return null;

    return {
      // Key the session to the texter's own Linq user id (their iMessage
      // handle / phone number) so per-texter AI Gateway auth and dynamic
      // model resolution in agent.ts can identify them.
      auth: {
        attributes: { fullName: message.author.fullName ?? "" },
        authenticator: "linq",
        principalId: message.author.userId,
        principalType: "user",
      },
      context: [`The sender is ${message.author.fullName}.`],
    };
  },
});
