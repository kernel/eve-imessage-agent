import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const DEPLOY_TEMPLATE_URL = "https://github.com/kernel/eve-imessage-agent"

// small satellite bubbles that rise past krill's own bubble
const RISING_BUBBLES = [
  { left: "-6%", size: 9, delay: 0.2, duration: 5.5, drift: "10px" },
  { left: "108%", size: 6, delay: 1.6, duration: 6.5, drift: "-8px" },
  { left: "18%", size: 5, delay: 3, duration: 5, drift: "6px" },
  { left: "92%", size: 8, delay: 2.2, duration: 7, drift: "-14px" },
  { left: "58%", size: 4, delay: 4.2, duration: 5.8, drift: "4px" },
]

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-8 text-center">
      <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-150 rounded-full bg-accent/20 blur-3xl"
        />

        {/* rising bubbles pass behind and in front of krill's bubble */}
        {RISING_BUBBLES.map((b, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="krill-bubble absolute bottom-0 rounded-full border border-accent/50 bg-accent/10"
            style={
              {
                left: b.left,
                width: b.size,
                height: b.size,
                "--bubble-drift": b.drift,
                "--bubble-opacity": 0.6,
                animation: `krill-rise ${b.duration}s ease-in ${b.delay}s infinite`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* krill's own bubble: a glassy sphere that bobs and wobbles */}
        <div
          className="krill-bubble-main relative flex h-44 w-44 items-center justify-center rounded-full sm:h-52 sm:w-52"
          style={{ animation: "krill-bob 7s ease-in-out infinite" }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_38%,oklch(0.9_0.03_200)_0%,oklch(0.78_0.05_210)_55%,oklch(0.6_0.07_220)_100%)] shadow-2xl shadow-accent/20" />
          {/* iridescent soap-film rim */}
          <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent/40 [background:conic-gradient(from_140deg,oklch(0.78_0.12_197/0.35),oklch(0.76_0.14_24/0.25),transparent_35%,oklch(0.85_0.08_190/0.3),transparent_70%,oklch(0.78_0.12_197/0.35))] [mask-image:radial-gradient(circle,transparent_78%,black_82%)]" />
          {/* glossy highlight streak */}
          <div
            aria-hidden="true"
            className="krill-shine pointer-events-none absolute left-[14%] top-[10%] h-10 w-16 rounded-full bg-white/50 blur-md"
            style={{ animation: "krill-shimmer 6s ease-in-out infinite" }}
          />
          <Image
            src="/krill-hero.png"
            alt="krill, a tiny translucent coral-pink krill with big shy sparkling eyes and blushing cheeks"
            width={320}
            height={320}
            priority
            className="relative h-[78%] w-[78%] object-contain mix-blend-multiply"
          />
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
            "a tiny, translucent, faintly-nervous little krill drifting in the big open ocean — who happens to text back."
          }
        </p>
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          className="gap-1.5 rounded-full"
          render={<a href={DEPLOY_TEMPLATE_URL} target="_blank" rel="noopener noreferrer" />}
        >
          deploy your own krill
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
