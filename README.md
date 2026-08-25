# krill — build a personal iMessage agent with Kernel + Linq

<p align="center">
  <img src="public/krill-hero.png" alt="krill, a small pink translucent shrimp-like mascot" width="240" />
</p>

**krill** is a tiny AI agent that lives inside your iMessage/SMS thread. Text it
like a friend and it texts back — and when it needs to, it drives a real cloud
browser to go perform actions and look things up on the internet for you.

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
- A **[Vercel](https://vercel.com) account**, with the
  **[Vercel CLI](https://vercel.com/docs/cli) installed and logged in**
  (`vercel login`) — the agent deploys here, and Linq is set up through Vercel
  Connect, which requires an authenticated CLI
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

This walks you through:

1. Choosing **Set up Vercel Connect** (it links or creates a Vercel project for you).
2. A **"Name your Linq agent"** prompt. **Type `krill-imessage`** here — don't
   accept the suggested default. The channel is already defined in
   [`agent/channels/linq.ts`](agent/channels/linq.ts), hardcoded to the
   connector UID `linq/krill-imessage`; the name you enter here becomes that
   connector's UID (`vercel connect create linq --name <name>` under the
   hood), so it has to match exactly or krill won't find its credentials.
3. Choosing which Linq account to use:
   - **Create a new Linq account** (the default) — Linq provisions a brand
     new phone number for you; you don't pick one. It isn't written anywhere
     in the repo — eve prints it once, to the terminal, as a "Text your
     agent" note at the end of setup, so copy it down before you lose the
     output. If you misplace it, it's also visible anytime from your
     [Linq dashboard](https://linqapp.com), which lists the number for the
     account/line you just created.
   - **Use an existing Linq account** — paste your Linq partner API token
     and eve lists every phone number already tied to it so you can pick
     which one(s) krill uses.

eve then configures the connector and the inbound webhook for you.

> If you already ran this with a different name, either re-run
> `vercel connect create linq --name krill-imessage` to create a matching
> connector, or update the UID in
> `connectLinqCredentials("linq/krill-imessage")` in `agent/channels/linq.ts`
> to match the name you used.

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

The AI model credential (`AI_GATEWAY_API_KEY`) is provisioned automatically on
Vercel, so you don't need to add it.

### Who can text krill?

There's no custom allowlist to configure — krill is personal by construction.
Linq only routes messages from conversations tied to the account/line you
connected in step 2, so krill only ever hears from people who have that
number. Nothing else to set up here.

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
├── channels/linq.ts      # the iMessage/SMS channel
└── extensions/kernel.ts  # the Kernel cloud-browser credential
app/                      # Next.js landing page
components/               # landing-page UI
```

---

## Learn more

- eve docs: <https://eve.dev/docs>
- Linq channel guide: <https://eve.dev/docs/channels/linq>
- Kernel: <https://onkernel.com>
