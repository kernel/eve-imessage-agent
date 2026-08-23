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

    // Silently ignore anyone not on the allowlist -- no reply, no error, so a
    // stranger who gets ahold of the number can't tell krill even exists.
    if (!isAllowedSender(message.author.userId)) {
      console.log("[v0] ignoring message from non-allowlisted sender", message.author.userId);
      return null;
    }

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
