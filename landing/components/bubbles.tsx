import type { CSSProperties } from "react"

// Fixed (non-random) configs so server and client render identically.
const BUBBLES = [
  { left: "8%", size: 10, delay: 0, duration: 15, opacity: 0.4, drift: "14px" },
  { left: "18%", size: 6, delay: 3, duration: 12, opacity: 0.3, drift: "-10px" },
  { left: "27%", size: 14, delay: 6, duration: 18, opacity: 0.35, drift: "18px" },
  { left: "39%", size: 8, delay: 1.5, duration: 13, opacity: 0.45, drift: "-8px" },
  { left: "51%", size: 5, delay: 8, duration: 11, opacity: 0.3, drift: "12px" },
  { left: "62%", size: 12, delay: 4, duration: 17, opacity: 0.4, drift: "-16px" },
  { left: "71%", size: 7, delay: 9, duration: 14, opacity: 0.35, drift: "10px" },
  { left: "82%", size: 9, delay: 2, duration: 16, opacity: 0.4, drift: "-12px" },
  { left: "91%", size: 5, delay: 6.5, duration: 12, opacity: 0.3, drift: "8px" },
  { left: "45%", size: 4, delay: 11, duration: 10, opacity: 0.25, drift: "-6px" },
]

export function Bubbles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* abyssal depth wash: darker toward the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-[oklch(0.14_0.04_240)]" />

      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="krill-bubble absolute bottom-[-20px] rounded-full border border-accent/40 bg-accent/10"
          style={
            {
              left: b.left,
              width: b.size,
              height: b.size,
              animation: `krill-rise ${b.duration}s linear ${b.delay}s infinite`,
              "--bubble-opacity": b.opacity,
              "--bubble-drift": b.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
