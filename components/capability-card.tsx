import type { LucideIcon } from "lucide-react"

interface CapabilityCardProps {
  icon: LucideIcon
  title: string
  body: string
}

export function CapabilityCard({ icon: Icon, title, body }: CapabilityCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-accent/40">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}
