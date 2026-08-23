import { connectLinqCredentials } from "@vercel/connect/eve";
import { linqChannel } from "eve/channels/linq";

// Comma-separated allowlist of who may text krill. Despite the name, Linq
// identifies a sender by a stable opaque handle (a UUID like
// "73532a3d-9d24-44aa-9142-e0d5b6532efd"), NOT necessarily a phone number --
// so put that exact handle here. Phone-number-style handles are also matched
// leniently (spacing, dashes, parens, and a leading "+"/"1" are ignored).
// Leave unset to allow anyone (no restriction).
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
  // Exact match handles opaque UUID handles and email handles verbatim.
  if (ALLOWED_RAW.has(raw)) return true;

  // Lenient digit match only helps for phone-number-style handles; a UUID
  // won't collide here because its normalized digits won't equal a real
  // 10-digit phone number in the allowlist.
  const digits = normalizeDigits(raw);
  return digits.length >= 10 && ALLOWED_DIGITS.has(digits);
}

export default linqChannel({
  // Vercel Connect connector UID created for this agent's Linq account and
  // phone number(s). Finish the connector's browser setup (creating or
  // linking a Linq line) from the Vercel project settings if this hasn't
  // been completed yet.
  credentials: connectLinqCredentials("linq/krill-imessage"),
  onMessage(_ctx, message) {
    if (message.author.isBot) return null;

    // TEMPORARILY DISABLED for an isolation test: confirming whether the Linq
    // connector itself does any inbound number filtering, independent of our
    // own allowlist. Still logging what our gate WOULD have decided. Re-enable
    // the `return null` drop below once the test is done.
    console.log("[v0] allowlist check (drop disabled for test)", {
      userId: message.author.userId,
      wouldBeAllowed: isAllowedSender(message.author.userId),
    });
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
      context: [`The sender is ${message.author.fullName}.`],
    };
  },
});
