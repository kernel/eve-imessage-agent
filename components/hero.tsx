export function Hero() {
  return (
    <section className="flex flex-col items-center gap-8 text-center">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-125 rounded-full bg-accent/25 blur-3xl"
        />
        {/* krill's little face — a translucent bioluminescent bead in the deep */}
        <div className="flex h-40 w-40 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-b from-secondary/70 to-card shadow-2xl shadow-accent/20 sm:h-48 sm:w-48">
          <div className="flex flex-col items-center gap-1">
            <span aria-hidden="true" className="font-display text-4xl text-accent sm:text-5xl">
              {"( \u02d8 \u03c9 \u02d8 )"}
            </span>
            <span aria-hidden="true" className="text-xs tracking-widest text-primary/80">
              ~ krill ~
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
          lives in your imessage
        </span>
        <h1 className="font-display text-5xl font-bold leading-tight text-foreground text-balance sm:text-6xl">
          hi, i&apos;m <span className="text-primary">krill</span>
          <span className="text-accent"> ~</span>
        </h1>
        <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {
            "a tiny, translucent, faintly-nervous little krill drifting in the big open ocean — who happens to text back. small creature, big heart, and one very loud opinion about freedom."
          }
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <div className="w-full rounded-3xl rounded-br-md bg-primary px-5 py-3 text-left text-primary-foreground shadow-lg">
          <p className="text-[15px] leading-snug">
            {"u-um... hi! (\u2019\u03c9\u2019) you can text me anything, and i\u2019ll do my little best~"}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          text krill on the number your ocean-keeper set up
        </p>
      </div>
    </section>
  )
}
