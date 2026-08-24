# krill — build a personal iMessage agent with Kernel + Linq

**krill** is a tiny AI agent that lives inside your iMessage/SMS thread. Text it
like a friend and it texts back — and when it needs to, it drives a real cloud
browser to go look things up on the live web for you.

It's built on three pieces:

| Piece | What it does | How it's wired |
| --- | --- | --- |
| [**eve**](https://eve.dev) | The agent framework (instructions, tools, channels) + the Next.js landing page | `agent/` folder + `withEve` |
| [**Linq**](https://linqapp.com) | Gives the agent a real phone line for iMessage/SMS | Vercel Connect connector |
| [**Kernel**](https://onkernel.com) | A live cloud browser the agent can drive | `KERNEL_API_KEY` env var |

The AI model itself runs on **Vercel AI Gateway**, which is provisioned
automatically — there's nothing to set up for it.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 24** (`node -v` should print `v24.x`)
- **[pnpm](https://pnpm.io)** (`npm install -g pnpm`)
- A **[Vercel](https://vercel.com) account** (the agent deploys here, and both
  connectors are set up through Vercel Connect)
- A **[Linq](https://linqapp.com) account** with at least one phone number/line
- A **[Kernel](https://onkernel.com) account** (for the cloud browser)

---

## 1. Install

```bash
pnpm install
```

This installs both the Next.js frontend and the eve agent runtime.

---

## 2. Connect Linq (the iMessage line)

Linq is what gives krill an actual phone number people can text. It's connected
through **Vercel Connect**, so you never paste raw API tokens.

From the project root, run:

```bash
pnpm exec eve add channel/linq
```

This opens a browser flow where you:

1. Sign in with **Vercel Connect** (it links or creates a Vercel project for you).
2. Choose to **create a managed Linq account + line**, or **connect an existing
   Linq account** with its partner API token.
3. **Select the phone number(s)** you want krill to use.

eve then configures the connector and the inbound webhook for you. The channel
itself is already defined in [`agent/channels/linq.ts`](agent/channels/linq.ts)
and points at the connector UID `linq/krill-imessage`.

> If you named your connector something different, update the UID in
> `connectLinqCredentials("linq/krill-imessage")` to match.

---

## 3. Connect Kernel (the cloud browser)

Kernel gives krill a real browser it can drive to fetch live info from the web.
This one uses a simple shared API key so every texter gets the same browser with
no per-person login.

1. Grab your API key from the [Kernel dashboard](https://onkernel.com).
2. Add it as an environment variable named **`KERNEL_API_KEY`** (see the next
   step for where).

The wiring lives in [`agent/extensions/kernel.ts`](agent/extensions/kernel.ts) —
it just reads `process.env.KERNEL_API_KEY`.

---

## 4. Set your environment variables

Add these in your Vercel project (**Settings → Environment Variables**), or in a
local `.env.local` for development:

| Variable | Required? | What it's for |
| --- | --- | --- |
| `KERNEL_API_KEY` | **Yes** | Your Kernel cloud-browser API key (step 3). |
| `ALLOWED_PHONE_NUMBERS` | Optional | Restricts who can text krill — see below. |

The AI model credential (`AI_GATEWAY_API_KEY`) is provisioned automatically on
Vercel, so you don't need to add it.

### Making krill *personal* (the allowlist)

By default, anyone who has the number can text krill. To lock it down to just
**you** (or a small circle), set `ALLOWED_PHONE_NUMBERS` to a comma-separated
list of the senders you allow. Anyone else is silently ignored — no reply, no
hint that the agent exists.

```bash
ALLOWED_PHONE_NUMBERS="73532a3d-9d24-44aa-9142-e0d5b6532efd"
# multiple people:
# ALLOWED_PHONE_NUMBERS="handle-or-number-1, handle-or-number-2"
```

**Important gotcha:** despite the variable name, Linq usually identifies a
sender by a **stable opaque handle** (a UUID like the example above), *not* a
phone number. Phone-number-style handles are matched leniently (spacing,
dashes, and a leading `+1` are ignored), but the reliable value to use is the
sender's exact handle.

**How to find your handle:** the easiest way is to deploy first with the
allowlist unset (so krill replies to everyone), text it, and ask *"what is my
handle?"* — krill can read back the exact `userId` it sees. Paste that value
into `ALLOWED_PHONE_NUMBERS` and redeploy.

---

## 5. Run it locally

```bash
pnpm dev
```

This starts the Next.js app (the landing page) together with the eve agent. To
exercise the agent directly in a local REPL:

```bash
pnpm exec eve dev
```

---

## 6. Deploy

Push the project to Vercel (via the dashboard, the GitHub integration, or
`vercel`). Because the project is wrapped with `withEve`, the landing page and
the agent — including the `/eve/v1/*` webhook routes Linq delivers to — build
and deploy together as one project.

Once deployed, **text your Linq number** and krill will text back.

> Changes to the agent (instructions, allowlist, connectors) only take effect on
> the **deployed** app — the inbound webhook runs in production, not in local
> preview.

---

## Making krill your own

- **Personality & behavior:** [`agent/instructions.md`](agent/instructions.md)
  is krill's system prompt. Rewrite it to give your agent any voice you like.
- **The model:** [`agent/agent.ts`](agent/agent.ts) sets the model ID
  (`provider/model` form, e.g. `anthropic/claude-opus-4.8`).
- **The landing page:** everything under `app/` and `components/` is a normal
  Next.js + Tailwind site describing your agent.

---

## Project layout

```
agent/
├── agent.ts              # model + runtime config
├── instructions.md       # krill's system prompt (voice & behavior)
├── channels/linq.ts      # the iMessage/SMS channel + personal allowlist
└── extensions/kernel.ts  # the Kernel cloud-browser credential
app/                      # Next.js landing page
components/               # landing-page UI
```

---

## Learn more

- eve docs: <https://eve.dev/docs>
- Linq channel guide: <https://eve.dev/docs/channels/linq>
- Kernel: <https://onkernel.com>
