# krill — build a personal iMessage agent with Kernel + Linq

**krill** is a tiny AI agent that lives inside your iMessage/SMS thread. Text it
like a friend and it texts back — and when it needs to, it drives a real cloud
browser to go perform actions and look things up on the internet for you.

It's built on three pieces:

| Piece | What it does | How it's wired |
| --- | --- | --- |
| [**eve**](https://eve.dev) | The agent framework (instructions, tools, channels) | `agent/` folder + `withEve` |
| [**Linq**](https://linqapp.com) | Gives the agent a real phone line for iMessage/SMS | Vercel Connect connector |
| [**Kernel**](https://onkernel.com) | A live cloud browser the agent can drive | `KERNEL_API_KEY` env var |

The AI model itself runs on **Vercel AI Gateway**, which is provisioned
automatically — there's nothing to set up for it.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 24** (`node -v` should print `v24.x`)
- **[pnpm](https://pnpm.io)** (`npm install -g pnpm`)
- A **[Vercel](https://vercel.com) account**, with the **Vercel CLI**
  installed and logged in — the agent deploys here, and Linq is set up
  through Vercel Connect, which requires an authenticated CLI:

  ```bash
  npm install -g vercel
  vercel login
  ```

  (See the [Vercel CLI docs](https://vercel.com/docs/cli) for other install
  options, e.g. Homebrew.)
- A **[Linq](https://linqapp.com) account** with at least one phone number/line
- A **[Kernel](https://onkernel.com) account** (for the cloud browser)

---

## 1. Clone the repo

```bash
git clone https://github.com/kernel/eve-imessage-agent.git
cd eve-imessage-agent
```

---

## 2. Install

```bash
pnpm install
```

This installs the minimal Next.js app and the eve agent runtime.

---

## 3. Connect Linq (the iMessage line)

Linq is what gives krill an actual phone number people can text. It's connected
through **Vercel Connect**, so you never paste raw API tokens.

The channel's code (`agent/channels/linq.ts`) is already committed in this
repo, so **don't** run the plain `eve add channel/linq` — it tries to write
that file again and will refuse, since it already exists, without ever
reaching the setup wizard. Instead, run it with `--skip-install`, which skips
the file-write step and only runs the interactive Vercel Connect/Linq setup:

```bash
pnpm exec eve add channel/linq --skip-install
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

## 4. Connect Kernel (the cloud browser)

Kernel gives krill a real browser it can drive to fetch live info from the web.
This one uses a simple shared API key so every texter gets the same browser with
no per-person login.

1. Grab your API key from the [Kernel dashboard](https://dashboard.onkernel.com/kernel/api-keys).
2. Add it as an environment variable named **`KERNEL_API_KEY`** (see the next
   step for where).

The wiring lives in [`agent/extensions/kernel.ts`](agent/extensions/kernel.ts) —
it just reads `process.env.KERNEL_API_KEY`.

---

## 5. Set your environment variables

Set this on your Vercel project **before you deploy** — without it, krill's
browser tool fails as soon as anyone texts it something that needs a lookup:

```bash
vercel env add KERNEL_API_KEY production
```

(paste the key from the [Kernel dashboard](https://dashboard.onkernel.com/kernel/api-keys)
when prompted). This needs a Vercel project already linked — if step 3 didn't set
one up for you (e.g. you used portable Linq credentials instead of Vercel
Connect) and you haven't run `eve deploy` yet, run `vercel link` first. You
can also add it from the dashboard instead (**Settings → Environment
Variables**), and for local development, put it in a `.env.local` file.

| Variable | Required? | What it's for |
| --- | --- | --- |
| `KERNEL_API_KEY` | **Yes** | Your Kernel cloud-browser API key (step 4). |

The AI model credential (`AI_GATEWAY_API_KEY`) is provisioned automatically on
Vercel, so you don't need to add it.

> Adding or changing an env var after you've already deployed? Redeploy
> (`pnpm exec eve deploy`, step 7) for it to take effect — Vercel doesn't
> inject new env vars into a build that already ran.

### Who can text krill?

There's no custom allowlist to configure — krill is personal by construction.
Linq only routes messages from conversations tied to the account/line you
connected in step 3, so krill only ever hears from people who have that
number. Nothing else to set up here.

---

## 6. Run it locally

```bash
pnpm dev
```

This starts the minimal root Next.js app together with the eve agent. To
exercise the agent directly in a local REPL:

```bash
pnpm exec eve dev
```

---

## 7. Deploy

```bash
pnpm exec eve deploy
```

This links a Vercel project first if you haven't already, then deploys
straight to production (pushing to GitHub with the Vercel integration
enabled, or running `vercel --prod` yourself, both work too). Because the
project is wrapped with `withEve`, this deploys the agent — including the
`/eve/v1/*` webhook routes Linq delivers to — alongside the minimal root
Next.js app eve needs to build.

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
- **No landing page:** krill's real interface is the phone number, so there's
  intentionally no marketing/status page in this repo — just the agent and
  the minimal Next.js shell `withEve` needs to build and deploy it.

---

## Project layout

```
agent/
├── agent.ts              # model + runtime config
├── instructions.md       # krill's system prompt (voice & behavior)
├── channels/linq.ts      # the iMessage/SMS channel
└── extensions/kernel.ts  # the Kernel cloud-browser credential
app/                      # minimal Next.js root eve needs to build/deploy
```

---

## Learn more

- eve docs: <https://eve.dev/docs>
- Linq channel guide: <https://eve.dev/docs/channels/linq>
- Kernel: <https://onkernel.com>
