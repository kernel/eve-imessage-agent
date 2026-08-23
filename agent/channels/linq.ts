import { connectLinqCredentials } from "@vercel/connect/eve";
import { linqChannel } from "eve/channels/linq";

// Comma-separated allowlist of who may text krill, e.g.
// "+15551234567, +15559876543". Leave unset to allow anyone (no restriction).
// Entries are matched against the sender's Linq handle both verbatim (so
// Apple-ID email handles work) and as normalized digits (so phone numbers
// match regardless of spacing, dashes, parens, or a leading "+"/"1").
const ALLOWED_RAW = new Set(
  (process.env.ALLOWED_PHONE_NUMBERS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean),
);

function normalizeDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

const ALLOWED_DIGITS = new Set(
  [...ALLOWED_RAW].map(normalizeDigits).filter((digits) => digits.length > 0),
);

function isAllowedSender(userId: string): boolean {
  // No allowlist configured -> no restriction.
  if (ALLOWED_RAW.size === 0) return true;

  const raw = userId.trim();
  if (ALLOWED_RAW.has(raw)) return true;

  const digits = normalizeDigits(raw);
  return digits.length > 0 && ALLOWED_DIGITS.has(digits);
}

export default linqChannel({
  // Vercel Connect connector UID created for this agent's Linq account and
  // phone number(s). Finish the connector's browser setup (creating or
  // linking a Linq line) from the Vercel project settings if this hasn't
  // been completed yet.
  credentials: connectLinqCredentials("linq/krill-imessage"),
  onMessage(_ctx, message) {
    if (message.author.isBot) return null;

    // TEMPORARY DIAGNOSTIC: log the exact identity Linq reports for the sender
    // so we can lock ALLOWED_PHONE_NUMBERS to the precise value. iMessage may
    // report an Apple-ID email instead of a phone number, which would silently
    // fail the allowlist. Remove this block once the handle is confirmed.
    console.log("[v0] inbound sender identity", {
      userId: message.author.userId,
      fullName: message.author.fullName,
      wouldBeAllowed: isAllowedSender(message.author.userId),
      allowlistConfigured: ALLOWED_RAW.size > 0,
    });

    // TEMPORARILY DISABLED so krill replies to everyone while we capture the
    // real handle above. Re-enable this drop once the allowlist is verified.
    // if (!isAllowedSender(message.author.userId)) {
    //   console.log("[v0] ignoring message from non-allowlisted sender", message.author.userId);
    //   return null;
    // }

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
      context: [
        `The sender is ${message.author.fullName}.`,
        // TEMPORARY DIAGNOSTIC: expose the exact Linq handle so it can be read
        // back in-thread to configure the allowlist. Remove this line (and the
        // matching instruction in instructions.md) once the handle is captured.
        `[diagnostic] This sender's exact Linq handle (userId) is: "${message.author.userId}". If the sender asks what their handle or userId is, reply with this exact string verbatim, including any punctuation.`,
      ],
    };
  },
});
