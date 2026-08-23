import Image from "next/image"

const PORTRAIT_BUBBLES = [
  { left: "6%", top: "72%", size: 8, delay: 0.4, duration: 6 },
  { left: "88%", top: "20%", size: 6, delay: 2, duration: 7 },
  { left: "80%", top: "78%", size: 10, delay: 3.5, duration: 5.5 },
  { left: "14%", top: "12%", size: 5, delay: 1.2, duration: 6.5 },
]

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-8 text-center">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-150 rounded-full bg-accent/20 blur-3xl"
        />
        {/* krill's portrait, adrift in the deep sea rather than boxed on white */}
        <div className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_38%,oklch(0.32_0.06_225)_0%,oklch(0.19_0.045_236)_65%,oklch(0.12_0.035_240)_100%)] shadow-2xl shadow-accent/20 ring-1 ring-accent/25 sm:h-52 sm:w-52">
          <Image
            src="/krill-hero.png"
            alt="krill, a tiny translucent coral-pink krill with big shy sparkling eyes and blushing cheeks"
            width={320}
            height={320}
            priority
            className="h-[78%] w-[78%] object-contain mix-blend-multiply"
          />
          {PORTRAIT_BUBBLES.map((b, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="krill-bubble absolute rounded-full border border-accent/50 bg-accent/15"
              style={{
                left: b.left,
                top: b.top,
                width: b.size,
                height: b.size,
                animation: `krill-drift ${b.duration}s ease-in-out ${b.delay}s infinite`,
              }}
            />
          ))}
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
