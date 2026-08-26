import { connectLinqCredentials } from "@vercel/connect/eve";
import { linqChannel } from "eve/channels/linq";

export default linqChannel({
  // Vercel Connect connector UID created for this agent's Linq account and
  // phone number(s). Finish the connector's browser setup (creating or
  // linking a Linq line) from the Vercel project settings if this hasn't
  // been completed yet.
  //
  // No onMessage/allowlist here -- Linq only routes messages from
  // conversations tied to this connected account/line, so it already
  // isolates krill to the people who have the number.
  credentials: connectLinqCredentials("linq/krill-imessage"),
});
