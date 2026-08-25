# krill landing page

This is the marketing page v0 generated for krill — not part of the deployed
agent. It used to live at the project root; it's been moved here so `next
build` at the root only builds krill itself, without the landing page along
for the ride.

## View it locally

```bash
cd landing
pnpm install
pnpm dev
```

## Wire it back into the deployed app

If you want the landing page to actually deploy alongside krill again, move
its pieces back into the root project:

1. Move `landing/app/*`, `landing/components/`, `landing/lib/`,
   `landing/public/`, and `landing/components.json` back to the project root
   (overwriting the root `app/layout.tsx` stub).
2. Merge `landing/package.json`'s `dependencies`/`devDependencies` into the
   root `package.json`.
3. Add `images: { unoptimized: true }` back to the root `next.config.mjs`
   (the landing page uses `next/image`; krill's own code doesn't).
4. Delete this `landing/` directory and its `package.json` /
   `next.config.mjs` / `tsconfig.json`.
